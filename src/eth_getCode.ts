import { Session } from "@wharfkit/session";
import * as tables from "./tables.js";
import * as cache from "./cache.js";

export async function eth_getCode(session: Session, params: any[]) {
    const eth_address = params[0];

    // cache HIT
    const hit = await cache.read("eth_getCode", eth_address);
    if ( hit ) return hit;

    // get code from Nodeos RPC
    const account = await tables.account(session, eth_address);
    if ( !account || account.code_id == undefined ) return "0x";
    const result = await tables.accountcode(session, account.code_id);
    if ( !result ) return "0x";

    // save to cache to disk
    cache.write("eth_getCode", eth_address, "0x" + result.code);
    return "0x" + result.code;
}
