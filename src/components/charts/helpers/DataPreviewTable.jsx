// src/components/charts/helpers/DataPreviewTable.jsx
import React, { useState } from "react";

/**
 * Reusable paginated data preview table.
 *
 * Props:
 *   data        — array of row objects
 *   columns     — [{ key, label, render?: (value, row) => ReactNode }]
 *   previewRows — rows shown before "show all" (default 5)
 *   title       — optional string in the header
 */
function DataPreviewTable({ data = [], columns = [], previewRows = 5, title }) {
  const [expanded, setExpanded] = useState(false);

  const visibleRows = expanded ? data : data.slice(0, previewRows);
  const hiddenCount = data.length - previewRows;

  if (!data.length || !columns.length) return null;

  return (
    <div className="mt-4">
      {/* ── Header ── */}
      <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          {title && <span className="fw-semibold small">{title}</span>}
          <span
            className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle"
            style={{ fontSize: "0.75rem" }}
          >
            {data.length} záznamov
          </span>
        </div>

        {hiddenCount > 0 && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded
              ? "Zobraziť menej ▲"
              : `Zobraziť všetky (${data.length}) ▼`}
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div
        className="table-responsive rounded-3 border"
        style={expanded ? { maxHeight: "420px", overflowY: "auto" } : undefined}
      >
        <table
          className="table table-sm table-hover mb-0"
          style={{ fontSize: "0.82rem" }}
        >
          <thead className="table-light sticky-top">
            <tr>
              <th className="text-muted fw-normal ps-3" style={{ width: 40 }}>
                #
              </th>
              {columns.map(({ key, label }) => (
                <th key={key} className="fw-semibold">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={i}>
                <td className="text-muted ps-3">{i + 1}</td>
                {columns.map(({ key, render }) => (
                  <td key={key}>
                    {render ? render(row[key], row) : (row[key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Collapsed hint ── */}
      {!expanded && hiddenCount > 0 && (
        <p className="text-muted small text-center mt-1 mb-0">
          Zobrazených {previewRows} z {data.length} riadkov
        </p>
      )}
    </div>
  );
}

export default DataPreviewTable;
