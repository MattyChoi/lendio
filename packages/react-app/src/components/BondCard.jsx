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

const BondCard = ({ mintDate, maturityDate, principal, coupon, bondsBought, totalBonds }) => {
  const timeLeft = (new Date(maturityDate) - new Date()) / (1000 * 60 * 60 * 24);
  const progressPercentage = (bondsBought / totalBonds) * 100;

  return (
    <div style={styles.bondCard}>
      <div style={styles.bondCardTitle}>Bond Information</div>
      <div style={styles.bondData}>Mint Date: {mintDate}</div>
      <div style={styles.bondData}>Maturity Date: {maturityDate}</div>
      <div style={styles.bondData}>Time Left: {timeLeft.toFixed(0)} days</div>
      <div style={styles.bondData}>Principal: {principal} USDC</div>
      <div style={styles.bondData}>Coupon: {coupon}%</div>

      <div style={styles.bondData}>
        Bonds Bought: {bondsBought}/{totalBonds}
      </div>
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
};

export default BondCard;
