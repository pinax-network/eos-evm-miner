import jayson from 'jayson';
import { DEFAULT_PORT, DEFAULT_LOCK_GAS_PRICE_FILE, createSession, explorer } from "./src/config.js";
import { eth_gasPrice, eth_sendRawTransaction } from "./src/miner.js";
import { withdraw } from "./src/actions.js";
import { balances } from "./src/tables.js";
import { logger } from "./src/logger.js";

export interface MinerOptions {
    privateKey?: string;
    actor?: string;
    permission?: string;
}

export async function claim(options: MinerOptions) {
    // create Wharfkit session
    const session = createSession(options);

    // lookup current balance
    const result = await balances(session);

    // withdraw if balance exists
    if ( result ) {
        const balance = result.balance.balance;
        const action = withdraw(session, balance);
        const response = await session.transact({action})
        const trx_id = response.response?.transaction_id;
        logger.info(`${session.actor.toString()} claimed ${balance} ${explorer(session, trx_id)}\n`);
    } else {
        logger.info(`${session.actor.toString()} has no balance to claim\n`);
    }
}

export interface StartOptions extends MinerOptions {
    port?: number;
    verbose?: boolean;
    lockGasPrice?: string;
}

export function start(options: StartOptions) {
    const port = options.port || DEFAULT_PORT;
    const lockGasPrice = options.lockGasPrice ?? DEFAULT_LOCK_GAS_PRICE_FILE;

    // enable logging if verbose enabled
    if (options.verbose) logger.settings.type = "pretty";

    // create Wharfkit session
    const session = createSession(options);

    // start JSON RPC server
    const server = new jayson.Server({
        eth_sendRawTransaction: async (params: any, callback: any) => {
            try {
                const result = await eth_sendRawTransaction(session, params)
                callback(null, result);
            } catch (error: any) {
                callback({ "code": -32000, "message": error.message });
            }
        },
        eth_gasPrice: async (params: any, callback: any) => {
            try {
                const result = await eth_gasPrice(session, lockGasPrice)
                callback(null, result);
            } catch (error: any) {
                callback({ "code": -32000, "message": error.message });
            }
        }
    });

    server.http().listen(port);
    logger.info(`

    ███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
    ██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
    █████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
    ██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
    ███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
    ╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
        EOS EVM Miner listening @ http://127.0.0.1:${port.toString()}
            Your miner account is ${session.actor.toString()}
    `);
}
