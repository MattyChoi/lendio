import React, { useState } from "react";
import { useParams } from "react-router-dom";

function BuyBond() {
  const { bondId } = useParams();

  // Sample bond data, replace with actual data from your data source
  const bondData = {
    bondId: bondId,
    maturityDate: "2028-01-01",
    principal: 1000,
    coupon: 5,
    numberOfBonds: 1000,
  };

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

  const [bondsToBuy, setBondsToBuy] = useState(0);
  const [usdcDeposited, setUsdcDeposited] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleDepositUSDC = () => {
    // Check if the value in the bondsToBuy input is an integer greater than 0
    if (bondsToBuy <= 0 || !Number.isInteger(bondsToBuy)) {
      alert("Please enter a valid number of bonds greater than 0.");
      return;
    }
    const confirmation = window.confirm(`Are you sure you want to deposit USDC to buy ${bondsToBuy} bonds?`);

    if (confirmation) {
      // Handle depositing USDC logic here

      setUsdcDeposited(true);
      setBondsToBuy(0);
      setIsSuccessModalOpen(true);
    } else {
      // User clicked Cancel; do nothing
    }
  };

  const handleWithdrawUSDC = () => {
    // Handle withdrawing USDC logic here
  };

  const handleRedeemBond = () => {
    // Handle redeeming bond logic here
  };

  return (
    <div style={styles.container}>
      <h1>Buy Bond</h1>
      <div style={styles.details}>
        <h2>Bond Details</h2>
        <div>Bond ID: {bondData.bondId}</div>
        <div>Maturity Date: {bondData.maturityDate}</div>
        <div>Principal: {bondData.principal}</div>
        <div>Coupon: {bondData.coupon}</div>
        <div>Number of Bonds Available: {bondData.numberOfBonds}</div>
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
        style={{ ...styles.button, ...(usdcDeposited ? styles.buttonDisabled : {}) }}
        onClick={handleDepositUSDC}
        disabled={usdcDeposited}
      >
        Deposit USDC
      </button>
      <button
        style={{ ...styles.button, ...(!usdcDeposited ? styles.buttonDisabled : {}) }}
        onClick={handleWithdrawUSDC}
        disabled={!usdcDeposited}
      >
        Withdraw USDC
      </button>
      <button
        style={{ ...styles.button, ...(!usdcDeposited ? styles.buttonDisabled : {}) }}
        onClick={handleRedeemBond}
        disabled={!usdcDeposited}
      >
        Redeem bond
      </button>
    </div>
  );
}

export default BuyBond;
