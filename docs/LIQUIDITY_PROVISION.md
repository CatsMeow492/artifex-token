# Artifex Token Liquidity Provision Strategy

This document outlines the strategy for providing liquidity for the Artifex (ARTX) token on Uniswap V3 on Arbitrum One.

## Initial Liquidity Pool

### Pool Parameters

- **Token Pairs**: ARTX-ETH and ARTX-USDC
- **Initial Depth**:
  - ARTX-ETH: $100,000 worth of each token
  - ARTX-USDC: $100,000 worth of each token
- **Fee Tier**: 0.3% (medium volatility)
- **Concentration Range**: 
  - ARTX-ETH: Initial price ±30%
  - ARTX-USDC: Initial price ±20%

### Implementation Plan

1. **Deployment Timing**: Liquidity will be added within 24 hours of token deployment on mainnet
2. **Wallet Security**: Liquidity will be provided from a multisig wallet (3/5 signers required)
3. **LP Token Management**: LP tokens will be held by the project's treasury multisig wallet

## Long-term Liquidity Strategy

### Incentives and Management

- **LP Incentives**: 2% of the total token supply will be allocated for liquidity mining rewards
- **Reward Duration**: LP incentives will be distributed over 12 months
- **Rebalancing**: The position will be actively managed and rebalanced monthly to optimize capital efficiency

### Risk Management

- **Slippage Protection**: Large trades will be executed via a custom router to minimize price impact
- **Price Monitoring**: Implement price monitoring to detect manipulation attempts
- **Insurance Fund**: 0.5% of the total token supply will be reserved as an insurance fund

## Technical Implementation

### Smart Contracts

The following Uniswap V3 interfaces will be used for liquidity provision:

```solidity
// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.24;

interface IUniswapV3Factory {
    function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool);
}

interface IUniswapV3Pool {
    function initialize(uint160 sqrtPriceX96) external;
}

interface INonfungiblePositionManager {
    function createAndInitializePoolIfNecessary(
        address token0,
        address token1,
        uint24 fee,
        uint160 sqrtPriceX96
    ) external returns (address pool);
    
    function mint(MintParams calldata params) external returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);
    
    struct MintParams {
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        address recipient;
        uint256 deadline;
    }
}
```

### Implementation Script

A dedicated script will be created to handle liquidity provision, which will:

1. Approve tokens for the position manager
2. Calculate optimal tick ranges based on current price
3. Create and initialize the pool if necessary
4. Add concentrated liquidity in the chosen range

## Monitoring

The following metrics will be tracked:

- **TVL**: Total value locked in the liquidity pools
- **Depth**: Order book depth at ±1%, 5%, and 10% from the current price
- **Trading Volume**: 24h volume across all pools
- **Fee Generation**: Fees earned by liquidity providers

## Timeline

1. **T+0**: Token deployment
2. **T+1**: Initial liquidity provision
3. **T+7**: Launch of liquidity mining program
4. **Monthly**: Position rebalancing as needed
5. **Quarterly**: Comprehensive review of liquidity strategy 