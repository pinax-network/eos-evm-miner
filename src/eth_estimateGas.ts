import { Session } from "@wharfkit/session";
import * as tables from "./tables.js";

export async function eth_estimateGas(session: Session, params: any[], lockGasPrice?: string) {
    // fixed gas value set by CLI or .env
    if ( lockGasPrice ) {
        return lockGasPrice;
    }
    const result = await tables.config(session);
    return "0x" + parseInt(result.gas_price).toString(16);
}