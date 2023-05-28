# EOS EVM Miner

This tool allows you to accept Ethereum transactions and relay them to the EOS EVM.

For every transaction that you relay you will receive a reward in the form of EOS tokens.

## Usage

> ⚠ **You must have registered your miner**
>
> You must have registered your miner account on the EOS Network. [Head over to our
> docs](https://docs.eosnetwork.com/docs/latest/eos-evm/mining/basic-setup) to learn all about
> mining, claiming your rewards, and more.

## [Binaries Releases](https://github.com/pinax-network/eos-evm-miner/releases)

- Windows
- MacOS
- Linux

## Quickstart

```
$ eos-evm-miner

███████╗ ██████╗ ███████╗    ███████╗██╗   ██╗███╗   ███╗
██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║   ██║████╗ ████║
█████╗  ██║   ██║███████╗    █████╗  ██║   ██║██╔████╔██║
██╔══╝  ██║   ██║╚════██║    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║
███████╗╚██████╔╝███████║    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║
╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝
    EOS EVM Miner listening @ http://127.0.0.1:50305
        Your miner account is miner.evm
```

## Environment Variables

**`.env`**
```env
# miner (required)
PRIVATE_KEY="PVT_K1_..."
MINER_ACCOUNT=miner.evm

# miner (optional)
MINER_PERMISSION=active

# RPC (optional)
RPC_ENDPOINT=https://eos.greymass.com
CHAIN_ID=aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906
PORT=50305 # listen for incoming Ethereum transactions
LOCK_GAS_PRICE=true # lock fetching new gas price
```

## Features

- [x] Relay Ethereum transactions to the EOS EVM
- [x] Get gas price from the EOS Network
  - [ ] cache results
- [x] Claim rewards