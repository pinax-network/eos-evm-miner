import { test } from "bun:test";
import assert from "node:assert";
import { eth_sendRawTransaction } from "./eth_sendRawTransaction.js"
import { PrivateKey } from "@wharfkit/session";
import { createSession } from "./config.js";

// start the miner
const session = createSession({
    actor: "miner.enf",
    privateKey: PrivateKey.generate("K1").toString(),
})

test('eth_sendRawTransaction', async () => {
    const params = [
        // some fake tx from chatgpt, probably sends nukes
        "0xf8aa8204e3843b9aca0082520894775e97edc8f2a2c7aa290d372320d56d1c9e19b80b844a9059cbb000000000000000000000000a7a0a0a0000000000000000000000000000000000000000000000000000000000001ba0aa0721dc8f0b44f7a7dfb5f5d5a15d5c5c5f5e5d5d5c5b5b5a5a5b5c5d5e5f5c5c5d5e5f5e5d5c5b5a5b5b5a5a5b5c5d5e5f5c5c5d5e5f5e5d5c5b5a5b5a5a5b",
        "latest"
    ]
    const trx_id = await eth_sendRawTransaction(session, params, false);
    assert.equal(trx_id, '0x262d98979f48d17906590502f99697e864933df08cc79c34c785ed34aadadd8b', 'Expected gas price have been gotten from an API');
});
