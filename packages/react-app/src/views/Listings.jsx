import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { DealCard } from "../components";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Listings({ yourLocalBalance, readContracts }) {
  const deals = [
    {
      company: "DAO A",
      bgColor: "#e3f2fd",
      children: "Deal details for Company A...",
    },
    {
      company: "DAO B",
      bgColor: "#fff3e0",
      children: "Deal details for Company B...",
    },
    {
      company: "DAO C",
      bgImage: "https://example.com/company-c-bg.jpg",
      children: "Deal details for Company C...",
    },
  ];
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <div>
      <br />
      <br />
      {deals.map((deal, index) => (
        <DealCard key={index} {...deal} />
      ))}
    </div>
  );
}

export default Listings;
