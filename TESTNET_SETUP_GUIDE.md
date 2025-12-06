# Sepolia Testnet Integration - Complete Setup Guide

## Overview
Step-by-step guide to configure Ethereum Sepolia testnet for a smart contract project, from account setup to deployment.

---

## 1. Alchemy Setup

### Create Account & Project
1. Go to [https://www.alchemy.com/](https://www.alchemy.com/)
2. Sign up for a free account
3. Click **"Create new app"**
4. Configure:
   - **Chain**: Ethereum
   - **Network**: Sepolia
   - **Name**: Your project name (e.g., "TipsJar")
5. Click on your app and copy the **API Key** or full **HTTPS URL**
   - URL format: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

---

## 2. Etherscan API Key

### Get API Key for Contract Verification
1. Go to [https://etherscan.io/](https://etherscan.io/)
2. Create account and login
3. Navigate to **My Account** → **API-KEYs**
4. Click **"+ Add"** to create new API key
5. Give it a name (e.g., "TipsJar")
6. Copy the API key

**Note**: This same API key works for:
- Etherscan (Ethereum)
- Basescan (Base)
- All Etherscan-family explorers

---

## 3. MetaMask Configuration

### Add Sepolia Network
**Option A - Automatic (Recommended):**
1. Go to [https://chainlist.org/chain/11155111](https://chainlist.org/chain/11155111)
2. Connect MetaMask
3. Click **"Add to MetaMask"**
4. Approve in MetaMask

**Option B - Manual:**
1. Open MetaMask
2. Click network dropdown at top
3. Click **"Add network"**
4. Click **"Add network manually"**
5. Enter:
   - **Network Name**: `Sepolia test network`
   - **RPC URL**: `https://sepolia.infura.io/v3/` or `https://rpc.sepolia.org`
   - **Chain ID**: `11155111`
   - **Currency Symbol**: `ETH`
   - **Block Explorer**: `https://sepolia.etherscan.io`
6. Click **"Save"**

### Get Private Key
1. Open MetaMask
2. Click three dots (⋮) in top right
3. Select **"Account details"**
4. Click **"Show private key"**
5. Enter your MetaMask password
6. Copy the private key (starts with `0x`)

⚠️ **Security Warning**: Use a test wallet, never your main wallet with real funds!

---

## 4. Get Sepolia Test ETH

### Faucet Options

**Recommended Faucet:**
- [https://sepolia-faucet.pk910.de/](https://sepolia-faucet.pk910.de/)
- Mining-based, no requirements

**Alternative Faucets:**
- [https://sepoliafaucet.com/](https://sepoliafaucet.com/) (Alchemy)
- [https://www.infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)
- [https://faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)

**Steps:**
1. Switch MetaMask to Sepolia network
2. Copy your wallet address
3. Go to faucet website
4. Enter your address
5. Complete captcha/requirements
6. Wait 1-2 minutes
7. Check balance in MetaMask

---

## 5. Backend Configuration (Foundry)

### Project Structure
```
your-project/
├── contracts/           # Foundry backend
│   ├── .env            # Backend environment variables
│   ├── foundry.toml
│   ├── Makefile
│   └── src/
└── frontend/           # React frontend
    ├── .env            # Frontend environment variables
    └── src/
```

### Backend `.env` File
Create `.env` in **contracts folder**:

```bash
# Alchemy RPC endpoint
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# MetaMask wallet private key
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_FROM_METAMASK

# Etherscan API key for verification
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### Makefile Configuration
Add to `Makefile` in contracts folder:

```makefile
deploy-sepolia:
	@echo "Deploying to Ethereum Sepolia..."
	forge script script/Deploy.s.sol \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY)
```

### `.gitignore`
Ensure `.env` is in `.gitignore`:

```
.env
```

### Deploy Contract
```bash
cd contracts
make deploy-sepolia
```

**Save the output**: Copy the deployed contract address!

Example output:
```
✅ Contract deployed at: 0x7f64D028e82D3a8Ea30358857ad1927a4adb8864
Transaction hash: 0x...
```

---

## 6. Frontend Configuration (React/Vite)

### Frontend `.env` File
Create `.env` in **frontend folder**:

```bash
# Note: Vite requires VITE_ prefix for environment variables
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
```

⚠️ **Important**: Variables must start with `VITE_` for Vite to expose them!

### RainbowKit/Wagmi Configuration
In your main config file (e.g., `main.tsx` or `App.tsx`):

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'viem';

const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL;

const config = getDefaultConfig({
  appName: 'YourApp',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [sepolia],
  transports: {
    // Option 1: Public RPC (no rate limits for testnets)
    [sepolia.id]: http(),
    
    // Option 2: Your Alchemy endpoint (free tier has 10-block limit for eth_getLogs)
    // [sepolia.id]: http(SEPOLIA_RPC_URL),
  },
});
```

**Recommendation**: Use `http()` without URL for public RPC to avoid Alchemy free tier limitations.

### Contract Address Configuration
```typescript
// Single network
export const SEPOLIA_CONTRACT_ADDRESS = "0x7f64D028e82D3a8Ea30358857ad1927a4adb8864";

// Or multi-network (recommended)
const CONTRACT_ADDRESSES = {
  31337: "0xYOUR_ANVIL_ADDRESS",      // Local development
  11155111: "0x7f64D028e82D3a8Ea30358857ad1927a4adb8864", // Sepolia
};

export const CONTRACT_CONFIG = {
  abi: YOUR_CONTRACT_ABI,
  address: CONTRACT_ADDRESSES[11155111],
  chainId: 11155111,
} as const;
```

### Restart Development Server
After adding `.env` variables:

```bash
npm run dev
```

---

## 7. Testing the Integration

### Pre-flight Checklist
- [ ] MetaMask connected to Sepolia network
- [ ] Wallet has Sepolia ETH (> 0.01 ETH)
- [ ] Contract deployed and verified
- [ ] Contract address updated in frontend
- [ ] Both `.env` files configured
- [ ] Development server restarted

### Test Flow
1. Open your application in browser
2. Click "Connect Wallet" (RainbowKit)
3. Select MetaMask
4. Ensure MetaMask is on Sepolia network
5. Approve connection
6. Send a test transaction
7. Wait for confirmation (~12 seconds)
8. Verify on Etherscan: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`

---

## 8. Verification & Troubleshooting

### Verify Contract Exists
```bash
cast code YOUR_CONTRACT_ADDRESS --rpc-url $SEPOLIA_RPC_URL
```
- If returns `0x` → Contract not deployed
- If returns long hex → Contract exists ✅

### Check Contract on Etherscan
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

Should show:
- Contract bytecode
- Verified source code (green checkmark)
- Transaction history

### Common Issues

**"Insufficient funds"**
- Solution: Get more ETH from faucet

**"Invalid API Key"**
- Solution: Check `.env` files, verify keys are correct

**"Failed to decode private key"**
- Solution: Ensure private key starts with `0x` and is 66 characters

**"POST 127.0.0.1:8545 ERR_CONNECTION_REFUSED"**
- Solution: Frontend still pointing to Anvil, update config to use Sepolia

**"400 Bad Request" from Alchemy**
- Solution: Use public RPC `http()` or reduce block range in queries

**Contract not found**
- Solution: Verify contract address is correct, check it's deployed on Sepolia

**MetaMask transactions not confirming**
- Solution: Check you're on Sepolia network, have enough ETH for gas

---

## 9. Important Notes

### Chain IDs Reference
- **Anvil (local)**: 31337
- **Ethereum Sepolia**: 11155111
- **Base Sepolia**: 84532
- **Ethereum Mainnet**: 1

### Internal vs External Transactions
- **External**: Wallet → Contract (visible in MetaMask)
- **Internal**: Contract → Address (only on Etherscan, not in MetaMask)
- Both types transfer funds correctly

### Alchemy Free Tier Limitations
- `eth_getLogs` limited to 10 blocks per request
- Workaround: Use public RPC or query recent blocks only

### Security Best Practices
- Never commit `.env` files to Git
- Use test wallets only (separate from mainnet funds)
- Never share private keys
- Keep API keys confidential

---

## 10. Quick Reference

### Essential URLs
- **Alchemy Dashboard**: https://dashboard.alchemy.com
- **Etherscan API**: https://etherscan.io/myapikey
- **Sepolia Explorer**: https://sepolia.etherscan.io
- **Chainlist**: https://chainlist.org
- **Sepolia Faucet**: https://sepolia-faucet.pk910.de/

### Key Commands
```bash
# Deploy contract
make deploy-sepolia

# Verify contract code
cast code ADDRESS --rpc-url $SEPOLIA_RPC_URL

# Check environment variables
echo $SEPOLIA_RPC_URL
echo $PRIVATE_KEY
```

### Network Details
- **Network**: Ethereum Sepolia
- **Chain ID**: 11155111
- **Block Time**: ~12 seconds
- **Currency**: SepoliaETH (test ETH, no real value)
- **Explorer**: https://sepolia.etherscan.io