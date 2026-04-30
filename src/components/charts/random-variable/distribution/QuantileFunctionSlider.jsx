// src/components/charts/random-variable/distribution/QuantileFunctionSlider.jsx
import React, { useState, useMemo } from "react";
import { ReferenceLine } from "recharts";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import DataPreviewTable from "../../helpers/DataPreviewTable";
import StatsBadge from "../../../content/helpers/StatsBadge";
import useFetch from "../../../../hooks/useFetch";
import { parseCSV } from "../../../../utils/csvParser";

/**
 * Transforms raw CSV text into sorted numeric HCI values and display rows.
 * Defined outside the component so useFetch receives a stable function reference.
 */
const transformHCI = (csvText) => {
  const rows = parseCSV(csvText);
  if (rows.length < 2) throw new Error("CSV neobsahuje dáta.");

  const [headers, ...dataRows] = rows;
  const scoreIdx = headers.indexOf("HCI_2025");
  const nameIdx = headers.indexOf("Country.Name");

  if (scoreIdx === -1 || nameIdx === -1) {
    throw new Error("Nesprávny formát hlavičky v CSV.");
  }

  const parsedRows = dataRows.map((cols) => ({
    "Country.Name": cols[nameIdx] || "",
    HCI_2025: cols[scoreIdx] || "",
  }));

  const values = parsedRows
    .map((row) => parseFloat(row["HCI_2025"]))
    .filter((val) => !isNaN(val))
    .sort((a, b) => a - b);

  const sortedRows = parsedRows
    .filter((row) => !isNaN(parseFloat(row["HCI_2025"])))
    .sort((a, b) => parseFloat(a["HCI_2025"]) - parseFloat(b["HCI_2025"]));

  return { values, sortedRows };
};

/**
 * @component QuantileFunctionSlider
 * @description Interactive component for exploring the quantile function (inverse CDF).
 * Allows users to input probability (p) via slider to see the corresponding mapping.
 * Uses real-world dataset (World HCI) fetched and parsed on mount.
 */
