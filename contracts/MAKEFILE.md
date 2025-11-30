# Makefile Commands Guide

## Overview

This Makefile provides shortcuts for common Foundry operations. It automatically loads environment variables from `.env` and simplifies complex commands into easy-to-remember targets.

---

## Prerequisites

- Foundry installed (`forge`, `anvil`, `cast`)
- Make installed (pre-installed on macOS/Linux, use WSL on Windows)
- `.env` file configured (for testnet/mainnet deployments)

---

## Available Commands

### Help
```bash
make help
```

Displays all available commands with descriptions.

---

## Development Commands

### Build
```bash
make build
```

**What it does:**
- Compiles all Solidity contracts in `src/`
- Generates ABI and bytecode in `out/`
- Shows compilation warnings/errors

**When to use:**
- After writing/editing contracts
- Before running tests
- Before deployment

---

### Test
```bash
make test
```

**What it does:**
- Runs all tests in `test/` directory
- Shows pass/fail status for each test
- Quick feedback on contract functionality

**Variations:**
```bash
make test-v          # Verbose output (shows logs, traces)
make test-gas        # Shows gas usage report
make test-watch      # Auto-reruns tests when files change
```

**When to use:**
- During development (use `test-watch`)
- Before committing code
- To verify gas optimization

---

### Clean
```bash
make clean
```

**What it does:**
- Removes `out/` and `cache/` directories
- Cleans all build artifacts
- Fresh start for compilation

**When to use:**
- When facing weird compilation errors
- Before rebuilding from scratch
- To save disk space

---

## Local Development

### Start Anvil
```bash
make anvil
```

**What it does:**
- Starts local Ethereum blockchain
- Provides 10 pre-funded accounts
- Instant block mining (no waiting)
- Runs on `http://localhost:8545`

**Output:**
```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
(1) 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...

Private Keys
==================
(0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

**Leave this terminal running!**

---

### Deploy to Local (Anvil)
```bash
make deploy-local
```

**What it does:**
- Deploys TipJar contract to Anvil
- Uses hardcoded Anvil private key (account #0)
- No `.env` file needed
- Fast deployment (instant mining)

**Prerequisites:**
- Anvil must be running (`make anvil` in another terminal)

**Output:**
```
✅ Deploying to Anvil...
[✓] Script ran successfully.

TipJar deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

**When to use:**
- Testing deployment script
- Local development
- Quick iterations

---

## Testnet Deployment

### Deploy to Base Sepolia (Testnet)
```bash
make deploy-testnet
```

**What it does:**
- Deploys TipJar to Base Sepolia testnet
- Uses private key from `.env`
- Automatically verifies contract on Basescan
- Costs testnet ETH (free from faucet)

**Prerequisites:**
- `.env` file configured with:
  - `BASE_SEPOLIA_RPC_URL`
  - `PRIVATE_KEY`
  - `BASESCAN_API_KEY`
- Testnet ETH in your wallet (from faucet)

**Output:**
```
✅ Deploying to Base Sepolia...
[✓] Contract deployed at: 0x1234...
[✓] Verified on Basescan
```

**When to use:**
- Before mainnet deployment
- Testing with real blockchain
- Getting feedback from testers

---

### Deploy to Base Mainnet (Production)
```bash
make deploy-mainnet
```

**What it does:**
- Shows 5-second warning (can cancel with Ctrl+C)
- Deploys TipJar to Base mainnet
- Uses real ETH (costs money!)
- Automatically verifies contract

**⚠️ WARNING:**
- Uses REAL ETH
- Transaction is irreversible
- Double-check contract before running

**Prerequisites:**
- `.env` file configured
- Real ETH in wallet
- Contract thoroughly tested on testnet

**When to use:**
- Final production deployment only
- After extensive testing

---

## Verification

### Verify Contract
```bash
make verify ADDRESS=0x1234... CONTRACT=TipJar
```

