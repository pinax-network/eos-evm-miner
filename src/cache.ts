import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { logger } from "./logger.js";

export function folder(method: string) {
    return path.join(os.tmpdir(), 'eos-evm-miner', method);
}

export async function exists(method: string, file: string) {
    const filepath = path.join(folder(method), file);
    return fs.exists(filepath);
}

export async function read(method: string, file: string) {
    const filepath = path.join(folder(method), file);
    if ( await fs.exists(filepath) ) {
        logger.info("💾 cache::read:HIT", {method, file, filepath});
        return fs.readFile(filepath, "utf8");
    }
}

export async function write(method: string, file: string, data: string) {
    if ( !await fs.exists(folder(method)) ) {
        await fs.mkdir(folder(method), { recursive: true });
    }
    const filepath = path.join(folder(method), file);
    logger.info("💾 cache::write:MISS", {method, file, filepath});
    await fs.writeFile(filepath, data);
}
