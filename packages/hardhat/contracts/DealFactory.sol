// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BondManager.sol";
import "./Deal.sol";

contract DealFactory {
    Deal[] public deals;

    address public immutable manager;

    event LaunchDeal(address dealContract, address denom, uint256 principal, uint256 coupon, uint256 maturity, uint256 supply);

    constructor() {
        manager = address(new BondManager());
    }

    function launchDeal(
        address _denom,
        uint256 _principal,
        uint256 _coupon,
        uint256 _maturity,
        uint256 _supply
    ) external {
        Deal deal = new Deal(manager, _denom, _principal, _coupon, _maturity, _supply, msg.sender);
        deals.push(deal);
        emit LaunchDeal(address(deal), _denom, _principal, _coupon, _maturity, _supply);
    }
}
