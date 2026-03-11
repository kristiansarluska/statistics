// src/components/charts/helpers/DataPreviewTable.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Reusable paginated data preview table.
 *
 * Props:
 * data             — array of row objects
 * columns          — [{ key, label, render?: (value, row) => ReactNode }]
 * previewRows      — rows shown before "show all" (default 5)
 * title            — optional string in the header
 * downloadUrl      — optional URL of the raw file to download (e.g. "/data/file.json")
 * downloadFilename — optional custom filename for the download
 * downloadBtnLabel — optional custom text for the download button
 */
function DataPreviewTable({
  data = [],
  columns = [],
  previewRows = 5,
  title,
  downloadUrl,
  downloadFilename,
  downloadBtnLabel,
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const visibleRows = expanded ? data : data.slice(0, previewRows);
  const hiddenCount = data.length - previewRows;

  if (!data.length || !columns.length) return null;

  // Funkcia na stiahnutie dát (pôvodný súbor alebo fallback na CSV)
  const handleDownload = () => {
    // Ak bola dodaná URL, stiahneme pôvodný súbor
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        downloadFilename || downloadUrl.split("/").pop() || "data",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Ak URL nebola dodaná, vygenerujeme z aktuálnej tabuľky CSV
    const headers = columns.map((c) => `"${c.label}"`).join(";");
    const csvRows = data.map((row) =>
      columns
        .map((c) => {
          const val = row[c.key] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(";"),
    );

    const csvContent = [headers, ...csvRows].join("\n");
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

  const btnLabel =
    downloadBtnLabel || t("components.dataPreviewTable.downloadBtn");

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
            {t("components.dataPreviewTable.records", { count: data.length })}
          </span>
        </div>

        <div className="d-flex gap-2">
          {/* Tlačidlo na stiahnutie dát */}
          <button
            type="button"
            className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1"
            onClick={handleDownload}
            title={t("components.dataPreviewTable.downloadTitle")}
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
            {btnLabel}
          </button>

          {hiddenCount > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill"
              onClick={() => setExpanded((v) => !v)}
              style={{ minWidth: "145px" }}
            >
              {expanded
                ? t("components.dataPreviewTable.showLess")
                : t("components.dataPreviewTable.showAll")}
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="table-responsive rounded-3 border"
        style={{
          maxHeight: expanded ? "420px" : undefined,
          overflowY: expanded ? "scroll" : "hidden",
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
          {t("components.dataPreviewTable.showingRows", {
            shown: previewRows,
            total: data.length,
          })}
        </p>
      )}
    </div>
  );
}

export default DataPreviewTable;
