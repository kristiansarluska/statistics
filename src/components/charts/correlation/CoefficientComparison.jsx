// src/components/charts/correlation/CoefficientComparison.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InlineMath } from "react-katex";
import StyledScatterChart from "../helpers/StyledScatterChart";
import CalcPanel from "../../content/helpers/CalcPanel";
import {
  calculatePearson,
  calculateSpearman,
} from "../../../utils/correlationMath";
import ResetButton from "../helpers/ResetButton";
import StatsBadge from "../../content/helpers/StatsBadge";
import DataPreviewTable from "../helpers/DataPreviewTable";

/**
 * Basic CSV parser to handle quotes and newlines.
 */
const parseCSV = (str) => {
  const result = [];
  let row = [],
    inQuotes = false,
    val = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) {
      row.push(val.trim());
      val = "";
    } else if (char === "\n" && !inQuotes) {
      row.push(val.trim());
      if (row.length > 1) result.push(row);
      row = [];
      val = "";
    } else if (char !== "\r") val += char;
  }
  row.push(val.trim());
  if (row.length > 1) result.push(row);
  return result;
};

/**
 * @component CoefficientComparison
 * @description Interactive tool comparing Pearson and Spearman correlation coefficients.
 * Allows users to add artificial outliers to observe the robustness of Spearman vs. Pearson.
 */
