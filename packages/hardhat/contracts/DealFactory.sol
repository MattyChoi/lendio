// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BondManager.sol";
import "./Deal.sol";

/// @title A factory for Deal contracts
/// @author Matthew Choi, Brian Eide, Zachary Mabie, Timothy Tu
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

    constructor() {
        manager = address(new BondManager());
    }

    modifier onlyDeal() {
        require(bonds[msg.sender] > 0);
        _;
    }

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

    function releaseBond(address to, uint256 amount) external onlyDeal {
        BondManager(manager).safeTransferFrom(msg.sender, to, bonds[msg.sender], amount, "");
    }

    // function redeemBond(address _account, uint256 _amountPer, uint256 _uncollected) external onlyDeal {
    //     uint256 amount = BondManager(manager).balanceOf(_account, bonds[msg.sender]) + _uncollected;
    //     BondManager(manager).burn(_account, bonds[msg.sender], amount);
    //     ERC20 token = ERC20(Deal(msg.sender).denom());
    //     // transfer USD from contract to sender
    //     token.transferFrom(msg.sender, _account, amount * _amountPer);
    // }
}
