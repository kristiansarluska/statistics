// src/components/content/helpers/StatsBadge.jsx
import React from "react";

/**
 * @component StatsBadge
 * @description A flexible container for displaying multiple statistical values in a badge-like row.
 * Supports grouping with dividers and an optional footer for additional context.
 * * @param {Object} props
 * @param {Array<Object>} props.items - Array of stat objects to display.
 * @param {string} props.items[].label - Label for the statistic (e.g., "Mean").
 * @param {string|number} props.items[].value - The value to display.
 * @param {string} [props.items[].color] - CSS class for the value color (e.g., "text-primary").
 * @param {boolean} [props.items[].groupStart] - If true, renders a vertical divider before this item (except the first).
 * @param {React.ReactNode} [props.footer] - Optional content rendered below the statistics.
 */
function StatsBadge({ items, footer }) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className="bg-body-tertiary border shadow-sm rounded-4 px-3 py-2"
      style={{ fontSize: "0.88rem", display: "inline-block", maxWidth: "100%" }}
    >
      {/* Responsive flex layout — wraps automatically on small screens */}
      <div className="d-flex flex-wrap justify-content-center align-items-stretch gap-0">
        {items.map(({ label, value, color, groupStart }, i) => (
          <React.Fragment key={i}>
            {/* Vertical divider before each group (except the first one) */}
            {groupStart && i !== 0 && (
              <div
                className="d-none d-sm-block mx-3 border-start align-self-stretch"
                style={{ minHeight: "1.4rem" }}
              />
            )}
            <div className="d-flex align-items-baseline gap-1 px-2 py-1 py-sm-0">
              {label && (
                <span className="text-muted" style={{ whiteSpace: "nowrap" }}>
                  {label}:
                </span>
              )}
              <strong className={`${color || "text-body"} text-nowrap`}>
                {value}
              </strong>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Optional bottom section for summaries or explanations */}
      {footer && (
        <div className="mt-1 pt-1 border-top text-center text-muted small">
          {footer}
        </div>
      )}
    </div>
  );
}

export default StatsBadge;
