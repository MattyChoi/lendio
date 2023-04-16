import React from "react";
import { BondForm } from "../components";

function CreateDeal({ factoryContract, userSigner }) {
  return (
    <div>
      <BondForm userSigner={userSigner} factoryContract={factoryContract} />
    </div>
  );
}

export default CreateDeal;
