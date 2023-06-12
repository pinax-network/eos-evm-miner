import assert from "node:assert";
import { eth_chainId } from "./eth_chainId.js"
import { PrivateKey } from "@wharfkit/session";
import { createSession } from "./config.js";
import { test } from "bun:test";

// start the miner
const session = createSession({
    actor: "miner.enf",
    privateKey: PrivateKey.generate("K1").toString(),
});

test('eth_chainId', async () => {
    const chainId = await eth_chainId(session)
    assert.equal(chainId, '0x4571');
});
