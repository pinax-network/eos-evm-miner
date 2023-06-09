import { createSession, explorer } from "../src/config.js";
import * as actions from "../src/actions.js";
import { balances } from "../src/tables.js";
import { type DefaultOptions } from "./cli.js"

export async function claim(options: DefaultOptions) {
    // create Wharfkit session
    const session = createSession(options);

    // lookup current balance
    const result = await balances(session);

    // withdraw if balance exists
    if ( result ) {
        const balance = result.balance.balance;
        const action = actions.withdraw(session, balance);
        const response = await session.transact({action})
        const trx_id = response.response?.transaction_id;
        console.log(`${session.actor.toString()} claimed ${balance} ${explorer(session, trx_id)}`);
    } else {
        console.log(`${session.actor.toString()} has no balance to claim`);
    }
}