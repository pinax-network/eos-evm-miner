# EOS EVM Miner

![GitHub release (latest by date)](https://img.shields.io/github/v/release/pinax-network/eos-evm-miner)
[![Build Status](https://github.com/pinax-network/eos-evm-miner/actions/workflows/test.yml/badge.svg)](https://github.com/pinax-network/eos-evm-miner/actions/workflows/test.yml)

> Accepts Ethereum transactions and relays them to EOS EVM network.

## References

- https://docs.eosnetwork.com/docs/latest/eos-evm/

## [`Bun` Binary Releases](https://github.com/pinax-network/eos-evm-miner/releases)

```
$ wget https://github.com/pinax-network/eos-evm-miner/releases/download/v0.5.0/eos-evm-miner
$ chmod +x ./eos-evm-miner
```

- [x] Ubuntu
- [ ] ~~MacOS~~
- [ ] ~~Windows~~

## Build from source

**Install Bun**
```
curl -fsSL https://bun.sh/install | bash
```

**Generate a standalone Bun executable**
```
$ git clone https://github.com/pinax-network/eos-evm-miner.git
$ cd eos-evm-miner
$ bun build --compile ./bin/cli.ts --outfile eos-evm-miner
```

## Quickstart

```
$ eos-evm-miner start --verbose


        ███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
        ██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
        █████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
        ██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
        ███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
        ╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
                EOS EVM Miner listening @ 127.0.0.1:50305
              Prometheus metrics listening @ 127.0.0.1:9102
                   Your miner account is miner.enf
        PUB_K1_8bxdSx2gET6suSZxz6dWoxux2ysNG3ADJu3n5nWvMEQ6vvRXtS
```

## Help

```
$ eos-evm-miner start --help

Usage: @enf/eos-evm-miner start [options]

Start JSON RPC Server

Options:
  --private-key <string>       Miner private key (ex: "PVT_K1_...")
  --account <string>           Miner account name (ex: "miner.evm")
  --permission <string>        Miner permission (default: "active")
  -p --port <int>              JSON RPC listens on port number, listen for
                               incoming Ethereum transactions. (default:
                               "50305")
  --hostname <string>          JSON RPC listens on hostname, listen for
                               incoming Ethereum transactions (ex: "127.0.0.1)"
  --metrics-listen-port <int>  The process will listen on this port for
                               Prometheus metrics requests (default: "9102")
  --metrics-disabled           If set, will not send metrics to Prometheus
  --verbose                    Enable verbose logging
  --lock-gas-price             Lock gas price as hex value (ex: "0x22ecb25c00")
  -h, --help                   display help for command
```

## Docker environment

```bash
docker build -t eos-evm-miner .
docker run -it --rm -p 50305:50305 --env-file .env eos-evm-miner start
```

## Deploy to Cloud Run

> https://console.cloud.google.com/run

- **DockerHub**: [`gcr.io/pinaxnetwork/eos-evm-miner`](https://hub.docker.com/r/pinaxnetwork/eos-evm-miner)

```
gcloud run deploy
```

## Environment Variables

**`.env`**
```env
# miner (required)
PRIVATE_KEY=PVT_K1_...
MINER_ACCOUNT=miner.enf

# miner (optional)
MINER_PERMISSION=active

# RPC EOS (optional)
RPC_ENDPOINT=https://eos.api.eosnation.io
CHAIN_ID=aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906

# RPC EVM (optional)
RPC_EVM_ENDPOINT=https://api.evm.eosnetwork.com

# JSON RPC (optional)
PORT=50305
HOSTNAME=127.0.0.1
LOCK_GAS_PRICE=0x22ecb25c00
LOCK_CHAIN_ID=0x4571
LOCK_GENESIS_TIME="2023-04-05T02:18:09"

# Prometheus Metrics
PROMETHEUS_PORT=9102
METRICS_DISABLED=false

# CLI (optional)
VERBOSE=true
```

## Testing

```bash
$ bun test
bun test v0.6.7 (59d7c47e)
[0.28ms] ".env"

src/eth_sendRawTransaction.spec.ts:
✓ eth_sendRawTransaction [1.45ms]

src/eth_gasPrice.spec.ts:
✓ eth_gasPrice [226.88ms]
```

## Features

- [x] JSON RPC methods (Request to EOS RPC)
  - [x] `eth_gasPrice` - Returns the current gas price on the network in wei.
  - [x] `eth_sendRawTransaction` - Creates new message call transaction or a contract creation for signed transactions.
  - [x] `eth_chainId` - Returns the current network/chain ID, used to sign replay-protected transaction introduced in EIP-155.
  - [x] `eth_blockNumber` - Returns the latest block number of the blockchain.
  - [x] `eth_getBalance` - Returns the balance of given account address in wei.
  - [x] `net_version` - Returns the current network id.
  - [x] `eth_getCode` - Returns the compiled bytecode of a smart contract.
- [x] JSON RPC methods (Proxy to EVM RPC)
  - [x] `eth_estimateGas` - Returns an estimation of gas for a given transaction.
  - [x] `eth_getTransactionCount` - Returns the number of transactions sent from an address.
  - [x] `eth_getTransactionReceipt` - Returns the receipt of a transaction by transaction hash.
  - [x] `eth_getBlockByHash` - Returns information of the block matching the given block hash.
  - [x] `eth_getBlockByNumber` - Returns information of the block matching the given block number.
  - [x] `eth_call` - Executes a new message call immediately without creating a transaction on the block chain.
  - [x] ... and all other supported EVM method calls

- [x] CLI commands
  - [x] `start` - start miner JSON RPC server
  - [x] `claim` - claim miner rewards
  - [x] `open` - open miner balance
  - [x] `powerup` - powerup miner CPU & NET
- [x] `Bun` binary builds
- [x] Docker Container
  - [ ] ~~Alpine Docker image~~
  - [ ] ~~"Distroless" Docker image~~
- [x] Prometheus metrics
  - [x] total `eth_gasPrice` requests & success
  - [x] total `eth_sendRawTransaction` requests & success
