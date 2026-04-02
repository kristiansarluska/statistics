// src/components/charts/correlation/CoefficientComparison.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { InlineMath } from "react-katex";
import StyledScatterChart from "../helpers/StyledScatterChart";
import {
  calculatePearson,
  calculateSpearman,
} from "../../../utils/correlationMath";
import ResetButton from "../helpers/ResetButton";
import StatsBadge from "../../content/helpers/StatsBadge";

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

const CoefficientComparison = () => {
  const { t } = useTranslation();
  const [rawData, setRawData] = useState([]);
  const [outliers, setOutliers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const [newOutlierX, setNewOutlierX] = useState(250);
  const [newOutlierY, setNewOutlierY] = useState(72);

  const [showCrosshair, setShowCrosshair] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setShowCrosshair(true);
    const timer = setTimeout(() => setShowCrosshair(false), 2000);
    return () => clearTimeout(timer);
  }, [newOutlierX, newOutlierY]);

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

  const handleAddOutlier = () => {
    const newPoint = {
      x: newOutlierX,
      y: newOutlierY,
      name: t("correlation.comparison.fictionalOutlier"),
      fill: "var(--bs-secondary)", // ZMENA: Farba nového bodu
    };
    setOutliers([...outliers, newPoint]);
    setShowCrosshair(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOutliers([]);
  };

  const currentMaxX = Math.max(newOutlierX, ...chartData.map((d) => d.x));

  const crossSizeX = currentMaxX * 0.025;
  const crossSizeY = 20 * 0.04;

  const crosshairLines = showCrosshair
    ? [
        {
          segment: [
            { x: Math.max(0, newOutlierX - crossSizeX), y: newOutlierY },
            { x: newOutlierX + crossSizeX, y: newOutlierY },
          ],
          stroke: "var(--bs-secondary)",
          strokeWidth: 2, // Plná čiara bez strokeDasharray
        },
        {
          segment: [
            { x: newOutlierX, y: Math.max(70, newOutlierY - crossSizeY) },
            { x: newOutlierX, y: Math.min(90, newOutlierY + crossSizeY) },
          ],
          stroke: "var(--bs-secondary)",
          strokeWidth: 2, // Plná čiara bez strokeDasharray
        },
      ]
    : [];

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body p-4">
        <div className="row g-4 align-items-center mb-4 pb-4 border-bottom opacity-75">
          <div className="col-lg-3 text-center mb-3 mb-lg-0 border-end pe-4">
            <p className="small text-muted mb-2">
              {t("correlation.comparison.datasetLabel")}
            </p>
            <div className="btn-group w-100" role="group">
              <input
                type="radio"
                className="btn-check"
                id="dataset-all"
                name="datasetTab"
                checked={activeTab === "all"}
                onChange={() => handleTabChange("all")}
              />
              <label
                className="btn btn-outline-primary btn-sm"
                htmlFor="dataset-all"
              >
                {t("correlation.comparison.tabAll")}
              </label>

              <input
                type="radio"
                className="btn-check"
                id="dataset-south"
                name="datasetTab"
                checked={activeTab === "south_ro"}
                onChange={() => handleTabChange("south_ro")}
              />
              <label
                className="btn btn-outline-primary btn-sm"
                htmlFor="dataset-south"
              >
                {t("correlation.comparison.tabSouthRO")}
              </label>
            </div>
          </div>

          <div className="col-lg-6 mb-3 mb-lg-0 px-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center">
              <i className="bi bi-crosshair me-2 text-secondary"></i>
              {t("correlation.comparison.outlierControls.title")}
            </h6>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label small text-muted mb-1 d-flex justify-content-between">
                  <span>
                    {t("correlation.comparison.outlierControls.labelX")}
                  </span>
                  <span className="fw-bold text-dark">{newOutlierX}</span>
                </label>
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
              <div className="col-6">
                <label className="form-label small text-muted mb-1 d-flex justify-content-between">
                  <span>
                    {t("correlation.comparison.outlierControls.labelY")}
                  </span>
                  <span className="fw-bold text-dark">
                    {newOutlierY.toFixed(1)}
                  </span>
                </label>
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
          </div>

          <div className="col-lg-3 text-lg-end d-flex flex-row flex-lg-column gap-2 border-start ps-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddOutlier}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {t("correlation.comparison.outlierControls.addBtn")}
            </button>
            <ResetButton
              label={t("correlation.comparison.outlierControls.clearBtn")}
              onClick={() => setOutliers([])}
              disabled={outliers.length === 0}
              className="btn-sm"
            />
          </div>
        </div>

        <div className="w-100 mx-auto mb-5" style={{ maxWidth: "1000px" }}>
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
            crosshairPoint={
              showCrosshair ? { x: newOutlierX, y: newOutlierY } : null
            }
          />
        </div>

        <hr className="text-muted opacity-25" />

        <div className="row mt-4 pt-2 mb-0">
          <div className="col-md-6 mb-3">
            <div className="alert alert-light border border-primary-subtle shadow-sm h-100 mb-0 d-flex flex-column">
              <h6 className="fw-bold text-primary mb-3">
                {t("correlation.comparison.pearsonTitle")} (
                <InlineMath math="r" />)
              </h6>

              <div className="mb-3">
                <StatsBadge
                  items={[
                    {
                      label: t("correlation.comparison.stats.originalData"),
                      value: basePearson.toFixed(3),
                      color: "text-muted",
                    },
                    {
                      label: t("correlation.comparison.stats.withOutliers"),
                      value: pearsonR.toFixed(3),
                      color: "text-primary",
                      groupStart: true,
                    },
                  ]}
                />
              </div>

              <p className="small text-muted mt-auto mb-0">
                {t("correlation.comparison.pearsonDesc")}
              </p>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="alert alert-light border border-success-subtle shadow-sm h-100 mb-0 d-flex flex-column">
              <h6 className="fw-bold text-success mb-3">
                {t("correlation.comparison.spearmanTitle")} (
                <InlineMath math="r_s" />)
              </h6>

              <div className="mb-3">
                <StatsBadge
                  items={[
                    {
                      label: t("correlation.comparison.stats.originalData"),
                      value: baseSpearman.toFixed(3),
                      color: "text-muted",
                    },
                    {
                      label: t("correlation.comparison.stats.withOutliers"),
                      value: spearmanR.toFixed(3),
                      color: "text-success",
                      groupStart: true,
                    },
                  ]}
                />
              </div>

              <p className="small text-muted mt-auto mb-0">
                {t("correlation.comparison.spearmanDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoefficientComparison;
