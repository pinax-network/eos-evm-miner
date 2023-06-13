import assert from "node:assert";
import { eth_getBalance } from "./eth_getBalance.js"
import { PrivateKey } from "@wharfkit/session";
import { test } from "bun:test";
import { createSession } from "./createSession.js";

// start the miner
const session = createSession({
    actor: "miner.enf",
    privateKey: PrivateKey.generate("K1").toString(),
});

test('eth_getBalance', async () => {
    const result = await eth_getBalance(session, ["88e529a16d89cab7d694a28a10e65c2947548055", "latest"])
    assert.equal(result.length > 0, true);
});
