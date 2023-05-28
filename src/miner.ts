import fs from "node:fs";
import { keccak256 } from 'ethereumjs-util';
import { logger } from "./logger.js";
import { pushtx } from "./actions.js";
import { config } from "./tables.js";
import { Session } from '@wharfkit/session';

export async function eth_sendRawTransaction(session: Session, params: any[]) {
    const rlptx = params[0].substr(2);
    const action = pushtx(session, rlptx);
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

export async function eth_gasPrice(session: Session, lockGasPrice: string) {
    // read from gas price lock file if it exists
    if ( fs.existsSync(lockGasPrice) ) {
        return fs.readFileSync(lockGasPrice, 'utf8');
    }
    try {
        const result = await config(session);
        const gas_price = "0x" + parseInt(result.gas_price).toString(16);

        // save gas price if lockGasPrice is set
        if ( lockGasPrice ) {
            fs.writeFileSync(lockGasPrice, gas_price);
        }
        return gas_price;
    } catch(e) {
        logger.error("Error getting gas price from nodeos: " + e);
        throw new Error("There was an error getting the gas price from this EOS EVM miner.");
    }
}
