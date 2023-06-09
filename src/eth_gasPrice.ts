import { Session } from "@wharfkit/session";
import * as tables from "./tables.js";
import { logger } from "./logger.js";

export async function eth_gasPrice(session: Session, lockGasPrice?: string) {
    // fixed gas value set by CLI or .env
    if ( lockGasPrice ) {
        return lockGasPrice;
    }
    try {
        const result = await tables.config(session);
        return "0x" + parseInt(result.gas_price).toString(16);
    } catch(e) {
        logger.error("Error getting gas price from nodeos: " + e);
        throw new Error("Error getting the gas price from this EOS EVM miner.");
    }
}
