import { Session } from "@wharfkit/session";
import { pushtx } from "./actions.js";
import { logger } from "./logger.js";
import { keccak256 } from "@ethereumjs/devp2p";

export async function eth_sendRawTransaction(session: Session, params: any[], broadcast = true) {
    const rlptx = params[0].replace(/^0x/, "");
    const action = pushtx(session, rlptx);
    if ( broadcast ) {
        const transact = await session.transact({action}, {broadcast});
        if ( transact.response ) {
            logger.info('✅ eth_sendRawTransaction::pushtx', transact.response);
        } else {
            throw new Error("no response from Nodeos RPC endpoint");
        }
    }
    return `0x${ keccak256(Buffer.from(rlptx, "hex")).toString("hex") }`;
}
