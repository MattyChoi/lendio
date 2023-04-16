import React from "react";
import { BondForm } from "../components";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function CreateDeal({ contractAddress, userSigner }) {
  return (
    <div>
      <BondForm userSigner={userSigner} contractAddress={contractAddress} />
    </div>
  );
}

export default CreateDeal;
