import assert from "node:assert";
import { net_version } from "./net_version.js"
import { PrivateKey } from "@wharfkit/session";
import { createSession } from "./config.js";
import { test } from "bun:test";

// start the miner
const session = createSession({
    actor: "miner.enf",
    privateKey: PrivateKey.generate("K1").toString(),
});

test('net_version', async () => {
    const result = await net_version(session)
    assert.equal(result, '0x4571');
});
