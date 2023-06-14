#!/usr/bin/env bun

import { Command } from "commander";
import pkg from "../package.json" assert { type: "json" };
import { DEFAULT_HOSTNAME, EXAMPLE_LOCK_CHAIN_ID, DEFAULT_LOCK_GAS_PRICE, EXAMPLE_LOCK_GENESIS_TIME, DEFAULT_MINER_PERMISSION, DEFAULT_PORT, DEFAULT_PROMETHEUS_PORT, DEFAULT_RPC_ENDPOINT, DEFAULT_RPC_EVM_ENDPOINT } from "../src/config.js";
import { claim } from "./claim.js";
import { open } from "./open.js";
import { powerup } from "./powerup.js";
import start from "../index.js";

const program = new Command();
program.name(pkg.name)
    .description("EOS EVM Miner JSON RPC Server")
    .version(pkg.version, '-v, --version', `version for ${pkg.name}`)


export interface StartOptions extends DefaultOptions {
    port?: number;
    metricsListenPort?: number;
    hostname?: string;
    verbose?: boolean;
    metricsDisabled?: boolean;
    lockGasPrice?: string;
    lockChainId?: string;
    lockGenesisTime?: string;
    rpcEvmEndpoint?: string;
    rpcEndpoint?: string;
    showEndpoints?: boolean;
    showMiner?: boolean;
}

// Start JSON RPC Server
defaultOptions(program.command("start"))
    .description("Start JSON RPC Server")
    .option('-p --port <int>', 'JSON RPC listens on port number, listen for incoming Ethereum transactions.', String(DEFAULT_PORT))
    .option('--hostname <string>', `JSON RPC listens on hostname, listen for incoming Ethereum transactions (ex: "${DEFAULT_HOSTNAME})"`)
    .option('--metrics-listen-port <int>', 'The process will listen on this port for Prometheus metrics requests', String(DEFAULT_PROMETHEUS_PORT))
    .option('--metrics-disabled', 'If set, will not send metrics to Prometheus')
    .option('--verbose', 'Enable verbose logging')
    .option('--lock-gas-price', `Lock gas price as hex value (ex: "${DEFAULT_LOCK_GAS_PRICE}")`)
    .option('--lock-chain-id', `Lock chain ID as hex value (ex: "${EXAMPLE_LOCK_CHAIN_ID}")`)
    .option('--lock-genesis-time', `Lock genesis time (ex: "${EXAMPLE_LOCK_GENESIS_TIME}")`)
    .option('--rpc-endpoint', `EOS RPC endpoint (ex: "${DEFAULT_RPC_ENDPOINT}")`)
    .option('--rpc-evm-endpoint', `EOS RPC endpoint (ex: "${DEFAULT_RPC_EVM_ENDPOINT}")`)
    .option('--show-endpoints', 'If set, will display all RPC endpoints used by the server')
    .option('--show-miner', 'If set, will display all miner account details used by the server')
    .action(options => {
        start(options);
    });

// Claim EOS EVM Miner
defaultOptions(program.command("claim"))
    .description("Claim EOS EVM miner rewards")
    .action(claim);

// Open EOS EVM Miner balance
defaultOptions(program.command("open"))
    .description("Open EOS EVM miner balance")
    .action(open);

// Powerup EOS EVM Miner CPU & NET resources
defaultOptions(program.command("powerup"))
    .description("Powerup EOS EVM Miner CPU & NET resources")
    .argument('<number>', 'NET fraction (ex: 1000)')
    .argument('<number>', 'CPU fraction (ex: 100000)')
    .argument('<string>', 'Max payment (ex: "0.1000 EOS")')
    .action(powerup);

program.command('completion').description('Generate the autocompletion script for the specified shell');
program.command('help').description('Display help for command');
program.showHelpAfterError();
program.parse();

export interface DefaultOptions {
    privateKey?: string;
    actor?: string;
    permission?: string;
}

function defaultOptions(command: Command) {
    return command
        .option('--private-key <string>', 'Miner private key (ex: "PVT_K1_...")')
        .option('--actor <string>', 'Miner account name (ex: "miner.enf")')
        .option(`--permission <string>', 'Miner permission (ex: ${DEFAULT_MINER_PERMISSION})`)
}
