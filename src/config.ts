import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import dotenv from "dotenv";
dotenv.config();

// required
if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY is required');
if (!process.env.MINER_ACCOUNT) throw new Error('MINER_ACCOUNT is required');
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const MINER_ACCOUNT = process.env.MINER_ACCOUNT;

// optional
export const PORT = parseInt(process.env.PORT ?? '50305');
export const LOCK_GAS_PRICE = JSON.parse(process.env.LOCK_GAS_PRICE ?? "true");
export const MINER_PERMISSION = process.env.MINER_PERMISSION ?? "active";
export const EXPIRE_SEC = parseInt(process.env.EXPIRE_SEC ?? '60');
export const CHAIN_ID = process.env.CHAIN_ID ?? 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
export const RPC_ENDPOINT = process.env.RPC_ENDPOINT ?? 'https://eos.greymass.com';

export const permissionLevel = {
    actor: MINER_ACCOUNT,
    permission: MINER_PERMISSION,
};
export const session = new Session({
    chain: {
        id: CHAIN_ID,
        url: RPC_ENDPOINT,
    },
    permissionLevel,
    walletPlugin: new WalletPluginPrivateKey(PRIVATE_KEY),
})
