import colors from "colors";
import jayson from 'jayson';
import { MINER_ACCOUNT, PORT, session } from "./src/config.js";
import { eth_gasPrice, eth_sendRawTransaction } from "./src/miner.js";
import { withdraw } from "./src/actions.js";
import { balances } from "./src/tables.js";

interface ActionOptions {
    port: number,
}

export async function claim() {
    const result = await balances(MINER_ACCOUNT);
    if ( result ) {
        const balance = result.balance.balance;
        const action = withdraw(balance);
        const response = await session.transact({action})
        const trx_id = response.response?.transaction_id;
        process.stdout.write(`Claimed ${balance} ${trx_id}\n`);
    } else {
        process.stdout.write(`Miner has no balance to claim\n`);
    }
}

export async function run(options: ActionOptions) {
    const server = new jayson.Server({
        eth_sendRawTransaction: async (params: any, callback: any) => {
            try {
                const result = await eth_sendRawTransaction(params)
                callback(null, result);
            } catch (error: any) {
                callback({ "code": -32000, "message": error.message });
            }
        },
        eth_gasPrice: async (params: any, callback: any) => {
            try {
                const result = await eth_gasPrice()
                callback(null, result);
            } catch (error: any) {
                callback({ "code": -32000, "message": error.message });
            }
        }
    });

    server.http().listen(options.port);

    process.stdout.write(`

    ███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
    ██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
    █████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
    ██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
    ███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
    ╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
        EOS EVM Miner listening @ http://127.0.0.1:${colors.blue(PORT.toString())}
            Your miner account is ${colors.blue(MINER_ACCOUNT)}
    `);
}
