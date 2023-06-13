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
    const result = await eth_gasPrice(session)
    assert.equal(result, '0x22ecb25c00');
});

// console.log("0xde0b6b3a7640000", parseInt("0xde0b6b3a7640000"))
// console.log("0x22ecb25c00", parseInt("0x22ecb25c00"))
// console.log("0x5208", parseInt("0x5208"))
