import { JSONRPCServer } from "json-rpc-2.0";
import { Session } from "@wharfkit/session";
import { DEFAULT_PORT, LOCK_GAS_PRICE, PORT, createSession } from "../src/config.js";
import { logger } from "../src/logger.js";
import { DefaultOptions } from "./cli.js";
import { eth_sendRawTransaction } from "../src/eth_sendRawTransaction.js";
import { eth_gasPrice } from "../src/eth_gasPrice.js";

export interface StartOptions extends DefaultOptions {
    port?: number;
    verbose?: boolean;
    lockGasPrice?: string;
}

export function start (options: StartOptions) {
    const port = options.port ?? PORT ?? DEFAULT_PORT;
    const lockGasPrice = options.lockGasPrice ?? LOCK_GAS_PRICE;

    // create Wharfkit session
    const session = createSession(options);
    const server = new JSONRPCServer();

    // enable logging if verbose enabled
    if (options.verbose) {
        logger.settings.type = "pretty";
        console.log(banner(session, port));
    }

    server.addMethod("eth_sendRawTransaction", params => {
        return eth_sendRawTransaction(session, params)
    });
    server.addMethod("eth_gasPrice", () => {
        return eth_gasPrice(session, lockGasPrice)
    });

    return Bun.serve({
        port,
        development: true,
        fetch: async (request: Request) => {
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

function banner( session: Session, port: number ) {
    return `

        ███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
        ██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
        █████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
        ██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
        ███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
        ╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
            EOS EVM Miner listening @ http://127.0.0.1:${port.toString()}
                Your miner account is ${session.actor.toString()}`
}
