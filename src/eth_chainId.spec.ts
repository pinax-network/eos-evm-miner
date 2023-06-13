import assert from "node:assert";
import { eth_chainId } from "./eth_chainId.js"
import { PrivateKey } from "@wharfkit/session";
import { test } from "bun:test";
import { createSession } from "./createSession.js";

// start the miner
const session = createSession({
    actor: "miner.enf",
    privateKey: PrivateKey.generate("K1").toString(),
});

test('eth_chainId', async () => {
    const result = await eth_chainId(session)
    assert.equal(result, '0x4571');
});
