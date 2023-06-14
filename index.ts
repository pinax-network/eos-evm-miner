
import { JSONRPCRequest, JSONRPCResponse, JSONRPCServer, JSONRPCServerMiddlewareNext, createJSONRPCErrorResponse } from "json-rpc-2.0";
import { HOSTNAME, LOCK_GAS_PRICE, PORT,PROMETHEUS_PORT, METRICS_DISABLED, VERBOSE, LOCK_CHAIN_ID, LOCK_GENESIS_TIME, RPC_EVM_ENDPOINT, SHOW_ENDPOINTS, SHOW_MINER } from "./src/config.js";
import { logger } from "./src/logger.js";
import { StartOptions } from "./bin/cli.js";
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
import { banner } from "./src/banner.js";

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
    const showEndpoints = options.showEndpoints ?? SHOW_ENDPOINTS;
    const showMiner = options.showMiner ?? SHOW_MINER;

    // create Wharfkit session
    const session = createSession(options);

    // JSON RPC server & client
    const server = new JSONRPCServer();
    const client = createClient(rpcEvmEndpoint);

    // enable logging if verbose enabled
    const banner_text = banner(session, port, {showMiner, showEndpoints, rpcEvmEndpoint, hostname, metricsListenPort, metricsDisabled})
    if (verbose) {
        logger.settings.type = "json";
        console.log(banner_text);
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
        prometheus.requests.received?.inc();
        const isProxy = server.hasMethod(request.method);
        if ( isProxy ) logger.info('🔀 proxy::received:' + request.method, request);
        else logger.info('log::received:' + request.method, request);
        return next(request, serverParams).then(response => {
            if ( response ) {
                if (isProxy ) logger.info('🔀 proxy::response:' + request.method, response);
                else logger.info('log::response:' + request.method, response);
                prometheus.requests.response?.inc();
                return response;
            }
            throw new Error("no response");
        });
    };

    async function exceptionMiddleware<ServerParams=void>(next: JSONRPCServerMiddlewareNext<ServerParams>, request: JSONRPCRequest, serverParams: ServerParams) {
        try {
            return await next(request, serverParams);
        } catch (error: any) {
            if (request.id && error.code) {
                prometheus.requests.errors?.inc();
                logger.error('❌ log::error:' + request.method, request);
                return createJSONRPCErrorResponse(request.id, error.code, error.message);
            } else {
                throw error;
            }
        }
    };

    // Middleware will be called in the same order they are applied
    server.applyMiddleware(logMiddleware, exceptionMiddleware);

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
                if ( url.pathname == "/" ) return new Response(banner_text);
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
                // Proxied Requests
                jsonRPCResponse = await client.requestAdvanced(jsonRPCRequest)
            }
            if ( jsonRPCResponse ) return new Response(JSON.stringify(jsonRPCResponse), { headers: { 'Content-Type': 'application/json' } });
            // If response is absent, it was a JSON-RPC notification method.
            // Respond with no content status (204).
            logger.error('❌ no content', jsonRPCRequest)
            return new Response("no content", {status: 204})
        }
    })
}

function toJSON(obj: any, status: number = 200) {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(obj);
    return new Response(body, { status, headers });
}
