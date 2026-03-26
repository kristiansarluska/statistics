// src/components/content/helpers/InfoIcon.jsx
import React, { useState } from "react";

function InfoIcon({ children }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="d-inline-flex align-items-center justify-content-center text-muted ms-2 bg-body-tertiary"
      style={{
        cursor: "help",
        position: "relative",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        border: "1.5px solid currentColor",
        fontSize: "11px",
        fontWeight: "bold",
        //fontFamily: "serif",
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      i
      {show && (
        <div
          className="position-absolute bg-body border shadow p-3 text-start fw-normal text-body rounded"
          style={{
            top: "150%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: "320px",
            fontSize: "0.85rem",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      )}
    </span>
  );
}

export default InfoIcon;
