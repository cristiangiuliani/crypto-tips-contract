# Load .env file
include .env
export

# Colors for output
GREEN := \033[0;32m
NC := \033[0m # No Color

# Parameters
CONTRACT_NAME=Test

.PHONY: help build test clean deploy-local deploy-testnet deploy-mainnet verify

# Default target
help:
	@echo "$(GREEN)Available commands:$(NC)"
	@echo "  make build                    - Compile contracts"
	@echo "  make test                     - Run tests"
	@echo "  make test-v                   - Run tests with verbose output"
	@echo "  make test-gas                 - Run tests with gas report"
	@echo "  make clean                    - Clean build artifacts"
	@echo "  make anvil                    - Start local blockchain"
	@echo ""
	@echo "$(GREEN)Deploy commands:$(NC)"
	@echo "  make deploy-local                  - Deploy TipJar to Anvil (default)"
	@echo "  make deploy-local-tipjar           - Deploy TipJar to Anvil"
	@echo "  make deploy-local-test STRING='X'  - Deploy Test to Anvil with string"
	@echo "  make deploy-testnet                - Deploy to Base Sepolia"
	@echo "  make deploy-mainnet                - Deploy to Base mainnet"
	@echo "  make verify                        - Verify contract on Basescan"

# Build
build:
	@echo "$(GREEN)Compiling contracts...$(NC)"
	forge build

# Test commands
test:
	@echo "$(GREEN)Running tests...$(NC)"
	forge test

test-v:
	@echo "$(GREEN)Running tests (verbose)...$(NC)"
	forge test -vvv

test-gas:
	@echo "$(GREEN)Running tests with gas report...$(NC)"
	forge test --gas-report

test-watch:
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	forge test --watch

# Clean
clean:
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	forge clean

# Anvil
TTL=5
anvil:
	@echo "$(GREEN)Starting Anvil (local blockchain)...$(NC)"
	anvil --block-time $(TTL)

# Deploy to local Anvil
deploy-local:
	@echo "$(GREEN)Deploying TipJar to Anvil...$(NC)"
	forge script script/Deploy.s.sol \
		--rpc-url http://localhost:8545 \
		--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
		--broadcast

# Deploy TipJar to local
deploy-local-tipjar:
	@echo "$(GREEN)Deploying TipJar to Anvil...$(NC)"
	forge script script/Deploy.s.sol \
		--rpc-url http://localhost:8545 \
		--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
		--broadcast

# Deploy Test to local
# Usage: make deploy-local-test STRING="Hello World"
deploy-local-test:
	@echo "$(GREEN)Deploying Test to Anvil...$(NC)"
	INITIAL_STRING="$(STRING)" forge script script/DeployTest.s.sol \
		--rpc-url http://localhost:8545 \
		--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
		--broadcast

# Deploy to Sepolia testnet
deploy-sepolia:
	@echo "$(GREEN)Deploying to Ethereum Sepolia...$(NC)"
	forge script script/Deploy.s.sol \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY)

# Deploy to Base Sepolia testnet
deploy-testnet:
	@echo "$(GREEN)Deploying to Base Sepolia...$(NC)"
	forge script script/Deploy.s.sol \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY)

# Deploy to Base mainnet
deploy-mainnet:
	@echo "$(GREEN)⚠️  DEPLOYING TO MAINNET ⚠️$(NC)"
	@echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
	@sleep 5
	forge script script/Deploy.s.sol \
		--rpc-url $(BASE_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY)

# Verify contract (if deploy didn't auto-verify)
verify:
	@echo "$(GREEN)Verifying contract...$(NC)"
	@echo "Usage: make verify ADDRESS=0x... CONTRACT=TipJar"
	forge verify-contract $(ADDRESS) src/TipJar.sol:$(CONTRACT) \
		--chain-id 84532 \
		--etherscan-api-key $(ETHERSCAN_API_KEY)

# Format code
format:
	@echo "$(GREEN)Formatting Solidity files...$(NC)"
	forge fmt

# Flatten contract (for manual verification)
flatten:
	@echo "$(GREEN)Flattening TipJar.sol...$(NC)"
	forge flatten src/TipJar.sol > TipJar-flattened.sol

# Install dependencies
install:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	forge install

# Update dependencies
update:
	@echo "$(GREEN)Updating dependencies...$(NC)"
	forge update

# Coverage
coverage:
	@echo "$(GREEN)Generating test coverage...$(NC)"
	forge coverage

generate-mock:
	@echo "$(GREEN)Generating mock for $(CONTRACT_NAME)...$(NC)"
	@mkdir -p ../frontend/src/__mocks__
	@if [ "$(CONTRACT_NAME)" = "TipJar" ]; then \
		cat out/TipsJar.sol/TipJar.json | jq '.abi' > ../frontend/src/__mocks__/TipJar.json; \
	else \
		cat out/$(CONTRACT_NAME).sol/$(CONTRACT_NAME).json | jq '.abi' > ../frontend/src/__mocks__/$(CONTRACT_NAME).json; \
	fi
	@echo "$(GREEN)ABI saved to ../frontend/src/__mocks__/$(CONTRACT_NAME).json$(NC)"

# Shortcut per generare mock di TipJar
generate-mock-tipjar:
	@$(MAKE) generate-mock CONTRACT_NAME=TipJar

# Shortcut per generare mock di Counter
generate-mock-counter:
	@$(MAKE) generate-mock CONTRACT_NAME=Counter

# Shortcut per generare mock di Test
generate-mock-test:
	@$(MAKE) generate-mock CONTRACT_NAME=Test