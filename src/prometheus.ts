import client, { Counter } from "prom-client";
import http from "node:http";

// Prometheus Exporter
export const register = new client.Registry();

// Create a local server to serve Prometheus gauges
export const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': register.contentType });
    res.end(await register.metrics());
});

// Metrics
function registerCounter(name: string, help = "help", labelNames: string[] = []): Counter | undefined {
    try {
        register.registerMetric(new Counter({ name, help, labelNames }));
        return register.getSingleMetric(name) as Counter;
    } catch (e) {
        //
    }
}
// Counters
export const eth_getBalance = {
    requests: registerCounter("eth_getBalance_requests", "Total eth_getBalance requests"),
    responses: registerCounter("eth_getBalance_responses", "Total eth_getBalance responses")
}

export const eth_gasPrice = {
    requests: registerCounter("eth_gasPrice_requests", "Total eth_gasPrice requests"),
    responses: registerCounter("eth_gasPrice_responses", "Total eth_gasPrice responses")
}
export const eth_sendRawTransaction = {
    requests: registerCounter("eth_sendRawTransaction_requests", "Total eth_sendRawTransaction requests"),
    responses: registerCounter("eth_sendRawTransaction_responses", "Total eth_sendRawTransaction responses"),
}
export const eth_chainId = {
    requests: registerCounter("eth_chainId_requests", "Total eth_chainId requests"),
    responses: registerCounter("eth_chainId_responses", "Total eth_chainId responses"),
}
export const eth_blockNumber = {
    requests: registerCounter("eth_blockNumber_requests", "Total eth_blockNumber requests"),
    responses: registerCounter("eth_blockNumber_responses", "Total eth_blockNumber responses"),
}

export const eth_getBlockByNumber = {
    requests: registerCounter("eth_getBlockByNumber_requests", "Total eth_getBlockByNumber requests"),
    responses: registerCounter("eth_getBlockByNumber_responses", "Total eth_getBlockByNumber responses"),
}

export const eth_estimateGas = {
    requests: registerCounter("eth_estimateGas_requests", "Total eth_estimateGas requests"),
    responses: registerCounter("eth_estimateGas_responses", "Total eth_estimateGas responses"),
}

export const eth_getCode = {
    requests: registerCounter("eth_getCode_requests", "Total eth_eth_getCode requests"),
    responses: registerCounter("eth_getCode_responses", "Total eth_eth_getCode responses"),
}

export const net_version = {
    requests: registerCounter("net_version_requests", "Total net_version requests"),
    responses: registerCounter("net_version_responses", "Total net_version responses"),
}

export const requests = {
    received: registerCounter("requests_received", "Total requests"),
    response: registerCounter("requests_responses", "Total responses"),
    errors: registerCounter("requests_errors", "Total errors"),
}

export async function listen(port: number, hostname?: string) {
    return new Promise(resolve => {
        server.listen(port, hostname, () => {
            resolve(true);
        });
    })
}