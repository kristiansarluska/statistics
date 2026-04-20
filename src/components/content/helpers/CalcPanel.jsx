// src/components/content/helpers/CalcPanel.jsx
import React from "react";
import { BlockMath } from "react-katex";

/**
 * @component Row
 * @description Represents a single formula row.
 * Designed to scroll horizontally on small screens to prevent LaTeX overflow.
 * @param {Object} props
 * @param {string} props.formula - LaTeX string to be rendered via KaTeX.
 * @param {boolean} [props.concrete=false] - If true, reduces padding/margin for multi-step calculations.
 */
function Row({ formula, concrete = false }) {
  return (
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
        style={{
          minWidth: "max-content",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <BlockMath math={formula} />
      </div>
    </div>
  );
}

/**
 * @component Divider
 * @description A simple horizontal line used to separate different sections of a calculation.
 */
function Divider() {
  return <hr className="my-3" />;
}

/**
 * @component Note
 * @description Renders a small, muted descriptive note below or between formulas.
 */
function Note({ children }) {
  return <p className="small text-muted text-center mb-0 mt-2">{children}</p>;
}

/**
 * @component CalcPanel
 * @description A card-based wrapper for displaying mathematical derivations and formulas.
 * Uses a sub-component pattern (CalcPanel.Row, CalcPanel.Divider, CalcPanel.Note).
 * @param {Object} props
 * @param {string} [props.title] - Optional title displayed as a subtitle in the card.
 * @param {React.ReactNode} props.children - Content of the panel.
 * @param {string} [props.maxWidth="620px"] - Maximum width of the card.
 */
function CalcPanel({ title, children, maxWidth = "620px" }) {
  return (
    <div className="card shadow-sm border-0 mx-auto mt-3" style={{ maxWidth }}>
      <div className="card-body">
        {/* Render optional title if provided */}
        {title && (
          <h6 className="card-subtitle mb-3 text-muted text-center">{title}</h6>
        )}
        {children}
      </div>
    </div>
  );
}

// Assign sub-components to the main object
CalcPanel.Row = Row;
CalcPanel.Divider = Divider;
CalcPanel.Note = Note;

export default CalcPanel;
