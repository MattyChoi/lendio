import React, { useState } from "react";
import { ethers } from "ethers";
import dealFactoryABI from "../contracts/DealFactory.sol/DealFactory.json";

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

const BondForm = (userSigner, contractAddress) => {
  const [hover, setHover] = useState(false);
  const [date, setDate] = useState(Date.now());
  const [curr, setCur] = useState("USDC");
  const [princ, setPrinc] = useState(0);
  const [coup, setCoup] = useState(0);
  const [numBonds, setNumBonds] = useState(0);

  // interact with smart contract here
  const handleSubmit = e => {
    e.preventDefault();
    console.log(typeof date, curr, princ, coup, numBonds);

    console.log(typeof dealFactoryABI);
    // get contract variable
    const dealContract = new ethers.Contract(contractAddress, dealFactoryABI.abi, userSigner);

    console.log(dealContract);
  };

  const renderInputWithPostfix = (id, type, postfix, hook) => {
    return (
      <div
        style={styles.inputWrapper}
        onChange={e => {
          hook(e.target.valueAsNumber);
        }}
      >
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
    <form onSubmit={handleSubmit} action="" style={styles.form}>
      <label htmlFor="maturityDate" style={styles.label}>
        Maturity Date
      </label>
      <input
        type="datetime-local"
        id="maturityDate"
        style={styles.input}
        onChange={e => {
          setDate(e.target.valueAsDate);
        }}
        required
      />

      <label htmlFor="currency" style={styles.label}>
        Currency Denomination
      </label>
      <select
        id="currency"
        style={styles.input}
        defaultValue="USDC"
        onChange={e => {
          setCur(e.target.value);
        }}
        required
      >
        <option value="USDC">USDC</option>
        {/* Add other currency options here */}
      </select>

      <label htmlFor="principal" style={styles.label}>
        Principal
      </label>
      {renderInputWithPostfix("principal", "number", "USDC", setPrinc)}

      <label htmlFor="coupon" style={styles.label}>
        Coupon (integer rate)
      </label>
      {renderInputWithPostfix("coupon", "number", "%", setCoup)}

      <label htmlFor="numberOfBonds" style={styles.label}>
        Number of Bonds
      </label>
      {renderInputWithPostfix("numberOfBonds", "number", "Bonds", setNumBonds)}

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
