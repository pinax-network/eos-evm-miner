#!/usr/bin/env node

import { Command } from "commander";
import pkg from "../package.json";
import { DEFAULT_PORT } from "../src/config.js";
import { action } from "../index.js";

const program = new Command();
program.name(pkg.name)
    .version(pkg.version, '-v, --version', `version for ${pkg.name}`)
    .option('-p --port <int>', 'JSON RPC listens on port number.', String(DEFAULT_PORT))
    .action(action);
    // .option('-a --address <string>', 'JSON RPC host address.', DEFAULT_ADDRESS);

program.command('completion').description('Generate the autocompletion script for the specified shell');
program.command('help').description('Display help for command');
program.showHelpAfterError();
program.parse();