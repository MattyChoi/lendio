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
    address public dealFactory;
    address public bondManager;
    uint256 public repaymentAmt;

    // Instance data
    mapping(address => uint256) public creditors; // address to number of bonds each creditor wants to buy
    uint256 public status = 0; // 0 pending, 1 executed, 2 for canceled

    /// @notice Constructor for the Deal contract
    /// @dev Initializes the contract with given parameters
    /// @param _dealFactory Address of DealFactory contract
    /// @param _bondManager Address of BondManager contract
    /// @param _denom Currency token address
    /// @param _principal Principal amount per bond
    /// @param _coupon Interest rate (whole number)
    /// @param _maturity Maturity timestamp
    /// @param _supply Amount of bonds to issue
    /// @param _admin Admin of the deal
    constructor(
        address _dealFactory, // address of DealFactory contract
        address _bondManager, // address of BondManager
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
        repaymentAmt = (_supply * _principal * (100 + _coupon)) * 10 ** (ERC20(_denom).decimals() - 2); // repayment in atomic units
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

    /// @notice Calculate the atomic price of specified number of bonds
    /// @param numBonds Number of bonds to calculate the price for
    /// @return The atomic price of the specified number of bonds
    function calcAtomicPrice(uint256 numBonds) public view returns (uint256) {
        return numBonds * principal * 10 ** ERC20(denom).decimals();
    }

    /// @notice Deposit the required amount to buy specified number of bonds
    /// @param numBonds Number of bonds the creditor wants to buy
    function deposit(uint256 numBonds) external onlyStatus(0) {
        require(numBonds <= amtLeft, "There are not enough bonds left");
        ERC20 token = ERC20(denom);
        token.transferFrom(msg.sender, address(this), calcAtomicPrice(numBonds));
        amtLeft -= numBonds;
        creditors[msg.sender] += numBonds;
    }

    /// @notice Execute the deal when the supply is zero
    function execute() external onlyAdmin onlyStatus(0) {
        require(amtLeft == 0, "Deal cannot execute because amount left is not 0");
        status = 1;
    }

    /// @notice Cancel the deal
    function cancel() external onlyAdmin onlyStatus(0) {
        status = 2;
    }

    // POST-SALE FUNCTIONS (status=1)

    /// @notice Collect the bond tokens after the deal is executed
    function collectBond() external onlyStatus(1) {
        // Get the bond
        require(creditors[msg.sender] > 0, "No bonds to collect");
        BondManager(bondManager).setApprovalForAll(dealFactory, true);
        DealFactory(dealFactory).releaseBond(msg.sender, creditors[msg.sender]);
        creditors[msg.sender] = 0;
    }

    /// @notice Calculate the price per bond using the principal and coupon
    /// @return The price per bond
    function calcPricePer() public view returns (uint256) {
        return principal * (100 + coupon) * 10 ** (ERC20(denom).decimals() - 2);
    }

    /// @notice Redeem the bond and receive the principal plus interest
    function redeemBond() external onlyStatus(1) {
        // Get interest payment
        require(block.timestamp >= maturity, "The bond has not matured yet");
        ERC20 token = ERC20(denom);
        require(
            token.balanceOf(address(this)) >= repaymentAmt, 
            "The deal contract has not yet been funded"
        );
        DealFactory df = DealFactory(dealFactory);
        BondManager bm = BondManager(bondManager);
        // Amount of bonds that the user is redeeming
        uint256 tokenID = df.bonds(address(this));
        uint256 amount = bm.balanceOf(msg.sender, tokenID) + creditors[msg.sender];
        bm.burn(msg.sender, tokenID, amount);
        uint256 value = calcPricePer() * amount;
        token.transfer(msg.sender, value);
    }

    // CANCELED FUNCTIONS (status=2)

    /// @notice Withdraw deposited funds after the deal is canceled
    /// @dev Transfers the deposited funds back to the creditor and sets their bond balance to zero
    function withdraw() external onlyStatus(2) {
        ERC20 token = ERC20(denom);
        token.transfer(msg.sender, calcAtomicPrice(creditors[msg.sender]));
        creditors[msg.sender] = 0;
    }
}
