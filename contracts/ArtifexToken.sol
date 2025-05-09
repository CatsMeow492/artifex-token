// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import { ERC20Capped } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract ArtifexToken is ERC20, ERC20Permit, ERC20Capped, UUPSUpgradeable, Ownable2Step {
    constructor(uint256 cap, address initialOwner)
        ERC20("Artifex", "ARTX")
        ERC20Permit("Artifex")
        ERC20Capped(cap)
        Ownable(initialOwner)
    {}

    /**
     * @dev Mint new tokens
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}
    
    // Override _update to satisfy the ERC20Capped requirement (needed due to multiple inheritance)
    function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Capped) {
        super._update(from, to, amount);
    }
} 