import assert from "node:assert";
import { eth_gasPrice } from "./eth_gasPrice.js"
import { PrivateKey } from "@wharfkit/session";
import { createSession } from "./config.js";
import { test } from "bun:test";

// start the miner
const session = createSession({
    actor: "miner.enf",
    privateKey: PrivateKey.generate("K1").toString(),
})

test('eth_gasPrice', async () => {
    const gasPrice = await eth_gasPrice(session)
    assert.equal(gasPrice, '0x22ecb25c00', 'Expected gas price have been gotten from an API');
});
