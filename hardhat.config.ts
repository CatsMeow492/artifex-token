import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-viem";
import * as dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : 'env.txt' });

const DEPLOYER_KEY = process.env.DEPLOYER_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    arbitrum: {
      url: process.env.L2_RPC || "https://arb1.arbitrum.io/rpc",
      accounts: [DEPLOYER_KEY],
      chainId: 42161,
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [DEPLOYER_KEY],
      chainId: 421614,
    },
  },
  etherscan: {
    apiKey: {
      arbitrum: ETHERSCAN_KEY,
      arbitrumSepolia: ETHERSCAN_KEY,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
