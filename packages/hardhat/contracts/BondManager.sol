// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @title A manager for the ERC-1155 bond tokens
/// @author Matthew Choi, Brian Eide, Zachary Mabie, Timothy Tu
/// @notice Used by a Deal contract to mint, transfer, and burn bonds. Users can use this contract to transfer bonds.
contract BondManager is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    uint256 private _currentID;

    /// @notice Constructor for the BondManager contract
    /// @dev Initializes the ERC1155 contract with an empty URI
    constructor() ERC1155("") {}

    /// @notice Mints new bond tokens and assigns them to the specified account
    /// @dev Can only be called by the owner of the contract
    /// @param account The address that will receive the newly minted bond tokens
    /// @param amount The number of bond tokens to mint
    /// @return The ID of the newly minted bond tokens
    function mint(address account, uint256 amount) public onlyOwner returns (uint256) {
        _currentID += 1;
        _mint(account, _currentID, amount, "");
        return _currentID; // We do not want an ID of 0
    }

    // Override required by Solidity
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
