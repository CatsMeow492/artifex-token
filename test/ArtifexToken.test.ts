import { expect } from "chai";
import { ethers } from "hardhat";

describe("ArtifexToken", function () {
  const TOTAL_SUPPLY_CAP = ethers.parseUnits("100000000", 18); // 100 million tokens
  const INITIAL_MINT = ethers.parseUnits("10000000", 18); // 10 million tokens
  let artifexToken: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const ArtifexTokenFactory = await ethers.getContractFactory("ArtifexToken");
    
    // Deploy directly without proxy
    artifexToken = await ArtifexTokenFactory.deploy(TOTAL_SUPPLY_CAP, owner.address);
    await artifexToken.waitForDeployment();
  });

  describe("Basic Token Functionality", function () {
    it("Should have correct name and symbol", async function () {
      expect(await artifexToken.name()).to.equal("Artifex");
      expect(await artifexToken.symbol()).to.equal("ARTX");
    });

    it("Should allow owner to mint tokens", async function () {
      await artifexToken.mint(owner.address, INITIAL_MINT);
      expect(await artifexToken.balanceOf(owner.address)).to.equal(INITIAL_MINT);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      await expect(
        artifexToken.connect(user1).mint(user1.address, INITIAL_MINT)
      ).to.be.reverted;
    });

    it("Should enforce the supply cap", async function () {
      // Try to mint more than the cap
      await expect(
        artifexToken.mint(owner.address, TOTAL_SUPPLY_CAP + 1n)
      ).to.be.revertedWithCustomError(artifexToken, "ERC20ExceededCap");
    });

    it("Should allow transfers between accounts", async function () {
      // Mint some tokens to owner
      await artifexToken.mint(owner.address, INITIAL_MINT);
      
      // Transfer to user1
      const transferAmount = ethers.parseUnits("1000", 18);
      await artifexToken.transfer(user1.address, transferAmount);
      
      expect(await artifexToken.balanceOf(user1.address)).to.equal(transferAmount);
    });
  });

  describe("Permit Functionality", function () {
    it("Should allow approval via permit", async function () {
      const deadline = ethers.MaxUint256;
      const value = ethers.parseUnits("1000", 18);
      
      // Generate permit signature
      const nonce = await artifexToken.nonces(owner.address);
      const chainId = (await ethers.provider.getNetwork()).chainId;
      
      const domain = {
        name: "Artifex",
        version: "1",
        chainId,
        verifyingContract: await artifexToken.getAddress()
      };
      
      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      };
      
      const valueToSign = {
        owner: owner.address,
        spender: user1.address,
        value,
        nonce,
        deadline
      };
      
      const signature = await owner.signTypedData(domain, types, valueToSign);
      const sig = ethers.Signature.from(signature);
      
      // Submit the permit transaction
      await artifexToken.permit(
        owner.address,
        user1.address,
        value,
        deadline,
        sig.v,
        sig.r,
        sig.s
      );
      
      // Check that approval was successful
      expect(await artifexToken.allowance(owner.address, user1.address)).to.equal(value);
    });
  });

  describe("Ownership Functionality", function () {
    it("Should have the correct owner", async function () {
      expect(await artifexToken.owner()).to.equal(owner.address);
    });
    
    it("Should allow two-step ownership transfer", async function () {
      // Start ownership transfer
      await artifexToken.transferOwnership(user1.address);
      
      // User1 accepts ownership
      await artifexToken.connect(user1).acceptOwnership();
      
      // Verify ownership was transferred
      expect(await artifexToken.owner()).to.equal(user1.address);
    });
  });
}); 