**What it does:**
- Verifies contract source code on Basescan
- Makes code readable on block explorer
- Enables users to read/interact via Basescan

**When to use:**
- If auto-verification failed during deployment
- Manual verification needed

---

## Code Quality

### Format Code
```bash
make format
```

**What it does:**
- Formats all `.sol` files
- Applies consistent style
- Uses Foundry's formatter

**When to use:**
- Before committing code
- To maintain clean codebase

---

### Test Coverage
```bash
make coverage
```

**What it does:**
- Shows which lines of code are tested
- Identifies untested code paths
- Generates coverage report

**When to use:**
- Before deployment
- To improve test quality

---

### Flatten Contract
```bash
make flatten
```

**What it does:**
- Combines all imports into single file
- Outputs `TipJar-flattened.sol`
- Useful for manual verification

**When to use:**
- Manual Basescan verification
- Code review
- Sharing complete contract

---

## Dependency Management

### Install Dependencies
```bash
make install
```

**What it does:**
- Installs Foundry libraries
- Adds dependencies to `lib/`

**When to use:**
- First time setup
- After cloning repository

---

### Update Dependencies
```bash
make update
```

**What it does:**
- Updates all libraries in `lib/`
- Fetches latest versions

**When to use:**
- Periodic updates
- After security patches

---

## Typical Workflows

### Daily Development
```bash
# Terminal 1: Start local blockchain
make anvil

# Terminal 2: Development cycle
make build
make test-watch      # Leave running, auto-tests on save

# When ready to test deployment
make deploy-local
```

---

### Before Testnet Deployment
```bash
# 1. Full test suite
make test

# 2. Check gas costs
make test-gas

# 3. Check coverage
make coverage

# 4. Format code
make format

# 5. Deploy to testnet
make deploy-testnet
```

---

### Production Deployment Checklist
```bash
# 1. Clean build
make clean
make build

# 2. Run all tests
make test

# 3. Test on Anvil
make anvil              # Terminal 1
make deploy-local       # Terminal 2

# 4. Deploy to testnet
make deploy-testnet

# 5. Test on testnet (manual)

# 6. Deploy to mainnet
make deploy-mainnet     # ⚠️ Uses real ETH!
```

---

## Environment Variables

The Makefile automatically loads `.env` file. Required variables:
```bash
# For testnet/mainnet deployments
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
BASESCAN_API_KEY=YOUR_API_KEY
```

**For local Anvil deployment:** No `.env` needed!

---

## Troubleshooting

### "make: command not found"

**Solution:**
```bash
# macOS
brew install make

# Linux (Ubuntu/Debian)
sudo apt-get install make
```

---

### "RPC URL not set"

**Solution:**
- Ensure `.env` exists in `contracts/` directory
- Check variable names match Makefile

---

### "Insufficient funds"

**Solution for testnet:**
- Get testnet ETH from faucet
- Base Sepolia: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

**Solution for mainnet:**
- Add ETH to wallet
- Check gas prices before deployment

---

### "Contract verification failed"

**Solution:**
- Check `BASESCAN_API_KEY` is correct
- Wait 1 minute, try manual verification:
```bash
  make verify ADDRESS=0x... CONTRACT=TipJar
```

---

## Quick Reference

| Command | Purpose | .env Needed? |
|---------|---------|--------------|
| `make build` | Compile contracts | ❌ |
| `make test` | Run tests | ❌ |
| `make anvil` | Start local chain | ❌ |
| `make deploy-local` | Deploy to Anvil | ❌ |
| `make deploy-testnet` | Deploy to Base Sepolia | ✅ |
| `make deploy-mainnet` | Deploy to Base | ✅ |
| `make format` | Format code | ❌ |
| `make clean` | Clean artifacts | ❌ |

---

## Additional Resources

- **Foundry Book:** https://book.getfoundry.sh/
- **Makefile Tutorial:** https://makefiletutorial.com/
- **Base Docs:** https://docs.base.org/