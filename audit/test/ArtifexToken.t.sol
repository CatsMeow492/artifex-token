// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ArtifexToken} from "../src/ArtifexToken.sol";

contract ArtifexTokenTest is Test {
    ArtifexToken public token;
    address public owner;
    address public user1;
    address public user2;
    
    uint256 public constant TOTAL_SUPPLY_CAP = 100_000_000 ether; // 100 million tokens
    uint256 public constant INITIAL_MINT = 10_000_000 ether; // 10 million tokens

    function setUp() public {
        // Set up the accounts
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        // Deploy the token
        token = new ArtifexToken(TOTAL_SUPPLY_CAP, owner);
    }

    function test_TokenMetadata() public {
        assertEq(token.name(), "Artifex");
        assertEq(token.symbol(), "ARTX");
        assertEq(token.decimals(), 18);
    }

    function test_Minting() public {
        // Mint tokens to the owner
        token.mint(owner, INITIAL_MINT);
        assertEq(token.balanceOf(owner), INITIAL_MINT);
    }

    function test_MintingNotOwner() public {
        // Try to mint as user1 (should fail)
        vm.prank(user1);
        vm.expectRevert();
        token.mint(user1, INITIAL_MINT);
    }

    function test_SupplyCap() public {
        // Try to mint more than the cap (should fail)
        vm.expectRevert();
        token.mint(owner, TOTAL_SUPPLY_CAP + 1);
    }

    function test_Transfer() public {
        // Mint tokens to the owner
        token.mint(owner, INITIAL_MINT);
        
        // Transfer to user1
        uint256 transferAmount = 1000 ether;
        token.transfer(user1, transferAmount);
        
        // Verify balances
        assertEq(token.balanceOf(user1), transferAmount);
        assertEq(token.balanceOf(owner), INITIAL_MINT - transferAmount);
    }

    function test_Permit() public {
        // Prepare permit parameters
        uint256 privateKey = 0x01;
        address signer = vm.addr(privateKey);
        address spender = user1;
        uint256 value = 1000 ether;
        uint256 deadline = block.timestamp + 1 days;
        uint256 nonce = token.nonces(signer);
        
        // Create permit signature
        bytes32 domainSeparator = token.DOMAIN_SEPARATOR();
        bytes32 permitHash = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainSeparator,
                keccak256(
                    abi.encode(
                        keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                        signer,
                        spender,
                        value,
                        nonce,
                        deadline
                    )
                )
            )
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, permitHash);
        
        // Call permit
        token.permit(signer, spender, value, deadline, v, r, s);
        
        // Check allowance
        assertEq(token.allowance(signer, spender), value);
    }

    function test_OwnershipFunctionality() public {
        // Test that the owner is set correctly
        assertEq(token.owner(), owner);
        
        // Test ownership transfer
        token.transferOwnership(user1);
        
        // Need to accept the ownership
        vm.prank(user1);
        token.acceptOwnership();
        
        assertEq(token.owner(), user1);
    }

    // Fuzz test for transfers
    function testFuzz_Transfer(address recipient, uint256 amount) public {
        // Skip invalid cases
        vm.assume(recipient != address(0));
        amount = bound(amount, 1, INITIAL_MINT);
        
        // Mint tokens to the owner
        token.mint(owner, INITIAL_MINT);
        
        // Transfer to recipient
        token.transfer(recipient, amount);
        
        // Verify balances
        assertEq(token.balanceOf(recipient), amount);
        assertEq(token.balanceOf(owner), INITIAL_MINT - amount);
    }
} 