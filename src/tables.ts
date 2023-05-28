import { Name, Session } from "@wharfkit/session";

export interface Config {
    version: number
    chainid: number
    genesis_time: string
    ingress_bridge_fee: string
    gas_price: string
    miner_cut: number
    status: number
}

export async function config(session: Session) {
    const results = await session.client.v1.chain.get_table_rows({
        json: true,
        code: 'eosio.evm',
        scope: 'eosio.evm',
        table: 'config',
        limit: 1,
    });
    return results.rows[0] as Config;
}

export interface Balances {
    owner: string;
    balance: {
        balance: string;
        dust: number;
    }
}

export async function balances(session: Session) {
    const results = await session.client.v1.chain.get_table_rows({
        json: true,
        code: 'eosio.evm',
        scope: 'eosio.evm',
        table: 'balances',
        lower_bound: Name.from(session.actor),
        upper_bound: Name.from(session.actor),
        limit: 1,
    });
    return results.rows[0] as Balances;
}