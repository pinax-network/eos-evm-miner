# EOS EVM Miner

This tool allows you to accept Ethereum transactions and relay them to the EOS EVM.

For every transaction that you relay you will receive a reward in the form of EOS tokens.

## Usage

> ⚠ **You must have registered your miner**
>
> You must have registered your miner account on the EOS Network.
> [Head over to our docs](https://docs.eosnetwork.com/docs/latest/eos-evm/mining/basic-setup) to learn all about mining, claiming your rewards, and more.

## [Binaries Releases](https://github.com/pinax-network/eos-evm-miner/releases)

- Linux
- MacOS
- Windows

## Quickstart

```
$ eos-evm-miner start

███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
█████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
    EOS EVM Miner listening @ http://127.0.0.1:50305
        Your miner account is miner.evm
```

## Help

```
$ eos-evm-miner start --help

Usage: @enf/eos-evm-miner start [options]

Start JSON RPC Server

Options:
  --private-key <string>  Miner private key (ex: "PVT_K1_...")
  --account <string>      Miner account name (ex: "miner.evm")
  --permission <string>   Miner permission (default: "active")
  -p --port <int>         JSON RPC listens on port number (listen for incoming Ethereum transactions).
                          (default: "50305")
  --verbose               Enable verbose logging (default: false)
  --lock-gas-price        Lock gas price as hex value (ex: "0x22ecb25c00")
  -h, --help              display help for command
```

## Docker environment

```bash
docker build -t eos-evm-miner .
docker run -it --rm -p 50305:50305 --env-file .env eos-evm-miner
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

# Nodeos (optional)
RPC_ENDPOINT=https://eos.greymass.com
CHAIN_ID=aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906

# JSON RPC (optional)
PORT=50305
LOCK_GAS_PRICE=0x22ecb25c00

# CLI (optional)
VERBOSE=true
```

## Features

- [x] JSON RPC methods
  - [x] `eth_gasPrice` - get dynamic or static gas price
  - [x] `eth_sendRawTransaction` - send raw transaction to Nodeos RPC
- [x] CLI commands
  - [x] `start` - start miner JSON RPC server
  - [x] `claim` - claim miner rewards
  - [x] `open` - open miner balance
  - [x] `powerup` - powerup miner CPU & NET
- [x] `Bun` binary builds
- [x] Docker Container
  - [ ] "Distroless" Docker image