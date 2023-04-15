// create factory contract 

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./bondtoken.sol";


// create a contract for each deal issued by a DAO
contract Deal is ERC1155Holder {
    mapping(address => uint256) public creditors; // address to number of bonds each creditor wants to buy
    address private denom;
    uint256 private principal;
    uint256 private coupon;
    uint256 private maturity;
    uint256 private supply;
    uint256 private currentID = 0;


    // denom is for currency address
    constructor(
        address _denom, 
        address _bondManager,
        uint256 _principal, 
        uint256 _coupon, 
        uint256 _maturity, 
        uint256 _supply
    )   {
        require(_principal > 0, "Price should be greater than 0");
        require(_supply > 0, "Supply must be greater than 0");
        denom = _denom;  
        principal = _principal;
        coupon = _coupon;
        maturity = _maturity;
        supply = _supply;
        IERC1155 bondManager = IERC1155(_bondManager);

        // DAO will pay for the minting of the bonds
        bondManager.mint(address(this), currentID, _supply, "");
        currentID += 1;
    }

    // how many bond tokens the creditor wants to buy
    function deposit(int numBonds, ) external {

    }

    // how many bond tokens the creditor wants to refund
    function withdraw() external {

    }

    // execute the deal when the supply is zero
    function execute() external {
        require(supply == 0, "Deal cannot execute because supply is not 0")
    }

    function cancel() external {

    }

    function redeem() external {

    }

}


contract DealFactory {
   Deal[] public deals;

   function CreateNewDeal(string memory _greeting) public {
     Greeter greeter = new Greeter(_greeting);
     GreeterArray.push(greeter);
   }

}