#!/usr/bin/env node

import { Command } from "commander";
import pkg from "../package.json";
import { DEFAULT_LOCK_GAS_PRICE, DEFAULT_MINER_PERMISSION, DEFAULT_PORT } from "../src/config.js";
import { claim, start } from "../index.js";

const program = new Command();
program.name(pkg.name)
    .description("EOS EVM Miner JSON RPC Server")
    .version(pkg.version, '-v, --version', `version for ${pkg.name}`)

// Start JSON RPC Server
defaultOptions(program.command("start"))
    .description("Start JSON RPC Server")
    .option('-p --port <int>', 'JSON RPC listens on port number (listen for incoming Ethereum transactions).', String(DEFAULT_PORT))
    .option('--verbose', 'Enable verbose logging', false)
    .option('--lock-gas-price', `Lock gas price as hex value (ex: "${DEFAULT_LOCK_GAS_PRICE}")`)
    .action(start);

// Claim EOS EVM Miner
defaultOptions(program.command("claim"))
    .description("Claim EOS EVM miner rewards")
    .action(claim);

program.command('completion').description('Generate the autocompletion script for the specified shell');
program.command('help').description('Display help for command');
program.showHelpAfterError();
program.parse();

function defaultOptions(command: Command) {
    return command.option('--private-key <string>', 'Miner private key (ex: "PVT_K1_...")')
        .option('--account <string>', 'Miner account name (ex: "miner.evm")')
        .option('--permission <string>', 'Miner permission', DEFAULT_MINER_PERMISSION)
}