function CoefficientComparison() {
  const { t } = useTranslation();

  // Base data states
  const [rawData, setRawData] = useState([]);
  const [outliers, setOutliers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Outlier placement controls
  const [newOutlierX, setNewOutlierX] = useState(145);
  const [newOutlierY, setNewOutlierY] = useState(77);

  const [showCalc, setShowCalc] = useState(false);

  // Fetch and parse static CSV dataset on component mount
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/NUTS2_GDPPPP_LifeExpectancy.csv`)
      .then((res) => {
        if (!res.ok) throw new Error(t("correlation.comparison.fetchError"));
        return res.text();
      })
      .then((csvText) => {
        const rows = parseCSV(csvText);
        const parsed = rows
          .slice(1)
          .map((row) => ({
            id: row[0],
            country: row[1],
            name: row[2],
            y: parseFloat(row[3]),
            x: parseFloat(row[4]),
          }))
          .filter((d) => !isNaN(d.x) && !isNaN(d.y));
        setRawData(parsed);
      })
      .catch((err) => console.error("Chyba pri načítaní dát:", err));
  }, [t]);

  // Filter dataset based on selected geographic tab
  const baseData = useMemo(() => {
    if (activeTab === "south_ro") {
      return rawData.filter((d) =>
        [
          "Italy",
          "Spain",
          "Portugal",
          "Greece",
          "Cyprus",
          "Malta",
          "Romania",
        ].includes(d.country),
      );
    }
    return rawData;
  }, [rawData, activeTab]);

  const chartData = useMemo(
    () => [...baseData, ...outliers],
    [baseData, outliers],
  );

  const basePearson = useMemo(() => calculatePearson(baseData), [baseData]);
  const baseSpearman = useMemo(() => calculateSpearman(baseData), [baseData]);
  const pearsonR = useMemo(() => calculatePearson(chartData), [chartData]);
  const spearmanR = useMemo(() => calculateSpearman(chartData), [chartData]);

  const hasOutliers = outliers.length > 0;

  /**
   * Computes intermediate statistical values required to dynamically render LaTeX formulas.
   * Spearman's sum of squared differences (sumD2) is reverse-engineered from the already
   * calculated coefficient to avoid recalculating ranks purely for the UI display.
   */
  const calcDetails = useMemo(() => {
    const n = chartData.length;
    if (n === 0) return null;

    // Pearson sums
    const meanX = chartData.reduce((acc, val) => acc + val.x, 0) / n;
    const meanY = chartData.reduce((acc, val) => acc + val.y, 0) / n;
    let sumDxDy = 0,
      sumDx2 = 0,
      sumDy2 = 0;

    chartData.forEach((d) => {
      const dx = d.x - meanX;
      const dy = d.y - meanY;
      sumDxDy += dx * dy;
      sumDx2 += dx * dx;
      sumDy2 += dy * dy;
    });

    // Reverse engineering sum of squared rank differences for Spearman
    const r_s = spearmanR;
    const sumD2 = ((1 - r_s) * n * (n * n - 1)) / 6;

    return { sumDxDy, sumDx2, sumDy2, sumD2, n };
  }, [chartData, spearmanR]);

  const tableData = useMemo(() => {
    return chartData.map((d) => ({
      id: d.id || "—",
      country: d.country || "—",
      name: d.name,
      x: d.x.toFixed(1),
      y: d.y.toFixed(1),
    }));
  }, [chartData]);

  const tableColumns = useMemo(
    () => [
      {
        key: "id",
        label: t("correlation.comparison.table.colCode"),
      },
      {
        key: "country",
        label: t("correlation.comparison.table.colCountry"),
      },
      {
        key: "name",
        label: t("correlation.comparison.table.colRegion"),
      },
      {
        key: "x",
        label: t("correlation.comparison.chart.xLabelShort"),
      },
      {
        key: "y",
        label: t("correlation.comparison.chart.yLabelShort"),
      },
    ],
    [t],
  );

  const handleAddOutlier = () => {
    setOutliers([
      ...outliers,
      {
        x: newOutlierX,
        y: newOutlierY,
        name: t("correlation.comparison.fictionalOutlier"),
        fill: "var(--bs-gray-600)",
      },
    ]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOutliers([]);
  };

  const badgeItems = useMemo(() => {
    return [
      {
        label: t("correlation.comparison.stats.pearsonLabel"),
        value: hasOutliers
          ? `${basePearson.toFixed(3)} → ${pearsonR.toFixed(3)}`
          : basePearson.toFixed(3),
        color: "text-primary",
        groupStart: true,
      },
      {
        label: t("correlation.comparison.stats.spearmanLabel"),
        value: hasOutliers
          ? `${baseSpearman.toFixed(3)} → ${spearmanR.toFixed(3)}`
          : baseSpearman.toFixed(3),
        color: "text-success",
        groupStart: true,
      },
    ];
  }, [basePearson, baseSpearman, pearsonR, spearmanR, hasOutliers, t]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      {/* Controls Section */}
      <div
        className="controls mb-5 w-100 d-flex flex-column align-items-center gap-4"
        style={{ maxWidth: "1000px" }}
      >
        {/* Dataset Selector */}
        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 text-center small">
            {t("correlation.comparison.datasetLabel")}
          </label>
          <div className="btn-group" role="group">
            {[
              { value: "all", label: t("correlation.comparison.tabAll") },
              {
                value: "south_ro",
                label: t("correlation.comparison.tabSouthRO"),
              },
            ].map(({ value, label }, i) => (
              <button
                key={value}
                type="button"
                className={`btn btn-sm px-3 btn-outline-primary ${
                  activeTab === value ? "active" : ""
                } ${i === 0 ? "rounded-start-pill" : "rounded-end-pill"}`}
                onClick={() => handleTabChange(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Outlier Inputs & Actions */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 gap-md-4 w-100">
          <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-4 justify-content-center">
            <div style={{ width: "200px" }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-bold text-secondary mb-0">
                  {t("correlation.comparison.outlierControls.labelX")}
                </label>
                <span className="small fw-bold text-primary">
                  {newOutlierX}
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="270"
                step="5"
                value={newOutlierX}
                onChange={(e) => setNewOutlierX(Number(e.target.value))}
              />
            </div>

            <div style={{ width: "200px" }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-bold text-secondary mb-0">
                  {t("correlation.comparison.outlierControls.labelY")}
                </label>
                <span className="small fw-bold text-primary">
                  {newOutlierY.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="70"
                max="90"
                step="0.5"
                value={newOutlierY}
                onChange={(e) => setNewOutlierY(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 mt-2 mt-md-0 pb-md-1">
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
              onClick={handleAddOutlier}
            >
              <i className="bi bi-plus-circle"></i>
              {t("correlation.comparison.outlierControls.addBtn")}
            </button>
            <ResetButton
              onClick={() => setOutliers([])}
              disabled={!hasOutliers}
              className="btn-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-4 text-center">
        <StatsBadge
          items={badgeItems}
          footer={
            hasOutliers ? (
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                {t("correlation.comparison.stats.originalData")} →{" "}
                {t("correlation.comparison.stats.withOutliers")}
              </span>
            ) : null
          }
        />
      </div>

      {/* Chart Visualization */}
      <div className="w-100 mx-auto" style={{ maxWidth: "1000px" }}>
        <StyledScatterChart
          data={chartData}
          xLabel={t("correlation.comparison.chart.xLabel")}
          yLabel={t("correlation.comparison.chart.yLabel")}
          xTooltipLabel={t("correlation.comparison.chart.xLabelShort")}
          yTooltipLabel={t("correlation.comparison.chart.yLabelShort")}
          xAxisDomain={[0, "auto"]}
          yAxisDomain={[70, 90]}
          fillColor="var(--bs-primary)"
          height={400}
          crosshairPoint={{ x: newOutlierX, y: newOutlierY }}
          crosshairColor="var(--bs-gray-600)"
        />
      </div>

      {/* Calculation Details Panel */}
      <div className="mt-4 w-100" style={{ maxWidth: "1000px" }}>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm rounded-pill px-4 mx-auto d-block"
          onClick={() => setShowCalc((v) => !v)}
        >
          {showCalc
            ? t("correlation.simulator.hideCalc")
            : t("correlation.simulator.showCalc")}
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateRows: showCalc ? "1fr" : "0fr",
            transition: "grid-template-rows 0.35s ease",
          }}
        >
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <CalcPanel title={t("correlation.simulator.calcTitle")}>
              {/* Pearson Formula */}
              <CalcPanel.Row formula="r = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i-\bar{x})^2 \cdot \sum(y_i-\bar{y})^2}}" />
              {calcDetails && (
                <CalcPanel.Row
                  formula={`r = \\frac{${calcDetails.sumDxDy.toFixed(2)}}{\\sqrt{${calcDetails.sumDx2.toFixed(2)} \\cdot ${calcDetails.sumDy2.toFixed(2)}}}`}
                />
              )}
              <CalcPanel.Row concrete formula={`r = ${pearsonR.toFixed(4)}`} />

              <CalcPanel.Divider />

              {/* Spearman Formula */}
              <CalcPanel.Row formula="r_s = 1 - \frac{6\sum d_i^2}{n(n^2-1)}" />
              {calcDetails && (
                <CalcPanel.Row
                  formula={`r_s = 1 - \\frac{6 \\cdot ${calcDetails.sumD2.toFixed(2)}}{${calcDetails.n}(${calcDetails.n}^2 - 1)}`}
                />
              )}
              <CalcPanel.Row
                concrete
                formula={`r_s = ${spearmanR.toFixed(4)}`}
              />

              <CalcPanel.Note>
                n = {chartData.length}
                {hasOutliers && (
                  <>
                    {" · "}
                    {t("correlation.comparison.stats.withOutliers")} (+
                    {outliers.length})
                  </>
                )}
              </CalcPanel.Note>
            </CalcPanel>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-4 w-100" style={{ minWidth: 0 }}>
          <DataPreviewTable
            data={tableData}
            columns={tableColumns}
            previewRows={5}
            title={t("correlation.comparison.table.title")}
            originalFileUrl={`${import.meta.env.BASE_URL}data/NUTS2_GDPPPP_LifeExpectancy.csv`}
            originalFileName="NUTS2_GDPPPP_LifeExpectancy.csv"
          />
        </div>
      </div>
    </div>
  );
}

export default CoefficientComparison;
