// src/components/charts/helpers/DataPreviewTable.jsx
import React, { useState } from "react";

/**
 * Reusable paginated data preview table.
 *
 * Props:
 * data        — array of row objects
 * columns     — [{ key, label, render?: (value, row) => ReactNode }]
 * previewRows — rows shown before "show all" (default 5)
 * title       — optional string in the header
 */
function DataPreviewTable({ data = [], columns = [], previewRows = 5, title }) {
  const [expanded, setExpanded] = useState(false);

  const visibleRows = expanded ? data : data.slice(0, previewRows);
  const hiddenCount = data.length - previewRows;

  if (!data.length || !columns.length) return null;

  // Funkcia na stiahnutie dát vo formáte CSV
  const handleDownloadCSV = () => {
    // Vytvorenie hlavičky
    const headers = columns.map((c) => `"${c.label}"`).join(";");

    // Vytvorenie riadkov (ošetrenie úvodzoviek a formátovania)
    const csvRows = data.map((row) =>
      columns
        .map((c) => {
          const val = row[c.key] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(";"),
    );

    const csvContent = [headers, ...csvRows].join("\n");

    // Pridanie UTF-8 BOM pre správne zobrazenie diakritiky v Exceli
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "export_dat.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

        <div className="d-flex gap-2">
          {/* Tlačidlo na stiahnutie dát */}
          <button
            type="button"
            className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1"
            onClick={handleDownloadCSV}
            title="Stiahnuť dáta ako CSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
            </svg>
            Stiahnuť CSV
          </button>

          {hiddenCount > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill"
              onClick={() => setExpanded((v) => !v)}
              style={{
                minWidth: "145px",
              }} /* Fixná šírka zabraňuje horizontálnemu posunu okolia */
            >
              {expanded ? "Zobraziť menej ▲" : "Zobraziť všetky ▼"}
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="table-responsive rounded-3 border"
        style={{
          maxHeight: expanded ? "420px" : undefined,
          overflowY: expanded ? "scroll" : "hidden", // Zmena z auto na scroll pre pevnejší layout v kombinácii so stable
          scrollbarGutter: "stable",
        }}
      >
        <table
          className="table table-sm table-hover mb-0"
          style={{ fontSize: "0.82rem" }}
        >
          <thead className="table-active sticky-top">
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
