import { ChainDefinitionType, Session } from "@wharfkit/session";
import { CHAIN_ID, MINER_PERMISSION, RPC_ENDPOINT, MINER_ACCOUNT } from "./config.js";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { DefaultOptions } from "../bin/cli.js";

interface CreateSessionOptions extends DefaultOptions {
    chain?: ChainDefinitionType;
    rpcEndpoint?: string;
}

export function createSession(options: CreateSessionOptions) {
    // required
    const actor = options.actor ?? MINER_ACCOUNT;
    const privateKey = options.privateKey ?? process.env.PRIVATE_KEY;
    if (!actor) throw new Error('--actor is required (env=ACTOR)');
    if (!privateKey) throw new Error('--privateKey is required (env=PRIVATE_KEY)');

    // optional
    const permission = options.permission ?? MINER_PERMISSION;
    const chain = options.chain ?? {
        id: CHAIN_ID,
        url: options.rpcEndpoint ?? RPC_ENDPOINT,
    }

    return new Session({
        chain,
        actor,
        permission,
        walletPlugin: new WalletPluginPrivateKey(privateKey),
    })
}