import { keccak256 } from 'ethereumjs-util';
import { logger } from "./logger.js";
import { pushtx } from "./actions.js";
import { session } from "./config.js";
import { config } from "./tables.js";

export async function eth_sendRawTransaction(params: any[]) {
    const rlptx = params[0].substr(2);
    const action = pushtx(rlptx);
    try {
        const transact = await session.transact({action});
        const trx_id = transact.response?.transaction_id;
        logger.info(`pushtx ${trx_id}`);
    } catch (e) {
        logger.error("Error sending transaction to nodeos: " + e);
        throw new Error("There was an error sending this transaction to the EOS EVM miner.");
    }
    return '0x' + keccak256(Buffer.from(rlptx, "hex"));
}

export async function eth_gasPrice() {
    try {
        const result = await config();
        return "0x" + parseInt(result.gas_price).toString(16);
    } catch(e) {
        logger.error("Error getting gas price from nodeos: " + e);
        throw new Error("There was an error getting the gas price from this EOS EVM miner.");
    }
}
