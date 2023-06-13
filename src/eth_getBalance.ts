import { Session } from "@wharfkit/session";
import * as tables from "./tables.js";

export async function eth_getBalance(session: Session, params: any[]) {
    const eth_address = params[0];
    const result = await tables.account(session, eth_address);
    if ( result ) return "0x" + result.balance;
    return "0x" + "0";
}
