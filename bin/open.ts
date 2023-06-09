import { createSession, explorer } from "../src/config.js";
import * as actions from "../src/actions.js";
import { balances } from "../src/tables.js";
import { type DefaultOptions } from "./cli.js"

export async function open(options: DefaultOptions) {
    // create Wharfkit session
    const session = createSession(options);

    // lookup current balance
    const result = await balances(session);

    // withdraw if balance exists
    if ( !result ) {
        const action = actions.open(session);
        const response = await session.transact({action})
        const trx_id = response.response?.transaction_id;
        console.log(`${session.actor.toString()} balance opened ${explorer(session, trx_id)}`);
    } else {
        console.log(`${session.actor.toString()} balance is already opened`);
    }
}