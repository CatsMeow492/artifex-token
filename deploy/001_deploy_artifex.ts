import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Define token supply cap (100 million tokens with 18 decimals)
  const totalSupplyCap = ethers.parseUnits("100000000", 18);

  // Deploy the token contract
  const ArtifexToken = await ethers.getContractFactory("ArtifexToken");
  console.log("Deploying ArtifexToken...");
  
  // Choose deployment method based on environment variable or argument
  // For this example, we'll use direct deployment by default
  const useProxy = process.env.USE_PROXY === "true";
  let artifexToken;
  
  if (useProxy) {
    // Deploy via UUPS proxy
    console.log("Using UUPS proxy deployment...");
    try {
      artifexToken = await upgrades.deployProxy(
        ArtifexToken,
        [], // No constructor arguments for initializer
        { 
          kind: "uups",
          constructorArgs: [totalSupplyCap, deployer.address], // Constructor arguments
          initializer: false // No initializer function
        }
      );
    } catch (error) {
      console.error("Proxy deployment failed:", error);
      console.log("Falling back to direct deployment...");
      
      // Fallback to direct deployment
      artifexToken = await ArtifexToken.deploy(totalSupplyCap, deployer.address);
    }
  } else {
    // Direct deployment
    console.log("Using direct deployment...");
    artifexToken = await ArtifexToken.deploy(totalSupplyCap, deployer.address);
  }

  await artifexToken.waitForDeployment();
  const artifexTokenAddress = await artifexToken.getAddress();
  
  console.log("ArtifexToken deployed to:", artifexTokenAddress);
  
  // Optional: Mint initial supply to deployer (e.g., 10% of cap)
  const initialMint = totalSupplyCap / 10n;
  console.log(`Minting initial supply of ${ethers.formatUnits(initialMint, 18)} ARTX tokens...`);
  
  try {
    const mintTx = await artifexToken.mint(deployer.address, initialMint);
    await mintTx.wait();
    console.log("Initial supply minted successfully");
  } catch (error) {
    console.error("Failed to mint initial supply:", error);
  }

  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 