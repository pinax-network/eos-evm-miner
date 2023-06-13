import assert from "node:assert";
import { eth_gasPrice } from "./eth_gasPrice.js"
import { PrivateKey } from "@wharfkit/session";
import { test } from "bun:test";
import { createSession } from "./createSession.js";

// start the miner
const session = createSession({
    actor: "miner.enf",
    privateKey: PrivateKey.generate("K1").toString(),
})

test('eth_gasPrice', async () => {
    const result = await eth_gasPrice(session)
    assert.equal(result, '0x22ecb25c00');
});
