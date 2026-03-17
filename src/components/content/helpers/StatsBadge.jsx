// src/components/content/helpers/StatsBadge.jsx
import React from "react";

function StatsBadge({ items, footer }) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className="bg-body-tertiary border shadow-sm rounded-4 px-3 py-2"
      style={{ fontSize: "0.88rem", display: "inline-block", maxWidth: "100%" }}
    >
      {/* Responzívny flex layout — na malých obrazovkách sa zalomí automaticky */}
      <div className="d-flex flex-wrap justify-content-center align-items-stretch gap-0">
        {items.map(({ label, value, color, groupStart }, i) => (
          <React.Fragment key={i}>
            {/* Vertikálny rozdeľovač pred každou skupinou (okrem prvej) */}
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

      {/* Voliteľná spodná časť pre sumáre alebo vysvetlivky */}
      {footer && (
        <div
          className="border-top mt-2 pt-1 text-center"
          style={{ fontSize: "0.85rem" }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export default StatsBadge;
