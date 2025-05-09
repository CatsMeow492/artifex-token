# Artifex (ARTX) Token

Artifex (ARTX) is an ERC-20 token deployed on Arbitrum One. This repository contains the smart contract implementation, testing framework, and deployment scripts.

## Features

- **ERC-20 Compliant**: Standard fungible token interface
- **ERC-20 Permit (EIP-2612)**: Gas-less approval mechanism
- **Fixed Supply Cap**: 100 million tokens maximum
- **Upgradeability**: UUPS proxy pattern for future upgrades
- **Ownable2Step**: Secure two-step ownership transfer

## Smart Contract Architecture

The token inherits from multiple OpenZeppelin contracts to implement its features:
- `ERC20`: Base token functionality
- `ERC20Permit`: Gas-less approvals
- `ERC20Capped`: Fixed maximum supply
- `UUPSUpgradeable`: Upgrade pattern
- `Ownable2Step`: Secure ownership management

## Development Environment

This project uses a dual framework approach:
- **Hardhat**: For deployment and TypeScript testing
- **Foundry**: For fuzz testing and formal verification

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Foundry (forge, cast, anvil)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/artifex-token.git
cd artifex-token

# Install dependencies
pnpm install

# Set up environment variables (copy env.txt to .env and fill in your keys)
cp env.txt .env
```

### Testing

```bash
# Run Hardhat tests
pnpm test

# Run Foundry tests
cd audit && forge test -vvv

# Run linters
pnpm lint
pnpm solhint

# Run Slither static analysis
pnpm slither
```

### Deployment

```bash
# Dry run deployment to Arbitrum Sepolia (testnet)
pnpm run deploy:sepolia:dry

# Deploy to Arbitrum Sepolia (testnet)
pnpm run deploy:sepolia

# Dry run deployment to Arbitrum One (mainnet)
pnpm run deploy:mainnet:dry

# Deploy to Arbitrum One (mainnet)
pnpm run deploy:mainnet

# Verify contract on Arbiscan
pnpm run verify <CONTRACT_ADDRESS> --network arbitrum
```

## Security

This project aims for high security standards:
- Comprehensive test coverage
- Static analysis via Slither
- Fuzz testing via Foundry
- Solidity and TypeScript linting
- External audit (TBD)

See [AUDIT_CHECKLIST.md](docs/AUDIT_CHECKLIST.md) for security considerations.

## Liquidity Provision

The token will be launched with liquidity on Uniswap V3. See [LIQUIDITY_PROVISION.md](docs/LIQUIDITY_PROVISION.md) for details on the liquidity strategy.

## Token Economics

- **Total Supply Cap**: 100,000,000 ARTX
- **Initial Distribution**: 10% at launch, remainder to be allocated according to tokenomics plan
- **Decimal Places**: 18

## License

MIT

## Contact

For inquiries, please open an issue in this repository.
