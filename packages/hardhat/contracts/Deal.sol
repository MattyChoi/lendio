// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BondManager.sol";
import "./DealFactory.sol";

/// @title A contract managing the sale and operations of a single bond deal
/// @author Matthew Choi, Brian Eide, Zachary Mabie, Timothy Tu
contract Deal is ERC1155Holder {

    // Deal constants
    address public denom;
    uint256 public principal;
    uint256 public coupon;
    uint256 public maturity;
    uint256 public supply;
    uint256 public amtLeft;
    address public admin;
    address private dealFactory;
    address private bondManager;
    uint256 public repaymentAmt;

    // Instance data
    mapping(address => uint256) public creditors; // address to number of bonds each creditor wants to buy
    uint256 public status = 0; // 0 pending, 1 executed, 2 for canceled

    constructor(
        address _dealFactory, // address of DealFactory contract
        address _bondManager, // address of BondManager contract
        address _denom, // currency token address
        uint256 _principal,
        uint256 _coupon, // interest rate (whole number)
        uint256 _maturity, // maturity timestamp
        uint256 _supply, // amount of bonds to issue
        address _admin // admin of deal
    ) {
        require(_principal > 0, "Price should be greater than 0");
        require(_supply > 0, "Supply must be greater than 0");
        denom = _denom;
        principal = _principal;
        coupon = _coupon;
        maturity = _maturity;
        supply = _supply;
        amtLeft = _supply;
        admin = _admin;
        dealFactory = _dealFactory;
        bondManager = _bondManager;
        repaymentAmt = _principal * (100 + _coupon); // repayment * 100
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Must be admin to call this function.");
        _;
    }

    modifier onlyStatus(uint256 _status) {
        require(status == _status);
        _;
    }

    // PRE-SALE FUNCTIONS (status=0)

    // how many bond tokens the creditor wants to buy
    function deposit(uint256 numBonds) external onlyStatus(0) {
        require(numBonds <= amtLeft, "There are not enough bonds left");
        ERC20 token = ERC20(denom);
        token.transferFrom(msg.sender, address(this), numBonds * principal * 10 ** token.decimals());
        amtLeft -= numBonds;
        creditors[msg.sender] += numBonds;
    }

    // execute the deal when the supply is zero
    function execute() external onlyAdmin onlyStatus(0) {
        require(amtLeft == 0, "Deal cannot execute because amount left is not 0");
        status = 1;
    }

    function cancel() external onlyAdmin onlyStatus(0) {
        status = 2;
    }

    // POST-SALE FUNCTIONS (status=1)

    function collectBond() external onlyStatus(1) {
        // Get the bond
        require(creditors[msg.sender] > 0, "No bonds to collect");
        DealFactory(dealFactory).releaseBond(msg.sender, creditors[msg.sender]);
        creditors[msg.sender] = 0;
    }

    function redeemBond() external onlyStatus(1) {
        // Get interest payment
        require(block.timestamp >= maturity, "The bond has not matured yet");
        ERC20 token = ERC20(denom);
        // the repayment amount is shifted to the left 2 places. send repaymentAmt * 10 ^ (decimals - 2)
        require(
            token.balanceOf(address(this)) == repaymentAmt * 10 ** (token.decimals() - 2),
            "The deal contract has not yet been funded"
        );
        DealFactory(dealFactory).redeemBond(
            msg.sender, 
            principal * (100 + coupon) * 10 ** (token.decimals() - 2), 
            creditors[msg.sender]
        );
    }

    // CANCELED FUNCTIONS (status=2)

    // Move deposited cash back to creditor
    function withdraw() external onlyStatus(2) {
        ERC20 token = ERC20(denom);
        token.transfer(msg.sender, creditors[msg.sender] * principal * 10 ** token.decimals());
        creditors[msg.sender] = 0;
    }
}
