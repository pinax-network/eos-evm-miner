import { describe, it } from "node:test";
import assert from "node:assert";

/***
 * ⚠ WARNING ⚠
 * You must be running this miner locally for this to work.
 * This test also expects that you have the default port set up for the miner.
 */

const sendRpc = data => fetch(`http://localhost:50305`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
}).then(x => x.json());

describe('RPC tests', () => {
    it('should be able to send calls to the RPC', async () => {
        const dataToSend = {
            "jsonrpc": "2.0",
            "params": [
                // some fake tx from chatgpt, probably sends nukes
                "0xf8aa8204e3843b9aca0082520894775e97edc8f2a2c7aa290d372320d56d1c9e19b80b844a9059cbb000000000000000000000000a7a0a0a0000000000000000000000000000000000000000000000000000000000001ba0aa0721dc8f0b44f7a7dfb5f5d5a15d5c5c5f5e5d5d5c5b5b5a5a5b5c5d5e5f5c5c5d5e5f5e5d5c5b5a5b5b5a5a5b5c5d5e5f5c5c5d5e5f5e5d5c5b5a5b5a5a5b",
                "latest"
            ],
            "id": 1
        };
        // TO-DO allow test to run in CI
        return;

        const gasPrice = await sendRpc({...dataToSend, method: 'eth_gasPrice'})
            .catch(e => console.error(e));

        // Validating the response format
        assert(gasPrice.hasOwnProperty('jsonrpc'), 'Expected jsonrpc property');
        assert(gasPrice.hasOwnProperty('id'), 'Expected id property');
        assert(gasPrice.hasOwnProperty('result'), 'Expected result property');
        assert(gasPrice.jsonrpc === '2.0', 'Expected jsonrpc to be 2.0');

        assert(gasPrice.result !== '0x1', 'Expected gas price have been gotten from an API');


        const pushTx = await sendRpc({...dataToSend, method: 'eth_sendRawTransaction'})
            .catch(e => console.error(e));

        assert(pushTx.error && pushTx.error.code === -32000, 'Expected error code -32000');
    });
});