function QuantileFunctionSlider() {
  const { t } = useTranslation();

  // Interaction state
  const [activeMode, setActiveMode] = useState("slider");
  const [sliderP, setSliderP] = useState(0.25);
  const [hoverX, setHoverX] = useState(null);

  const csvUrl = `${import.meta.env.BASE_URL}data/World_HCI.csv`;

  // useFetch + transformHCI replaces the manual fetch + custom CSV parser
  const { data: parsed, loading, error } = useFetch(csvUrl, transformHCI);

  const data = parsed?.values ?? [];
  const rawRows = parsed?.sortedRows ?? [];
  const n = data.length;
  const minX = n > 0 ? data[0] : 0;
  const maxX = n > 0 ? data[n - 1] : 0;

  /**
   * Memoized column definitions for the preview table
   */
  const tableColumns = useMemo(
    () => [
      {
        key: "Country.Name",
        label: t("components.randomVariableCharts.quantileSlider.countryCol"),
      },
      {
        key: "HCI_2025",
        label: t("components.randomVariableCharts.quantileSlider.scoreCol"),
        render: (val) => <strong>{parseFloat(val).toFixed(4)}</strong>,
      },
    ],
    [t],
  );

  /**
   * Calculates chart data points (step function) based on the sorted dataset
   */
  const chartData = useMemo(() => {
    if (n === 0) return [];

    const allX = new Set([0, 1]);
    for (let i = 0; i < n; i++) {
      allX.add((i + 1) / n);
    }

    return Array.from(allX)
      .sort((a, b) => a - b)
      .map((x) => {
        const exactK = x * n;
        const k = Math.round(exactK);
        const isIntegerK = Math.abs(exactK - k) < 1e-9;

        let quantileVal;
        if (x === 0) {
          quantileVal = data[0];
        } else if (isIntegerK && k > 0 && k < n) {
          quantileVal = (data[k - 1] + data[k]) / 2;
        } else {
          const idx = Math.ceil(exactK) - 1;
          quantileVal = data[Math.min(Math.max(idx, 0), n - 1)];
        }

        return { x, y: quantileVal };
      });
  }, [data, n]);

  /**
   * Evaluates the current active point (target p and x) based on user input mode
   */
  const target = useMemo(() => {
    if (n === 0) return null;

    if (activeMode === "slider") {
      const p = sliderP;
      if (p === 0) return { p: 0, x: minX, msg: null };

      const exactK = p * n;
      const isIntegerK = Math.abs(exactK - Math.round(exactK)) < 1e-9;
      const k = Math.round(exactK);

      let val;
      if (isIntegerK && k > 0 && k < n) {
        val = (data[k - 1] + data[k]) / 2;
      } else {
        const idx = Math.ceil(exactK) - 1;
        val = data[idx];
      }
      return { p, x: val, msg: null };
    }
  }, [n, activeMode, sliderP, data, minX, maxX, t]);

  const currentSliderValue =
    activeMode === "slider"
      ? sliderP
      : target?.p != null
        ? Math.round(target.p)
        : sliderP;

  const displayPercentage =
    activeMode === "input" && target?.p != null
      ? target.p.toFixed(3)
      : currentSliderValue;

  const badgeItems =
    target && !target.msg
      ? [
          {
            label: t("components.randomVariableCharts.quantileSlider.badgeP"),
            value: `${target.p.toFixed(2)}`,
            color: "text-primary",
            groupStart: true,
          },
          {
            label: t("components.randomVariableCharts.quantileSlider.badgeX"),
            value: `${target.x.toFixed(2)}`,
            color: "text-success",
            groupStart: true,
          },
        ]
      : [];

  if (error)
    return (
      <div className="alert alert-danger p-4 mb-4">
        {t("components.randomVariableCharts.quantileSlider.errorFetch")}
      </div>
    );

  if (loading || n === 0)
    return (
      <div className="p-4 text-center">
        {t("components.randomVariableCharts.quantileSlider.loading")}
      </div>
    );

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      {/* Controls Section */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-5 w-100"
        style={{ maxWidth: "800px" }}
      >
        <div className="d-flex flex-column align-items-center flex-grow-1">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t("components.randomVariableCharts.quantileSlider.labelP")}
            <span
              className="text-primary d-inline-block text-start ms-1"
              style={{ width: "45px" }}
            >
              {displayPercentage}
            </span>
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="1"
            step="0.01"
            value={currentSliderValue}
            onChange={(e) => {
              setSliderP(Number(e.target.value));
              setActiveMode("slider");
            }}
            style={{ maxWidth: "250px" }}
          />
        </div>
      </div>

      {/* Target Status / Badges */}
      <div
        className="w-100 mb-4 text-center"
        style={{ maxWidth: "800px", minHeight: "40px" }}
      >
        {target?.msg && (
          <div className="text-danger fw-bold" style={{ fontSize: "0.95rem" }}>
            {target.msg}
          </div>
        )}
        {target && !target.msg && <StatsBadge items={badgeItems} />}
      </div>

      <h6 className="mb-3 text-center">
        {t("components.randomVariableCharts.quantileSlider.title")}
      </h6>

      {/* Chart Visualization */}
      <div
        className="charts-wrapper w-100 mx-auto mb-5"
        style={{ maxWidth: "800px" }}
      >
        <StyledLineChart
          data={chartData}
          xLabel="p"
          yLabel="HCI+"
          lineType="stepBefore"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={0}
          maxX={1}
          yAxisDomain={[0, 325]}
        >
          {target && !target.msg && (
            <>
              <ReferenceLine
                x={target.p}
                stroke="var(--bs-success)"
                strokeWidth={1}
                opacity={0.8}
              />
              <ReferenceLine
                y={target.x}
                stroke="var(--bs-success)"
                strokeWidth={1}
                opacity={0.8}
              />
            </>
          )}
        </StyledLineChart>
      </div>

      {/* Data Table */}
      <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <DataPreviewTable
          data={rawRows}
          columns={tableColumns}
          title={t(
            "components.randomVariableCharts.quantileSlider.dataTableTitle",
          )}
          previewRows={5}
          originalFileUrl={csvUrl}
          originalFileName="World_HCI.csv"
        />
      </div>
    </div>
  );
}

export default QuantileFunctionSlider;
