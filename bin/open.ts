import * as actions from "../src/actions.js";
import { createSession } from "../src/createSession.js";
import { getExplorer } from "../src/getExplorer.js";
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
        console.log(`${session.actor.toString()} balance opened ${getExplorer(session, trx_id)}`);
    } else {
        console.log(`${session.actor.toString()} balance is already opened`);
    }
}