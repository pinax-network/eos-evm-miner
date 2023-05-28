#!/usr/bin/env node

import { Command } from "commander";
import pkg from "../package.json";
import { DEFAULT_PORT } from "../src/config.js";
import { claim, run } from "../index.js";

const program = new Command();
program.name(pkg.name)
    .description("EOS EVM Miner JSON RPC Server")
    .option('-p --port <int>', 'JSON RPC listens on port number.', String(DEFAULT_PORT))
    .version(pkg.version, '-v, --version', `version for ${pkg.name}`)
    .action(run);

program.command("claim")
    .description("Claim EOS EVM Miner")
    .action(claim);

program.command('completion').description('Generate the autocompletion script for the specified shell');
program.command('help').description('Display help for command');
program.showHelpAfterError();
program.parse();