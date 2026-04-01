// src/components/charts/correlation/CoefficientComparison.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
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

  // Hodnoty pre slider nového outlieru
  const [newOutlierX, setNewOutlierX] = useState(250);
  const [newOutlierY, setNewOutlierY] = useState(72);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/NUTS2_GDPPPP_LifeExpectancy.csv`)
      .then((res) => {
        if (!res.ok) throw new Error("Súbor sa nepodarilo načítať");
        return res.text();
      })
      .then((csvText) => {
        const rows = parseCSV(csvText);
        // Header: NUTS2_Code, Country, Region_Name, Life_Expectancy, GDP_PPS
        const parsed = rows
          .slice(1)
          .map((row) => ({
            id: row[0],
            country: row[1],
            name: row[2], // Region Name - tooltip ho teraz nájde
            y: parseFloat(row[3]), // Life Expectancy
            x: parseFloat(row[4]), // GDP
          }))
          .filter((d) => !isNaN(d.x) && !isNaN(d.y));
        setRawData(parsed);
      })
      .catch((err) => console.error("Chyba pri načítaní dát:", err));
  }, []);

  // Pôvodné dáta bez outlierov
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

  // Dáta spojené s pridanými outliermi
  const chartData = useMemo(
    () => [...baseData, ...outliers],
    [baseData, outliers],
  );

  // Výpočty PÔVODNÝCH koeficientov (len z baseData)
  const basePearson = useMemo(() => calculatePearson(baseData), [baseData]);
  const baseSpearman = useMemo(() => calculateSpearman(baseData), [baseData]);

  // Výpočty NOVÝCH koeficientov (z chartData)
  const pearsonR = useMemo(() => calculatePearson(chartData), [chartData]);
  const spearmanR = useMemo(() => calculateSpearman(chartData), [chartData]);

  const handleAddOutlier = () => {
    const newPoint = {
      x: newOutlierX,
      y: newOutlierY,
      name: "Fiktívny outlier",
      fill: "var(--bs-danger)",
    };
    setOutliers([...outliers, newPoint]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOutliers([]);
  };

  return (
    <div className="card shadow-sm mt-4 border-2 border-primary border-top-0 border-bottom-0 border-end-0">
      <div className="card-body p-4">
        {/* Kontroly - Horný riadok */}
        <div className="row g-4 align-items-center mb-4 pb-4 border-bottom opacity-75">
          <div className="col-lg-3 text-center mb-3 mb-lg-0 border-end pe-4">
            <p className="small text-muted mb-2">
              Dataset (zmena vymaže fiktívne)
            </p>
            <div
              className="btn-group btn-group-sm w-100 flex-wrap"
              role="group"
            >
              <button
                className={`btn ${activeTab === "all" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => handleTabChange("all")}
              >
                {t("correlation.comparison.tabAll")}
              </button>

              <button
                className={`btn ${activeTab === "south_ro" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => handleTabChange("south_ro")}
              >
                {t("correlation.comparison.tabSouthRO")}
              </button>
            </div>
          </div>

          <div className="col-lg-6 mb-3 mb-lg-0 px-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center">
              <i className="bi bi-crosshair me-2 text-danger"></i>
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
                  max="350"
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
                  min="65"
                  max="95"
                  step="0.5"
                  value={newOutlierY}
                  onChange={(e) => setNewOutlierY(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-3 text-lg-end d-flex flex-row flex-lg-column gap-2 border-start ps-4">
            <button
              className="btn btn-outline-danger btn-sm"
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

        {/* Graf - Stredná časť */}
        <div className="w-100 mx-auto mb-5" style={{ maxWidth: "1000px" }}>
          <StyledScatterChart
            data={chartData}
            xLabel="HDP (PPS % priemeru EÚ)"
            yLabel="Stredná dĺžka života (roky)"
            xAxisDomain={[0, "auto"]}
            yAxisDomain={[70, 90]} // Pevné osky vyzerajú lepšie
            fillColor="var(--bs-primary)"
            height={400}
            // ZMENA: X, Y osky v tooltipe sú teraz bez jednotiek, tie sú v Labeli grafu
          />
        </div>

        <hr className="text-muted opacity-25" />

        {/* Výsledky - Dolná časť s využitím StatsBadge a InlineMath */}
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
                      label: "Pôvodné dáta",
                      value: basePearson.toFixed(3),
                      color: "text-muted",
                    },
                    {
                      label: "S outliermi",
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
                      label: "Pôvodné dáta",
                      value: baseSpearman.toFixed(3),
                      color: "text-muted",
                    },
                    {
                      label: "S outliermi",
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
