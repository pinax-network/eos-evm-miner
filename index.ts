import pkg from "./package.json" assert { type: "json" };
import { JSONRPCRequest, JSONRPCResponse, JSONRPCServer, JSONRPCServerMiddlewareNext, createJSONRPCErrorResponse } from "json-rpc-2.0";
import { Session } from "@wharfkit/session";
import { DEFAULT_HOSTNAME, HOSTNAME, LOCK_GAS_PRICE, PORT,PROMETHEUS_PORT, METRICS_DISABLED, VERBOSE, LOCK_CHAIN_ID, LOCK_GENESIS_TIME, RPC_EVM_ENDPOINT } from "./src/config.js";
import { logger } from "./src/logger.js";
import { DefaultOptions } from "./bin/cli.js";
import * as prometheus from "./src/prometheus.js"
import { eth_sendRawTransaction } from "./src/eth_sendRawTransaction.js";
import { eth_gasPrice } from "./src/eth_gasPrice.js";
import { eth_chainId } from "./src/eth_chainId.js";
import { eth_blockNumber } from "./src/eth_blockNumber.js";
import { eth_getBalance } from "./src/eth_getBalance.js";
import { net_version } from "./src/net_version.js";
import { eth_getCode } from "./src/eth_getCode.js";
import { createSession } from "./src/createSession.js";
import { createClient } from "./src/createClient.js";

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

    // create Wharfkit session
    const session = createSession(options);

    // JSON RPC server & client
    const server = new JSONRPCServer();
    const client = createClient(rpcEvmEndpoint);

    // enable logging if verbose enabled
    if (verbose) {
        logger.settings.type = "json";
        console.log(banner(session, port, rpcEvmEndpoint, hostname, metricsListenPort, metricsDisabled));
    }

    server.addMethod("eth_sendRawTransaction", async params => {
        prometheus.eth_sendRawTransaction.requests?.inc();
        const result = await eth_sendRawTransaction(session, params)
        prometheus.eth_sendRawTransaction.responses?.inc();
        return result;
    });
    server.addMethod("eth_gasPrice", async () => {
        prometheus.eth_gasPrice.requests?.inc();
        const result = await eth_gasPrice(session, lockGasPrice)
        prometheus.eth_gasPrice.responses?.inc();
        return result;
    });
    server.addMethod("eth_chainId", async () => {
        prometheus.eth_chainId.requests?.inc();
        const result = await eth_chainId(session, lockChainId)
        prometheus.eth_chainId.responses?.inc();
        return result;
    });
    server.addMethod("eth_blockNumber", async () => {
        prometheus.eth_blockNumber.requests?.inc();
        const result = await eth_blockNumber(session, lockGenesisTime)
        prometheus.eth_blockNumber.responses?.inc();
        return result;
    });
    server.addMethod("eth_getBalance", async params => {
        prometheus.eth_getBalance.requests?.inc();
        const result = await eth_getBalance(session, params)
        prometheus.eth_getBalance.responses?.inc();
        return result;
    });
    server.addMethod("net_version", async () => {
        prometheus.net_version.requests?.inc();
        const result = await net_version(session, lockChainId)
        prometheus.net_version.responses?.inc();
        return result;
    });
    server.addMethod("eth_getCode", async params => {
        prometheus.eth_getCode.requests?.inc();
        const result = await eth_getCode(session, params)
        prometheus.eth_getCode.responses?.inc();
        return result;
    });

    // next will call the next middleware
    function logMiddleware<ServerParams=void>(next: JSONRPCServerMiddlewareNext<ServerParams>, request: JSONRPCRequest, serverParams: ServerParams) {
        logger.info('received', request);
        prometheus.requests.received?.inc();
        return next(request, serverParams).then(response => {
            if ( response ) {
                logger.info('response', response);
                prometheus.requests.response?.inc();
                return response;
            }
        });
    };

    async function exceptionMiddleware<ServerParams=void>(next: JSONRPCServerMiddlewareNext<ServerParams>, request: JSONRPCRequest, serverParams: ServerParams) {
        try {
            return await next(request, serverParams);
        } catch (error: any) {
            if (request.id && error.code) {
                prometheus.requests.errors?.inc();
                return createJSONRPCErrorResponse(request.id, error.code, error.message);
            } else {
                throw error;
            }
        }
    };

    // Middleware will be called in the same order they are applied
    server.applyMiddleware(logMiddleware, exceptionMiddleware);

    // Proxied - Move to internal
    server.addMethod("eth_estimateGas", params => client.request("eth_estimateGas", params));

    // Proxied Requests
    server.addMethod("eth_getBlockByNumber", params => client.request("eth_getBlockByNumber", params));
    server.addMethod("eth_getTransactionCount", params => client.request("eth_getTransactionCount", params));
    server.addMethod("eth_getTransactionReceipt", params => client.request("eth_getTransactionReceipt", params));
    server.addMethod("eth_getBlockByHash", params => client.request("eth_getBlockByHash", params));
    server.addMethod("eth_call", params => client.request("eth_call", params));

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
                if ( url.pathname == "/" ) return new Response(banner(session, port, rpcEvmEndpoint, hostname, metricsListenPort, metricsDisabled));
                const info = await session.client.v1.chain.get_info();
                return toJSON(info.toJSON());
            }
            const jsonRPCRequest = await request.json<JSONRPCRequest>();
            if ( !jsonRPCRequest ) return new Response("invalid request", {status: 400})
            // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
            // It can also receive an array of requests, in which case it may return an array of responses.
            // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
            let jsonRPCResponse: JSONRPCResponse | null = null;
            if (server.hasMethod(jsonRPCRequest.method)) {
                jsonRPCResponse = await server.receive(jsonRPCRequest)
            } else {
                logger.error(`❌ missing method ${jsonRPCRequest.method} ${jsonRPCRequest.params}` )
            }
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

function banner( session: Session, port: number, rpcEvmEndpoint?: string, hostname?: string, metricsListenPort?: number, metricsDisabled?: boolean ) {
    let text = `

        ███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
        ██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
        █████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
        ██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
        ███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
        ╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
`
    text += `             EOS EVM Miner v${pkg.version} listen @ ${hostname ?? DEFAULT_HOSTNAME}:${port.toString()}\n`
    if ( !metricsDisabled ) text += `               Prometheus metrics listen @ ${hostname ?? DEFAULT_HOSTNAME}:${metricsListenPort?.toString()}\n`;
    text += `             RPC Nodeos proxy @ ${session.chain.url.toString()}\n`
    text += `              RPC EVM proxy @ ${rpcEvmEndpoint}\n`
    text += `                        EVM miner [${session.actor.toString()}]\n`;
    text += `        ${session.walletPlugin.metadata.publicKey}\n`
    return text;
}
