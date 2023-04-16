import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";

import dealABI from "../contracts/Deal.sol/Deal.json";

function BuyBond({ userSigner, deals }) {
  const { bondId } = useParams();

  const [bondsToBuy, setBondsToBuy] = useState(0);
  const [usdcDeposited, setUsdcDeposited] = useState(false);
  const [isDealCancelled, setIsDealCancelled] = useState(false);
  const [isDealExectued, setIsDealExectued] = useState(false);
  const [usdcApproved, setUsdcApproved] = useState(false);

  // Sample bond data, replace with actual data from your data source
  /* address: address,
  denom: denom,
  principal: principal.toNumber(),
  coupon: coupon.toNumber(),
  maturity: maturity.toNumber(),
  supply: supply.toNumber(),
  amtLeft: amtLeft.toNumber(), */

  const bondData = deals[bondId];

  // get the deal contract to make transactions
  const dealContract = bondData != null ? new ethers.Contract(bondData.address, dealABI.abi, userSigner) : null;

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "500px",
      margin: "0 auto",
    },
    details: {
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      padding: "20px",
      marginBottom: "20px",
      textAlign: "center",
      width: "100%",
    },
    label: {
      display: "block",
      textAlign: "center",
      marginBottom: "5px",
    },
    input: {
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "10px",
      marginBottom: "15px",
      width: "100%",
      textAlign: "center",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      padding: "10px",
      cursor: "pointer",
      transition: "0.3s",
      marginBottom: "10px",
      width: "100%",
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  };

  const handleApproveUSDC = async () => {
    // Check if the value in the bondsToBuy input is an integer greater than 0
    if (bondsToBuy <= 0 || !Number.isInteger(bondsToBuy)) {
      alert("Please enter a valid number of bonds greater than 0.");
      return;
    }
    const usdc = "0xA6847a9b6b6aF5bd09A36c3b331f6c66CA46c998";
    const usdcABI = [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: "address", name: "owner", type: "address" },
          { indexed: true, internalType: "address", name: "spender", type: "address" },
          { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "Approval",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: "address", name: "from", type: "address" },
          { indexed: true, internalType: "address", name: "to", type: "address" },
          { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    const usdcContract = new ethers.Contract(usdc, usdcABI, userSigner);

    console.log("Approving USDC to send to deal contract...");
    const tx1 = await usdcContract.approve(dealContract.address, await dealContract.calcAtomicPrice(bondsToBuy));
    console.log("USDC approved.");
    setUsdcApproved(true);
  };

  const handleDepositUSDC = async () => {
    // Check if the value in the bondsToBuy input is an integer greater than 0
    if (bondsToBuy <= 0 || !Number.isInteger(bondsToBuy)) {
      alert("Please enter a valid number of bonds greater than 0.");
      return;
    }
    const confirmation = window.confirm(`Are you sure you want to deposit USDC to buy ${bondsToBuy} bonds?`);

    if (confirmation) {
      // Handle depositing USDC logic here
      await dealContract.deposit(bondsToBuy);

      setUsdcDeposited(true);
      setBondsToBuy(0);
    }
  };

  const handleWithdrawUSDC = async () => {
    // Handle withdrawing USDC logic here
    // can only withdraw usdc if
    await dealContract.withdraw();
  };

  const handleRedeemBond = async () => {
    const erc1155abi = [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: "address", name: "account", type: "address" },
          { indexed: true, internalType: "address", name: "operator", type: "address" },
          { indexed: false, internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
          { indexed: true, internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: "address", name: "operator", type: "address" },
          { indexed: true, internalType: "address", name: "from", type: "address" },
          { indexed: true, internalType: "address", name: "to", type: "address" },
          { indexed: false, internalType: "uint256[]", name: "ids", type: "uint256[]" },
          { indexed: false, internalType: "uint256[]", name: "values", type: "uint256[]" },
        ],
        name: "TransferBatch",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: "address", name: "operator", type: "address" },
          { indexed: true, internalType: "address", name: "from", type: "address" },
          { indexed: true, internalType: "address", name: "to", type: "address" },
          { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
          { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "TransferSingle",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: "string", name: "value", type: "string" },
          { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "URI",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address[]", name: "accounts", type: "address[]" },
          { internalType: "uint256[]", name: "ids", type: "uint256[]" },
        ],
        name: "balanceOfBatch",
        outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256[]", name: "ids", type: "uint256[]" },
          { internalType: "uint256[]", name: "values", type: "uint256[]" },
        ],
        name: "burnBatch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "exists",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256[]", name: "ids", type: "uint256[]" },
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "operator", type: "address" },
          { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "uri",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    const bond = "0x5709B4ef60229E0022929042244e16D8641654Eb";
    const bondContract = new ethers.Contract(bond, erc1155abi, userSigner);

    // approve
    const tx = await bondContract.setApprovalForAll(dealContract.address, true);
    await tx.wait();

    // Handle redeeming bond logic here
    await dealContract.redeemBond();
  };

  useEffect(() => {
    async function getStatus() {
      const status = await dealContract.status();
      if (status.toNumber() == 2) {
        setIsDealExectued(true);
      } else if (status.toNumber() == 1) {
        setIsDealCancelled(true);
      }
      console.log("Status: ", status.toNumber());
    }
    if (dealContract) {
      getStatus();
    }
  }, []);

  // const approveBool = isDealExectued || usdcApproved;
  // const depositeBool = isDealExectued || !usdcApproved;
  // const withdrawBool = !isDealCancelled;
  // const redeemBool = !isDealExectued;
  const approveBool = false;
  const depositeBool = false;
  const redeemBool = false;
  const withdrawBool = false;

  return (
    <div style={styles.container}>
      {bondData && (
        <div>
          <h1>Buy Bond</h1>
          <div style={styles.details}>
            <h2>Bond Details</h2>
            <div>Address: {bondData.address}</div>
            <div>Maturity Date: {new Date(bondData.maturity * 1000).toString()}</div>
            <div>Principal: {bondData.principal}</div>
            <div>Coupon: {bondData.coupon}</div>
            <div>Number of Bonds Available: {bondData.amtLeft}</div>
            <label htmlFor="bondsToBuy">Number of bonds to buy:</label>
            <input
              type="number"
              style={styles.input}
              id="bondsToBuy"
              value={bondsToBuy}
              onChange={e => setBondsToBuy(parseInt(e.target.value))}
              min="0"
            />
          </div>
          <br />
          <button
            style={{ ...styles.button, ...(approveBool ? styles.buttonDisabled : {}) }}
            onClick={handleApproveUSDC}
            disabled={approveBool}
          >
            Approve USDC
          </button>
          <button
            style={{ ...styles.button, ...(depositeBool ? styles.buttonDisabled : {}) }}
            onClick={handleDepositUSDC}
            disabled={depositeBool}
          >
            Deposit USDC
          </button>
          <button
            style={{ ...styles.button, ...(withdrawBool ? styles.buttonDisabled : {}) }}
            onClick={handleWithdrawUSDC}
            disabled={withdrawBool}
          >
            Withdraw USDC
          </button>
          <button
            style={{ ...styles.button, ...(redeemBool ? styles.buttonDisabled : {}) }}
            onClick={handleRedeemBond}
            disabled={redeemBool}
          >
            Redeem bond
          </button>
        </div>
      )}
    </div>
  );
}

export default BuyBond;
