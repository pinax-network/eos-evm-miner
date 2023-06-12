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
export const gasPrice = {
    requests: registerCounter("eth_gas_price_requests", "The number of eth_gasPrice errors from request received"),
    success: registerCounter("eth_gas_price_success", "The number of eth_gasPrice successful request received")
}
export const sendRawTransaction = {
    requests: registerCounter("eth_send_raw_transaction_requests", "The number of eth_sendRawTransaction errors from request received"),
    success: registerCounter("eth_send_raw_transaction_success", "The number of eth_sendRawTransaction successful request received"),
}
export const chainId = {
    requests: registerCounter("eth_chain_id_requests", "The number of eth_chainId errors from request received"),
    success: registerCounter("eth_chain_id_success", "The number of eth_chainId successful request received"),
}

export async function listen(port: number, hostname?: string) {
    return new Promise(resolve => {
        server.listen(port, hostname, () => {
            resolve(true);
        });
    })
}