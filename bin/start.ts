import { JSONRPCServer } from "json-rpc-2.0";
import { Session } from "@wharfkit/session";
import { DEFAULT_HOSTNAME, DEFAULT_PORT, HOSTNAME, LOCK_GAS_PRICE, PORT,PROMETHEUS_PORT, DEFAULT_PROMETHEUS_PORT, createSession, METRICS_DISABLED, DEFAULT_METRICS_DISABLED, DEFAULT_VERBOSE, VERBOSE } from "../src/config.js";
import { logger } from "../src/logger.js";
import { DefaultOptions } from "./cli.js";
import { eth_sendRawTransaction } from "../src/eth_sendRawTransaction.js";
import { eth_gasPrice } from "../src/eth_gasPrice.js";
import * as prometheus from "../src/prometheus.js"

export interface StartOptions extends DefaultOptions {
    port?: number;
    metricsListenPort?: number;
    hostname?: string;
    verbose?: boolean;
    lockGasPrice?: string;
    metricsDisabled?: boolean;
}

export function start (options: StartOptions) {
    const port = options.port ?? PORT ?? DEFAULT_PORT;
    const hostname = options.hostname ?? HOSTNAME;
    const metricsDisabled = options.metricsDisabled ?? METRICS_DISABLED ?? DEFAULT_METRICS_DISABLED;
    const metricsListenPort = options.metricsListenPort ?? PROMETHEUS_PORT ?? DEFAULT_PROMETHEUS_PORT;
    const lockGasPrice = options.lockGasPrice ?? LOCK_GAS_PRICE;
    const verbose = options.verbose ?? VERBOSE ?? DEFAULT_VERBOSE;

    // create Wharfkit session
    const session = createSession(options);
    const server = new JSONRPCServer();

    // enable logging if verbose enabled
    if (verbose) {
        logger.settings.type = "json";
        console.log(banner(session, port, hostname, metricsListenPort, metricsDisabled));
    }

    server.addMethod("eth_sendRawTransaction", async params => {
        prometheus.sendRawTransaction.requests?.inc();
        const result = await eth_sendRawTransaction(session, params)
        prometheus.sendRawTransaction.success?.inc();
        return result;
    });
    server.addMethod("eth_gasPrice", async () => {
        prometheus.gasPrice.requests?.inc();
        const result = eth_gasPrice(session, lockGasPrice)
        prometheus.gasPrice.success?.inc();
        return result;
    });

    if ( !options.metricsDisabled ) {
        prometheus.listen(metricsListenPort, hostname);
    }

    return Bun.serve({
        port,
        hostname,
        development: true,
        fetch: async (request: Request) => {
            const url = new URL(request.url);
            if ( request.method == "GET" ) {
                if ( url.pathname == "/" ) return new Response(banner(session, port, hostname, metricsListenPort, metricsDisabled));
                const info = await session.client.v1.chain.get_info();
                return toJSON(info.toJSON());
            }
            const jsonRPCRequest = await request.json<any>();
            if ( !jsonRPCRequest ) return new Response("invalid request", {status: 400})
            // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
            // It can also receive an array of requests, in which case it may return an array of responses.
            // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
            const jsonRPCResponse = await server.receive(jsonRPCRequest)
            if ( jsonRPCResponse ) return new Response(JSON.stringify(jsonRPCResponse), { headers: { 'Content-Type': 'application/json' } });
            // If response is absent, it was a JSON-RPC notification method.
            // Respond with no content status (204).
            return new Response("no content", {status: 204})
        }
    })
}

function toJSON(obj: any, status: number = 200) {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(obj);
    return new Response(body, { status, headers });
}

function banner( session: Session, port: number, hostname?: string, metricsListenPort?: number, metricsDisabled?: boolean ) {
    let text = `

        ███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
        ██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
        █████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
        ██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
        ███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
        ╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
`
    text += `                EOS EVM Miner listening @ ${hostname ?? DEFAULT_HOSTNAME}:${port.toString()}\n`
    if ( !metricsDisabled ) text += `              Prometheus metrics listening @ ${hostname ?? DEFAULT_HOSTNAME}:${metricsListenPort?.toString()}\n`;
    text += `                   Your miner account is ${session.actor.toString()}\n`;
    text += `        ${session.walletPlugin.metadata.publicKey}\n`
    return text;
}
