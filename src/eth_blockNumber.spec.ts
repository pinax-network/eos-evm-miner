import assert from "node:assert";
import { eth_blockNumber } from "./eth_blockNumber.js"
import { PrivateKey } from "@wharfkit/session";
import { createSession } from "./config.js";
import { test } from "bun:test";

// start the miner
const session = createSession({
    actor: "miner.enf",
    privateKey: PrivateKey.generate("K1").toString(),
});

test('eth_blockNumber', async () => {
    const result = await eth_blockNumber(session)
    assert.equal(result.length > 0, true);
});
