// src/components/content/helpers/CalcPanel.jsx
import React from "react";
import { BlockMath } from "react-katex";

// Single formula row — scrollable horizontally on overflow
const Row = ({ formula, concrete = false }) => (
  <div
    style={{
      overflowX: "auto",
      overflowY: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: concrete ? "0" : "4px",
      marginBottom: concrete ? "0.5rem" : "0",
    }}
  >
    <div
      style={{ minWidth: "max-content", margin: "0 auto", textAlign: "center" }}
    >
      <BlockMath math={formula} />
    </div>
  </div>
);

// Horizontal divider between sections
const Divider = () => <hr className="my-3" />;

// Small descriptive note below formulas
const Note = ({ children }) => (
  <p className="small text-muted text-center mb-0 mt-2">{children}</p>
);

// Main panel wrapper
const CalcPanel = ({ title, children, maxWidth = "620px" }) => (
  <div className="card shadow-sm border-0 mx-auto mt-3" style={{ maxWidth }}>
    <div className="card-body">
      {title && (
        <h6 className="card-subtitle mb-3 text-muted text-center">{title}</h6>
      )}
      {children}
    </div>
  </div>
);

CalcPanel.Row = Row;
CalcPanel.Divider = Divider;
CalcPanel.Note = Note;

export default CalcPanel;
