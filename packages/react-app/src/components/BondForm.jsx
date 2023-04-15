import React, { useState } from "react";

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "500px",
    margin: "0 auto",
  },
  label: {
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "15px",
    width: "100%",
    WebkitAppearance: "none",
    MozAppearance: "textfield",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  inputWithPostfix: {
    flexGrow: 1,
  },
  postfix: {
    marginLeft: "5px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  inputWrapper: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
  },
  postfixInsideInput: {
    position: "absolute",
    right: "10px",
    pointerEvents: "none",
    color: "#ccc",
    lineHeight: "36px", // Adjust this value to match the height of the input
  },
};

const BondForm = () => {
  const [hover, setHover] = useState(false);

  const handleSubmit = event => {
    console.log("Test");
    event.preventDefault();
    // Process form data and handle submission logic
  };

  const renderInputWithPostfix = (id, type, postfix) => {
    return (
      <div style={styles.inputWrapper}>
        <input
          id={id}
          type={type}
          style={{ ...styles.input, paddingRight: "30px" }}
          min="0"
          step="1"
          pattern="\d+"
          required
        />
        <span style={styles.postfixInsideInput}>{postfix}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label htmlFor="maturityDate" style={styles.label}>
        Maturity Date
      </label>
      <input type="datetime-local" id="maturityDate" style={styles.input} required />

      <label htmlFor="currency" style={styles.label}>
        Currency Denomination
      </label>
      <select id="currency" style={styles.input} defaultValue="USDC" required>
        <option value="USDC">USDC</option>
        {/* Add other currency options here */}
      </select>

      <label htmlFor="principal" style={styles.label}>
        Principal
      </label>
      {renderInputWithPostfix("principal", "number", "USDC")}

      <label htmlFor="coupon" style={styles.label}>
        Coupon (integer rate)
      </label>
      {renderInputWithPostfix("coupon", "number", "%")}

      <label htmlFor="numberOfBonds" style={styles.label}>
        Number of Bonds
      </label>
      {renderInputWithPostfix("numberOfBonds", "number", "Bonds")}

      <button
        type="submit"
        onClick={handleSubmit}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...styles.button,
          ...(hover ? styles.buttonHover : {}),
        }}
      >
        {" "}
        Issue Bonds{" "}
      </button>
    </form>
  );
};

export default BondForm;
