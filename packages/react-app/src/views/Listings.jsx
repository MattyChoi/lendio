import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DealCard } from "../components";

function Listings({ yourLocalBalance, deals }) {
  // const [deals, setDeals] = useState({})

  for (let i = 0; i < deals.length; i++) {
    deals[i]["company"] = "DAO " + String.fromCharCode(i + 65);
    deals[i]["bgColor"] = "#e3f2fd";
    deals[i]["children"] = "Deal details for Company " + deals[i]["company"];
  }

  // // you can also use hooks locally in your component of choice
  // // in this case, let's keep track of 'purpose' variable from our contract
  // const purpose = useContractReader(readContracts, "YourContract", "purpose");
  console.log(deals);

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
