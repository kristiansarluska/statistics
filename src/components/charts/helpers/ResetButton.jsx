// src/components/charts/helpers/ResetButton.jsx
import React, { useState } from "react";

const ResetButton = ({
  onClick,
  disabled,
  title = "Obnoviť pôvodné dáta",
  className = "",
}) => {
  const [rotation, setRotation] = useState(0);

  const handleClick = (e) => {
    // Zamedzíme akcii, ak je tlačidlo neaktívne
    if (disabled) return;

    // Posun rotácie o -360 stupňov
    setRotation((prev) => prev - 360);

    if (onClick) onClick(e);
  };

  return (
    <button
      type="button" // typ "button" je kľúčový, aby sa nespúšťal submit vo formulároch
      className={`btn btn-primary d-flex align-items-center justify-content-center rounded-5 ${className}`}
      onClick={handleClick}
      disabled={disabled}
      title={title}
      style={{ width: "38px", height: "38px", padding: 0, flexShrink: 0 }}
    >
      <img
        src={`${import.meta.env.BASE_URL}assets/images/reset.png`}
        alt="Reset"
        style={{
          width: "18px",
          height: "18px",
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.5s ease-in-out",
        }}
      />
    </button>
  );
};

export default ResetButton;
