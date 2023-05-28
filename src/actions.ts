import { AnyAction, Session } from "@wharfkit/session";

export function pushtx(session: Session, rlptx:string): AnyAction {
    return {
        account: 'eosio.evm',
        name: "pushtx",
        authorization: [session.permissionLevel],
        data: {
            miner: session.actor,
            rlptx
        }
    }
}

export function withdraw(session: Session, quantity: string): AnyAction {
    return {
        account: 'eosio.evm',
        name: "withdraw",
        authorization: [session.permissionLevel],
        data: {
            owner: session.actor,
            quantity
        }
    }
}