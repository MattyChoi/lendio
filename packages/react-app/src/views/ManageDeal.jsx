import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { BondCard } from "../components";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
const ManageDeal = () => {
  // Sample bond data
  const bondData = {
    mintDate: "2023-01-01",
    maturityDate: "2028-01-01",
    principal: 1000,
    coupon: 5,
    bondsBought: 600,
    totalBonds: 1000,
  };

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh", // Adjust this value if you have a fixed header or footer
    padding: "0 16px", // Add some horizontal padding for small screens
  };

  return (
    <div style={containerStyles}>
      <h1>Manage Issued Bonds</h1>
      <BondCard {...bondData} />
      {/* Render more BondCard components with different bond data */}
    </div>
  );
};
export default ManageDeal;
