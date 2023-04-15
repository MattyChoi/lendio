import React, { useState } from "react";

const styles = {
  cardWrapper: (bgColor, bgImage) => ({
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "15px",
    backgroundColor: bgColor || "#fff",
    backgroundImage: bgImage ? `url(${bgImage})` : null,
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    transition: "0.3s",
  }),
  cardWrapperHover: {
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  },
  cardTitle: {
    margin: 0,
    fontWeight: "bold",
  },
  cardContent: expanded => ({
    maxHeight: expanded ? "100%" : "0",
    overflow: "hidden",
    transition: "max-height 0.3s",
  }),
};

const DealCard = ({ company, bgColor, bgImage, children }) => {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  return (
    <div
      onClick={toggleExpanded}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.cardWrapper(bgColor, bgImage),
        ...(hover ? styles.cardWrapperHover : {}),
      }}
    >
      <h3 style={styles.cardTitle}>{company}</h3>
      <div style={styles.cardContent(expanded)}>{children}</div>
    </div>
  );
};

export default DealCard;
