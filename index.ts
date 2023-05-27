import colors from "colors/safe";
import jayson from 'jayson';
import { MINER_ACCOUNT, PORT } from "./src/config";
import { eth_gasPrice, eth_sendRawTransaction } from "./src/miner";

const server = new jayson.Server({
    eth_sendRawTransaction: async (params, callback) => {
        try {
            const result = await eth_sendRawTransaction(params)
            callback(null, result);
        } catch (error) {
            callback({ "code": -32000, "message": error.message });
        }
    },
    eth_gasPrice: async (params, callback) => {
        try {
            const result = await eth_gasPrice()
            callback(null, result);
        } catch (error) {
            callback({ "code": -32000, "message": error.message });
        }
    }
});

server.http().listen(PORT);

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

