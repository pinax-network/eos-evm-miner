import { AnyAction } from "@wharfkit/session";
import { MINER_ACCOUNT, permissionLevel } from "./config.js";

export function pushtx(rlptx:string): AnyAction {
    return {
        account: 'eosio.evm',
        name: "pushtx",
        authorization: [permissionLevel],
        data: {
            miner: MINER_ACCOUNT,
            rlptx
        }
    }
}

export function withdraw(quantity: string): AnyAction {
    return {
        account: 'eosio.evm',
        name: "withdraw",
        authorization: [permissionLevel],
        data: {
            owner: MINER_ACCOUNT,
            quantity
        }
    }
}