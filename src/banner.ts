import pkg from "../package.json" assert { type: "json" };
import { Session } from "@wharfkit/session";
import { StartOptions } from "../bin/cli.js";
import { DEFAULT_HOSTNAME } from "./config.js";

export function banner( session: Session, port: number, options: StartOptions = {} ) {
    const host = `${options.hostname ?? DEFAULT_HOSTNAME}:${port.toString()}`;
    const host_metrics = `${options.hostname ?? DEFAULT_HOSTNAME}:${options.metricsListenPort?.toString()}`
    const publicKey = session.walletPlugin.metadata.publicKey;
    let text = `

        ███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
        ██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
        █████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
        ██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
        ███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
        ╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
`
    text += `                        EOS EVM Miner v${pkg.version}\n`
    if ( options.showEndpoints ) text += `           Ethereum JSON-RPC API listening on @ ${host}\n`
    if ( options.showEndpoints && !options.metricsDisabled ) text += `            Prometheus metrics listening on @ ${host_metrics}\n`;
    if ( options.showEndpoints ) text += `             RPC Nodeos proxy @ ${session.chain.url.toString()}\n`
    if ( options.showEndpoints ) text += `              RPC EVM proxy @ ${options.rpcEvmEndpoint}\n`
    if ( options.showMiner ) text += `                      EVM miner [${session.actor.toString()}]\n`;
    if ( options.showMiner && publicKey ) text += `        ${publicKey}\n`
    return text;
}
