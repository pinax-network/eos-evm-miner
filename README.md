# EOS EVM Miner

> Accepts Ethereum transactions and relays them to EOS EVM network.

## References

- https://docs.eosnetwork.com/docs/latest/eos-evm/

## [`Bun` Binary Releases](https://github.com/pinax-network/eos-evm-miner/releases)

- Linux
- MacOS
- Windows

## Quickstart

```
$ eos-evm-miner start --verbose

███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
█████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
    EOS EVM Miner listening @ http://127.0.0.1:50305
        Your miner account is miner.enf
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
  -p --port <int>              JSON RPC listens on port number (listen for
                               incoming Ethereum transactions). (default:
                               "50305")
  --hostname <string>          JSON RPC listens on hostname (listen for
                               incoming Ethereum transactions). (default:
                               "127.0.0.1")
  --metrics-listen-port <int>  The process will listen on this port for
                               Prometheus metrics requests (default: "9102")
  --metrics-disabled           If set, will not send metrics to Prometheus
                               (default: false)
  --verbose                    Enable verbose logging (default: false)
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

# Nodeos (optional)
RPC_ENDPOINT=https://eos.greymass.com
CHAIN_ID=aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906

# JSON RPC (optional)
PORT=50305
HOSTNAME=127.0.0.1
LOCK_GAS_PRICE=0x22ecb25c00

# Prometheus Metrics
PROMETHEUS_PORT=9102

# CLI (optional)
VERBOSE=true
```

## Build from source

```
$ bun build --compile ./bin/cli.ts --outfile eos-evm-miner
[0.03ms] ".env"
  [31ms]  bundle  304 modules
 [101ms] compile  eos-evm-miner
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
- [x] Prometheus metrics
  - [x] total `eth_gasPrice` requests & success
  - [x] total `eth_sendRawTransaction` requests & success