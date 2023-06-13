import * as actions from "../src/actions.js";
import { createSession } from "../src/createSession.js";
import { getExplorer } from "../src/getExplorer.js";
import { type DefaultOptions } from "./cli.js"

export interface PowerupOptions extends DefaultOptions {
    netFrac: string;
    cpuFrac: string;
    maxPayment: string;
}

export async function powerup(net_frac: string, cpu_frac: string, max_payment: string, options: PowerupOptions) {
    // create Wharfkit session
    const session = createSession(options);

    // Push on-chain action
    const action = actions.powerup(session, net_frac, cpu_frac, max_payment);
    const response = await session.transact({action})
    const trx_id = response.response?.transaction_id;
    console.log(`${session.actor.toString()} powerup success ${getExplorer(session, trx_id)}`);
}