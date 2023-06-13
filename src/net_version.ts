import { Session } from "@wharfkit/session";
import * as tables from "./tables.js";

export async function net_version(session: Session, lockChainId?: string) {
    // fixed chainId value set by CLI or .env
    if ( lockChainId ) {
        return parseInt(lockChainId);
    }
    const result = await tables.config(session);
    return result.chainid;
}
