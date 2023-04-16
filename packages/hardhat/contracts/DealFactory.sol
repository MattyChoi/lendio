// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BondManager.sol";
import "./Deal.sol";

/// @title A factory for Deal contracts
/// @author Matthew Choi, Brian Eide, Zachary Mabie, Timothy Tu
/// @notice This contract is responsible for creating and managing Deal contracts for bond offerings.
contract DealFactory {
    mapping(address => uint256) public bonds; // address -> token ID
    address[] public deals;
    uint256 public length;

    address public immutable manager;

    event LaunchDeal(
        address dealContract,
        address denom,
        uint256 principal,
        uint256 coupon,
        uint256 maturity,
        uint256 supply
    );

    /// @notice Initializes the DealFactory contract by creating a new BondManager instance.
    constructor() {
        manager = address(new BondManager());
    }

    modifier onlyDeal() {
        require(bonds[msg.sender] > 0);
        _;
    }

    /// @notice Launches a new Deal contract for a bond offering.
    /// @param _denom The address of the ERC20 token used as the denomination for the bond offering.
    /// @param _principal The principal amount per bond.
    /// @param _coupon The coupon rate (as a whole number) for the bond offering.
    /// @param _maturity The maturity date (as a timestamp) of the bond offering.
    /// @param _supply The total number of bonds to be issued in the offering.
    function launchDeal(
        address _denom, 
        uint256 _principal, 
        uint256 _coupon, 
        uint256 _maturity, 
        uint256 _supply
    ) external {
        address deal = address(
            new Deal(address(this), manager, _denom, _principal, _coupon, _maturity, _supply, msg.sender)
        );
        uint256 tokenID = BondManager(manager).mint(deal, _supply);
        bonds[deal] = tokenID;
        deals.push(deal);
        length += 1;
        emit LaunchDeal(deal, _denom, _principal, _coupon, _maturity, _supply);
    }

    /// @notice Transfers the bond tokens from the Deal contract to a specified address.
    /// @param to The address to receive the bond tokens.
    /// @param amount The number of bond tokens to transfer.
    function releaseBond(address to, uint256 amount) external onlyDeal {
        BondManager(manager).safeTransferFrom(msg.sender, to, bonds[msg.sender], amount, "");
    }
}
