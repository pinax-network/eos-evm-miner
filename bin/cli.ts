#!/usr/bin/env bun

import { Command } from "commander";
import pkg from "../package.json" assert { type: "json" };
import { DEFAULT_HOSTNAME, DEFAULT_LOCK_GAS_PRICE, DEFAULT_METRICS_DISABLED, DEFAULT_MINER_PERMISSION, DEFAULT_PORT, DEFAULT_PROMETHEUS_PORT } from "../src/config.js";
import { claim } from "./claim.js";
import { open } from "./open.js";
import { powerup } from "./powerup.js";
import start from "../index.js";

const program = new Command();
program.name(pkg.name)
    .description("EOS EVM Miner JSON RPC Server")
    .version(pkg.version, '-v, --version', `version for ${pkg.name}`)

// Start JSON RPC Server
defaultOptions(program.command("start"))
    .description("Start JSON RPC Server")
    .option('-p --port <int>', 'JSON RPC listens on port number, listen for incoming Ethereum transactions.', String(DEFAULT_PORT))
    .option('--hostname <string>', `JSON RPC listens on hostname, listen for incoming Ethereum transactions (ex: "${DEFAULT_HOSTNAME})"`)
    .option('--metrics-listen-port <int>', 'The process will listen on this port for Prometheus metrics requests', String(DEFAULT_PROMETHEUS_PORT))
    .option('--metrics-disabled', 'If set, will not send metrics to Prometheus')
    .option('--verbose', 'Enable verbose logging')
    .option('--lock-gas-price', `Lock gas price as hex value (ex: "${DEFAULT_LOCK_GAS_PRICE}")`)
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
        .option('--account <string>', 'Miner account name (ex: "miner.evm")')
        .option('--permission <string>', 'Miner permission', DEFAULT_MINER_PERMISSION)
}
