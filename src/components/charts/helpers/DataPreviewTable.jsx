// src/components/charts/helpers/DataPreviewTable.jsx
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * @component DataPreviewTable
 * @description Reusable paginated data preview table with smooth height transition
 * and horizontal scroll support for mobile devices. Supports exporting data to CSV/GEOJSON.
 * @param {Object} props
 * @param {Array} props.data - Array of data objects to display.
 * @param {Array} props.columns - Configuration array for table columns [{key, label, render}].
 * @param {number} [props.previewRows=5] - Number of rows visible when collapsed.
 * @param {string} [props.title] - Optional title for the table header.
 * @param {string} [props.originalFileUrl] - URL for direct file download (if applicable).
 * @param {string} [props.originalFileName] - Filename for the downloaded dataset.
 * @param {string} [props.downloadBtnLabel] - Custom label for the download button.
 * @param {string} [props.rowKey] - Key used to identify rows for hover interactions.
 * @param {string|number} [props.hoveredRowKey] - Currently hovered row ID (controlled externally).
 * @param {Function} [props.onRowHover] - Callback triggered when a row is hovered.
 */
function DataPreviewTable({
  data = [],
  columns = [],
  previewRows = 5,
  title,
  originalFileUrl,
  originalFileName,
  downloadBtnLabel,
  rowKey = null,
  hoveredRowKey = null,
  onRowHover = null,
}) {
  const { t } = useTranslation();

  // Local state for tracking table expansion
  const [expanded, setExpanded] = useState(false);
  const tableRef = useRef(null);

  const hiddenCount = data.length - previewRows;
  const visibleRows = data;

  if (!data.length || !columns.length) return null;

  /**
   * Handles dataset downloading.
   * Uses a direct URL if provided, otherwise generates a CSV blob from current data.
   */
  const handleDownload = () => {
    // Direct file download
    if (originalFileUrl) {
      const link = document.createElement("a");
      link.href = originalFileUrl;
      link.download = originalFileName || "data_original";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // CSV generation fallback with basic escaping
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
    // Prepend BOM (\uFEFF) for correct UTF-8 encoding in Excel
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

  /**
   * Toggles table expansion and resets scroll position when collapsing.
   */
  const handleToggle = () => {
    if (expanded && tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
    setExpanded(!expanded);
  };

  const btnLabel =
    downloadBtnLabel || t("components.dataPreviewTable.downloadBtn");

  // Calculate collapsed height dynamically based on row count
  const collapsedHeightStr = `${38 + previewRows * 32}px`;

  return (
    <div className="mt-4">
      {/* Header Section */}
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

        {/* Action Buttons */}
        <div className="d-flex gap-2">
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
              onClick={handleToggle}
              style={{ minWidth: "145px" }}
            >
              {expanded
                ? t("components.dataPreviewTable.showLess")
                : t("components.dataPreviewTable.showAll")}
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div
        ref={tableRef}
        className="rounded-3 border bg-body w-100"
        style={{
          maxHeight:
            hiddenCount > 0
              ? expanded
                ? "420px"
                : collapsedHeightStr
              : "420px",
          transition: "max-height 0.4s ease-in-out",
          overflowY: expanded ? "auto" : "hidden",
          scrollbarGutter: "stable",
        }}
      >
        {/* Horizontal Scroll Wrapper */}
        <div className="table-responsive w-100">
          <table
            className="table table-sm table-hover mb-0 text-nowrap"
            style={{ fontSize: "0.82rem" }}
          >
            <thead className="table-active sticky-top bg-body z-1">
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
              {visibleRows.map((row, i) => {
                const isHovered =
                  rowKey && hoveredRowKey && row[rowKey] === hoveredRowKey;
                return (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: isHovered
                        ? "var(--bs-primary-bg-subtle)"
                        : undefined,
                      cursor: onRowHover ? "pointer" : undefined,
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={
                      onRowHover && rowKey
                        ? () => onRowHover(row[rowKey])
                        : undefined
                    }
                    onMouseLeave={
                      onRowHover ? () => onRowHover(null) : undefined
                    }
                  >
                    <td className="text-muted ps-3">{i + 1}</td>
                    {columns.map(({ key, render }) => (
                      <td key={key}>
                        {render ? render(row[key], row) : (row[key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsed Status Hint */}
      {!expanded && hiddenCount > 0 && (
        <p className="text-muted small text-center mt-1 mb-0">
          {t("components.dataPreviewTable.showingRows", {
            shown: previewRows + 1,
            total: data.length,
          })}
        </p>
      )}
    </div>
  );
}

export default DataPreviewTable;
