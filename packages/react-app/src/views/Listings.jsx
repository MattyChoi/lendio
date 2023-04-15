import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DealCard } from "../components";

function Listings({ yourLocalBalance, readContracts }) {
  // const [deals, setDeals] = useState({})

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
        //index = bondId
        // <Link key={index} to={`/buy-bond/${index}`}>
        <DealCard key={index} bondId={index} {...deal} />
        // </Link>
      ))}
    </div>
  );
}

export default Listings;
