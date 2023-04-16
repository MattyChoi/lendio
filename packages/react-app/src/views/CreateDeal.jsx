import React from "react";
import { BondForm } from "../components";

function CreateDeal({ contractAddress, userSigner }) {
  return (
    <div>
      <BondForm userSigner={userSigner} contractAddress={contractAddress} />
    </div>
  );
}

export default CreateDeal;
