import { Session } from "@wharfkit/session";
import * as tables from "./tables.js";

export async function eth_chainId(session: Session, lockChainId?: string) {
    // fixed chainId value set by CLI or .env
    if ( lockChainId ) {
        return lockChainId;
    }
    const result = await tables.config(session);
    return "0x" + result.chainid.toString(16);
}
