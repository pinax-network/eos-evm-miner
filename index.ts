import colors from "colors";
import jayson from 'jayson';
import { MINER_ACCOUNT, PORT } from "./src/config.js";
import { eth_gasPrice, eth_sendRawTransaction } from "./src/miner.js";

interface ActionOptions {
    port: number,
}

export async function action(options: ActionOptions) {
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
            Your miner account is ${colors.blue(MINER_ACCOUNT)}}
    `);
}
