import { Name, Session, UInt64 } from "@wharfkit/session";
import { logger } from "./logger.js";

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
    if ( results?.rows?.length === 0 ) {
        logger.error("❌ nodeos::config", {error: "does not exists"});
        return null;
    }
    logger.info("🌐 nodeos::config");
    return results.rows[0] as Config;
}

export interface Balances {
    owner: string;
    balance: {
        balance: string;
        dust: number;
    }
}

export async function balances(session: Session, owner?: string) {
    const results = await session.client.v1.chain.get_table_rows({
        json: true,
        code: 'eosio.evm',
        scope: 'eosio.evm',
        table: 'balances',
        lower_bound: Name.from(owner ?? session.actor),
        upper_bound: Name.from(owner ?? session.actor),
        limit: 1,
    });
    if ( results?.rows?.length === 0 ) {
        logger.warn("⚠️ nodeos::balances", {owner, error: "not found"});
        return null;
    }
    logger.info("🌐 nodeos::balances", {owner});
    return results.rows[0] as Balances;
}

export interface Account {
    id: number;
    eth_address: string;
    nonce: number;
    balance: string;
    code_id?: number;
}

export async function account(session: Session, eth_address: string) {
    eth_address = eth_address.replace(/^0x/, "");
    const results = await session.client.v1.chain.get_table_rows({
        code: "eosio.evm",
        scope: "eosio.evm",
        table: "account",
        index_position: "secondary",
        lower_bound: eth_address as any,
        upper_bound: eth_address as any,
        json: true,
        limit: 1,
        key_type: "sha256",
    });
    if ( results?.rows?.length === 0 ) {
        logger.warn("⚠️ nodeos::account", {eth_address, error: "not found"});
        return null;
    }
    logger.info("🌐 nodeos::account", {eth_address});
    return results.rows[0] as Account;
}

export interface AccountCode {
    id: number;
    ref_count: number;
    code: string;
}

export async function accountcode(session: Session, id: number) {
    const results = await session.client.v1.chain.get_table_rows({
        code: "eosio.evm",
        scope: "eosio.evm",
        table: "accountcode",
        lower_bound: UInt64.from(id),
        upper_bound: UInt64.from(id),
        json: true,
        limit: 1,
    });
    if ( results?.rows?.length === 0 ) {
        logger.warn("⚠️ nodeos::accountcode", {id, error: "not found"});
        return null;
    }
    logger.info("🌐 nodeos::accountcode", {id});
    return results.rows[0] as AccountCode;
}
