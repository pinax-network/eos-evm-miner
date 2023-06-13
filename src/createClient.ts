import { JSONRPCClient, JSONRPCResponse } from "json-rpc-2.0";

export function createClient(rpcEvmEndpoint: string) {
    const client = new JSONRPCClient(async jsonRPCRequest => {
        const response = await fetch(rpcEvmEndpoint, {
            method: "POST",
            headers: { "content-type": "application/json"},
            body: JSON.stringify(jsonRPCRequest),
        });
        if ( jsonRPCRequest.id !== undefined ) new Error(response.statusText);
        if ( response.status !== 200) new Error(response.statusText);
        const jsonRPCResponse: JSONRPCResponse = await response.json();
        client.receive(jsonRPCResponse);
    });
    return client;
};
