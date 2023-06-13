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
    requests: registerCounter("eth_getBalance_requests", "The number of eth_getBalance errors from request received"),
    success: registerCounter("eth_getBalance_success", "The number of eth_getBalance successful request received")
}

export const eth_gasPrice = {
    requests: registerCounter("eth_gasPrice_requests", "The number of eth_gasPrice errors from request received"),
    success: registerCounter("eth_gasPrice_success", "The number of eth_gasPrice successful request received")
}
export const eth_sendRawTransaction = {
    requests: registerCounter("eth_sendRawTransaction_requests", "The number of eth_sendRawTransaction errors from request received"),
    success: registerCounter("eth_sendRawTransaction_success", "The number of eth_sendRawTransaction successful request received"),
}
export const eth_chainId = {
    requests: registerCounter("eth_chainId_requests", "The number of eth_chainId errors from request received"),
    success: registerCounter("eth_chainId_success", "The number of eth_chainId successful request received"),
}
export const eth_blockNumber = {
    requests: registerCounter("eth_blockNumber_requests", "The number of eth_blockNumber errors from request received"),
    success: registerCounter("eth_blockNumber_success", "The number of eth_blockNumber successful request received"),
}

export const eth_getBlockByNumber = {
    requests: registerCounter("eth_getBlockByNumber_requests", "The number of eth_getBlockByNumber errors from request received"),
    success: registerCounter("eth_getBlockByNumber_success", "The number of eth_getBlockByNumber successful request received"),
}

export const eth_estimateGas = {
    requests: registerCounter("eth_estimateGas_requests", "The number of eth_estimateGas errors from request received"),
    success: registerCounter("eth_estimateGas_success", "The number of eth_estimateGas successful request received"),
}

export const eth_getCode = {
    requests: registerCounter("eth_getCode_requests", "The number of eth_eth_getCode errors from request received"),
    success: registerCounter("eth_getCode_success", "The number of eth_eth_getCode successful request received"),
}

export const net_version = {
    requests: registerCounter("net_version_requests", "The number of net_version errors from request received"),
    success: registerCounter("net_version_success", "The number of net_version successful request received"),
}

export async function listen(port: number, hostname?: string) {
    return new Promise(resolve => {
        server.listen(port, hostname, () => {
            resolve(true);
        });
    })
}