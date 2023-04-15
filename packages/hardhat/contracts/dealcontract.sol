// create factory contract

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./bondtoken.sol";

// create a contract for each deal issued by a DAO
contract Deal is ERC1155Holder {
    mapping(address => uint256) public creditors; // address to number of bonds each creditor wants to buy
    address public denom;
    ERC20 private token;
    uint256 public principal;
    uint256 private coupon;
    uint256 private maturity;
    uint256 private supply;
    uint256 private amtLeft;
    address public admin;
    BondManager private bondManager;
    uint256 private status = 0; // 0 pending, 1 executed, 2 for canceled
    uint256 private id;
    uint256 private repaymentAmt;

    constructor(
        address _denom, // currency token address
        address _bondManager, // address of ERC1155 contract
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
        bondManager = BondManager(_bondManager);
        token = ERC20(denom);
        repaymentAmt = _principal * (100 + _coupon); // repayment * 100
    }

    // how many bond tokens the creditor wants to buy
    function deposit(uint256 numBonds) external {
        require(numBonds <= amtLeft, "There are not enough bonds left");
        require(status == 0, "The deal must be pending in order to deposit");
        token.transferFrom(
            msg.sender,
            address(this),
            numBonds * principal * 10 ** token.decimals()
        );
        amtLeft -= numBonds;
        creditors[msg.sender] += numBonds;
    }

    // how many bond tokens the creditor wants to refund
    function withdraw() external {
        require(
            status == 2,
            "The deal has not been canceled. Cannot withdraw."
        );
        token.transfer(
            msg.sender,
            creditors[msg.sender] * principal * 10 ** token.decimals()
        );
        creditors[msg.sender] = 0;
    }

    // execute the deal when the supply is zero
    function execute() external {
        require(
            amtLeft == 0,
            "Deal cannot execute because amount left is not 0"
        );
        require(status == 0, "Deal must be pending in order to execute");
        status = 1;
        bondManager.mint(address(this), supply);
        id = bondManager.currentID();
    }

    function cancel() external {
        require(msg.sender == admin, "Only the deal admin can cancel the deal");
        require(status == 0, "Deal must be pending in order to cancel");
        status = 2;
    }

    function collectBond() external {
        // Get the bond
        require(status == 1, "Deal has not been executed yet");
        require(creditors[msg.sender] > 0, "No bonds to collect");
        bondManager.safeTransferFrom(
            address(this),
            msg.sender,
            id,
            creditors[msg.sender],
            ""
        );
        creditors[msg.sender] = 0;
    }

    function redeemCoupon() external {
        // Get interest payment
        require(block.timestamp >= maturity, "The bond has not matured yet");
        // the repayment amount is shifted to the left 2 places. send repaymentAmt * 10 ^ (decimals - 2)
        require(
            token.balanceOf(address(this)) ==
                repaymentAmt * 10 ** (token.decimals() - 2),
            "The deal contract has not yet been funded"
        );
        // todo: transfer bond from sender to contract
        // todo: transfer USD from contract to sender
    }
}

contract DealFactory {
    Deal[] public deals;

    BondManager public immutable manager;

    constructor() {
        manager = new BondManager();
    }

    function launchDeal() external {
        
    }
}
