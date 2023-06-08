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

export function open(session: Session): AnyAction {
    return {
        account: 'eosio.evm',
        name: "open",
        authorization: [session.permissionLevel],
        data: {
            owner: session.actor,
        }
    }
}

export function powerup(session: Session, net_frac: number|string, cpu_frac: number|string, max_payment: string): AnyAction {
    return {
        account: 'eosio',
        name: "powerup",
        authorization: [session.permissionLevel],
        data: {
            payer: session.actor,
            receiver: session.actor,
            days: 1,
            net_frac: Number(net_frac),
            cpu_frac: Number(cpu_frac),
            max_payment,
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