import { Session } from "@wharfkit/session";
import * as tables from "./tables.js";
import { getGenesisTime } from "./getGenesisTime.js";

export async function eth_blockNumber(session: Session, lockGenesisTime?: string) {
    let genesis_time = lockGenesisTime ?? getGenesisTime(session);
    if ( !lockGenesisTime ) {
        const result = await tables.config(session);
        genesis_time = result.genesis_time;
    }
    if ( !genesis_time ) throw new Error("genesis_time not found");
    const info = await session.client.v1.chain.get_info();
    const genesis_time_sec = new Date(genesis_time).valueOf() / 1000;
    const head_block_time_sec = Math.floor(info.head_block_time.toMilliseconds() / 1000);
    const blockNumber = head_block_time_sec - genesis_time_sec;
    return "0x" + (blockNumber).toString(16);
}
