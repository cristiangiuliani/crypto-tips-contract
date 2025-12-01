# crypto-tips-contract

A decentralized tipping application built with Solidity smart contracts and React frontend.

## Setup

### Prerequisites
- Node.js & Yarn
- Foundry (for smart contracts)

### Installation

1. **Backend (Smart Contracts)**
   ```bash
   cd contracts
   make install
   ```

2. **Frontend**
   ```bash
   cd frontend
   yarn install
   ```

## Development

### Start Anvil (Local Blockchain)
```bash
cd contracts
make anvil
```

### Deploy Contract
```bash
cd contracts
make deploy-local-tipjar
```

The contract will be deployed to: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### Start Frontend
```bash
cd frontend
yarn vite
```

### Connect Wallet

Import one of Anvil's test accounts into your wallet:

**Account #0** (used for deployment):
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Account #1** (recommended for testing):
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

Add Anvil network to your wallet:
- Network Name: `Anvil Local`
- RPC URL: `http://localhost:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`

## Troubleshooting

### Transactions Stuck in "Confirming..." State

**Problem**: When you send a tip, it gets stuck in "Confirming..." and never completes.

**Cause**: After restarting Anvil, the wallet's transaction nonce is out of sync with the blockchain. The wallet thinks it should send transaction #10, but Anvil restarted and expects transaction #0.

**Quick Solution** - Reset wallet nonce:

**For MetaMask:**
1. Click the three dots (⋮) → **Settings** → **Advanced**
2. Scroll down and click **Clear activity tab data**
3. Confirm and reconnect to the app

**For Rainbow (recommended approach):**

Rainbow doesn't reliably reset the nonce when removing/re-importing accounts. The best solution is to **alternate between 2-3 Anvil accounts**:

**Setup**: Import these 2 accounts in your wallet once:
- Account #0: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Account #1: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Usage**: Every time you restart Anvil, simply switch to the other account:
- Session 1: Use Account #0
- Restart Anvil → Switch to Account #1
- Restart Anvil → Switch back to Account #0
- Restart Anvil → Switch to Account #1
- ...and so on

This way you only need 2 accounts and can alternate between them indefinitely!

**Complete Restart** (if other solutions don't work):
1. Stop Anvil (Ctrl+C)
2. Clear your browser's localStorage for `localhost:5173`
3. Restart Anvil: `make anvil`
4. Redeploy contract: `make deploy-local-tipjar`
5. Reset wallet (see methods above)
6. Reconnect to the app

### How to Check if You Have a Nonce Issue

If you see this pattern in the Anvil terminal:
```
eth_getTransactionReceipt
eth_blockNumber
eth_getTransactionReceipt
eth_blockNumber
...
```
Repeating endlessly, you have a nonce mismatch.

### Important Notes

- **Every time you restart Anvil**, you must:
  1. Redeploy the contract: `make deploy-local-tipjar`
  2. Reset your wallet's nonce (disconnect/reconnect or clear activity)
- The contract address stays the same (`0x5FbDB2315678afecb367f032d93F642f64180aa3`) due to Anvil's deterministic addresses
- For development, consider keeping Anvil running and only redeploying when you change the contract code