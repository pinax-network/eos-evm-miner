import { Session } from "@wharfkit/session";
import * as tables from "./tables.js";

export async function eth_getCode(session: Session, params: any[]) {
    const eth_address = params[0];
    const account = await tables.account(session, eth_address);
    if ( !account || account.code_id == undefined ) return "0x";
    const result = await tables.accountcode(session, account.code_id);
    if ( !result ) return "0x";
    return "0x" + result.code;
}
