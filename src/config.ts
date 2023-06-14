import "dotenv/config";

// defaults
export const DEFAULT_MINER_PERMISSION = 'active';
export const DEFAULT_PORT = 50305;
export const DEFAULT_PROMETHEUS_PORT = 9102;
export const DEFAULT_HOSTNAME = "127.0.0.1";
export const DEFAULT_LOCK_GAS_PRICE = "0x22ecb25c00";
export const DEFAULT_CHAIN_ID = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
export const DEFAULT_RPC_ENDPOINT = 'https://eos.api.eosnation.io';
export const DEFAULT_RPC_EVM_ENDPOINT = 'https://api.evm.eosnetwork.com';
export const DEFAULT_METRICS_DISABLED = false;
export const DEFAULT_VERBOSE = false;

// examples
export const EXAMPLE_LOCK_CHAIN_ID = "0x4571";
export const EXAMPLE_LOCK_GENESIS_TIME = "2023-04-05T02:18:09";

// optional
export const PORT = parseInt(process.env.PORT ?? String(DEFAULT_PORT));
export const PROMETHEUS_PORT = parseInt(process.env.PROMETHEUS_PORT ?? String(DEFAULT_PROMETHEUS_PORT));
export const LOCK_GAS_PRICE = process.env.LOCK_GAS_PRICE;
export const LOCK_CHAIN_ID = process.env.LOCK_CHAIN_ID;
export const LOCK_GENESIS_TIME = process.env.LOCK_GENESIS_TIME;
export const CHAIN_ID = process.env.CHAIN_ID ?? DEFAULT_CHAIN_ID;
export const RPC_ENDPOINT = process.env.RPC_ENDPOINT ?? DEFAULT_RPC_ENDPOINT;
export const RPC_EVM_ENDPOINT = process.env.RPC_EVM_ENDPOINT ?? DEFAULT_RPC_EVM_ENDPOINT;
export const HOSTNAME = process.env.HOSTNAME;
export const METRICS_DISABLED = JSON.parse(process.env.METRICS_DISABLED ?? String(DEFAULT_METRICS_DISABLED)) as boolean;
export const VERBOSE = JSON.parse(process.env.VERBOSE ?? String(DEFAULT_VERBOSE)) as boolean;

// Miner details
export const MINER_PERMISSION = process.env.MINER_PERMISSION ?? process.env.PERMISSION ?? DEFAULT_MINER_PERMISSION;
export const MINER_PRIVATE_KEY = process.env.MINER_PRIVATE_KEY ?? process.env.PRIVATE_KEY;
export const MINER_ACCOUNT = process.env.MINER_ACCOUNT ?? process.env.ACTOR;