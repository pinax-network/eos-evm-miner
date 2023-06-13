import { JSONRPCClient, JSONRPCResponse, JSONRPCServer } from "json-rpc-2.0";
import { Session } from "@wharfkit/session";
import { DEFAULT_HOSTNAME, HOSTNAME, LOCK_GAS_PRICE, PORT,PROMETHEUS_PORT, createSession, METRICS_DISABLED, VERBOSE, LOCK_CHAIN_ID, LOCK_GENESIS_TIME, RPC_EVM_ENDPOINT, RPC_ENDPOINT } from "./src/config.js";
import { logger } from "./src/logger.js";
import { DefaultOptions } from "./bin/cli.js";
import { eth_sendRawTransaction } from "./src/eth_sendRawTransaction.js";
import { eth_gasPrice } from "./src/eth_gasPrice.js";
import { eth_chainId } from "./src/eth_chainId.js";
import { eth_blockNumber } from "./src/eth_blockNumber.js";
import * as prometheus from "./src/prometheus.js"
import { eth_getBalance } from "./src/eth_getBalance.js";
import { net_version } from "./src/net_version.js";
import { eth_getCode } from "./src/eth_getCode.js";

export interface StartOptions extends DefaultOptions {
    port?: number;
    metricsListenPort?: number;
    hostname?: string;
    verbose?: boolean;
    metricsDisabled?: boolean;
    lockGasPrice?: string;
    lockChainId?: string;
    lockGenesisTime?: string;
    rpcEvmEndpoint?: string;
    rpcEndpoint?: string;
}

export default function (options: StartOptions) {
    const port = options.port ?? PORT;
    const hostname = options.hostname ?? HOSTNAME;
    const metricsDisabled = options.metricsDisabled ?? METRICS_DISABLED;
    const metricsListenPort = options.metricsListenPort ?? PROMETHEUS_PORT;
    const lockGasPrice = options.lockGasPrice ?? LOCK_GAS_PRICE;
    const lockChainId = options.lockChainId ?? LOCK_CHAIN_ID;
    const lockGenesisTime = options.lockGenesisTime ?? LOCK_GENESIS_TIME;
    const verbose = options.verbose ?? VERBOSE;
    const rpcEvmEndpoint = options.rpcEvmEndpoint ?? RPC_EVM_ENDPOINT;
    const rpcEndpoint = options.rpcEndpoint ?? RPC_ENDPOINT;

    // create Wharfkit session
    const session = createSession(options);

    // JSON RPC server & client
    const server = new JSONRPCServer();
    const client: JSONRPCClient<void> = new JSONRPCClient(async jsonRPCRequest => {
        const response = await fetch(rpcEvmEndpoint, {
            method: "POST",
            headers: { "content-type": "application/json"},
            body: JSON.stringify(jsonRPCRequest),
        });
        if ( jsonRPCRequest.id !== undefined ) new Error(response.statusText);
        if ( response.status !== 200) new Error(response.statusText);
        const jsonRPCResponse: JSONRPCResponse = await response.json();
        return client.receive(jsonRPCResponse);
    });

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
        const result = await eth_gasPrice(session, lockGasPrice)
        prometheus.gasPrice.success?.inc();
        return result;
    });
    server.addMethod("eth_chainId", async () => {
        logger.info("eth_chainId");
        prometheus.chainId.requests?.inc();
        const result = await eth_chainId(session, lockChainId)
        prometheus.chainId.success?.inc();
        return result;
    });
    server.addMethod("eth_blockNumber", async () => {
        logger.info("eth_blockNumber");
        prometheus.blockNumber.requests?.inc();
        const result = await eth_blockNumber(session, lockGenesisTime)
        prometheus.blockNumber.success?.inc();
        return result;
    });
    server.addMethod("eth_getBalance", async params => {
        logger.info("eth_getBalance");
        prometheus.blockNumber.requests?.inc();
        const result = await eth_getBalance(session, params)
        prometheus.blockNumber.success?.inc();
        return result;
    });
    server.addMethod("net_version", async () => {
        logger.info("net_version");
        prometheus.net_version.requests?.inc();
        const result = await net_version(session, lockChainId)
        prometheus.net_version.success?.inc();
        return result;
    });
    server.addMethod("eth_getCode", async params => {
        logger.info("eth_getCode");
        prometheus.blockNumber.requests?.inc();
        const result = await eth_getCode(session, params)
        prometheus.blockNumber.success?.inc();
        return result;
    });
    // Proxied - Move to internal
    server.addMethod("eth_estimateGas", params => client.request("eth_estimateGas", params));

    // Proxied Requests
    server.addMethod("eth_getBlockByNumber", params => client.request("eth_getBlockByNumber", params));
    server.addMethod("eth_getTransactionCount", params => client.request("eth_getTransactionCount", params));
    server.addMethod("eth_getTransactionReceipt", params => client.request("eth_getTransactionReceipt", params));
    server.addMethod("eth_getBlockByHash", params => client.request("eth_getBlockByHash", params));

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
            console.log(jsonRPCRequest)
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
    text += `                 Nodeos @ ${session.chain.url.toString()}\n`
    if ( !metricsDisabled ) text += `              Prometheus metrics listening @ ${hostname ?? DEFAULT_HOSTNAME}:${metricsListenPort?.toString()}\n`;
    text += `                   Your miner account is ${session.actor.toString()}\n`;
    text += `        ${session.walletPlugin.metadata.publicKey}\n`
    return text;
}
