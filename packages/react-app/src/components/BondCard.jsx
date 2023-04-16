import React from "react";

const styles = {
  bondCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "15px",
    maxWidth: "600px",
  },
  bondCardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  bondData: {
    marginBottom: "10px",
  },
  progressBarContainer: {
    backgroundColor: "#e9ecef",
    borderRadius: "5px",
    height: "10px",
    overflow: "hidden",
  },
  progressBar: {
    backgroundColor: "#007bff",
    height: "100%",
  },
};

const BondCard = ({ denom, maturity, principal, coupon, supply, amtLeft }) => {
  maturity = new Date(maturity * 1000);
  const timeLeft = (maturity - Date.now()) / (1000 * 60 * 60 * 24);
  const progressPercentage = (supply - amtLeft / supply) * 100;

  return (
    <div style={styles.bondCard}>
      <div style={styles.bondCardTitle}>Bond Information</div>
      <div style={styles.bondData}>Maturity Date: {maturity.toString()}</div>
      <div style={styles.bondData}>Time Left: {timeLeft.toFixed(0)} days</div>
      <div style={styles.bondData}>Principal: {principal} USDC</div>
      <div style={styles.bondData}>Coupon: {coupon}%</div>

      <div style={styles.bondData}>
        Bonds Bought: {supply - amtLeft}/{supply}
      </div>
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
};

export default BondCard;
