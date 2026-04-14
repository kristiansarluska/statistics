// src/components/charts/correlation/CorrelationChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";
import StyledScatterChart from "../helpers/StyledScatterChart";
import StatsBadge from "../../content/helpers/StatsBadge";
import CalcPanel from "../../content/helpers/CalcPanel";
import {
  generateCorrelatedData,
  calculatePearson,
  calculateCorrelationSignificance,
} from "../../../utils/correlationMath";

// Fixed axis domain — prevents chart from jumping when data changes
const AXIS_DOMAIN = [0, 100];

const CorrelationChart = () => {
  const { t } = useTranslation();

  const [targetR, setTargetR] = useState(0.8);
  const [n, setN] = useState(50);
  const [regenTrigger, setRegenTrigger] = useState(0);
  const [showCalc, setShowCalc] = useState(false);

  const data = useMemo(
    () => generateCorrelatedData(n, targetR),
    [targetR, n, regenTrigger],
  );

  const actualR = useMemo(() => calculatePearson(data), [data]);

  const { tStat, pValue } = useMemo(
    () => calculateCorrelationSignificance(actualR, n),
    [actualR, n],
  );

  const alpha = 0.05;
  const isSignificant = pValue < alpha;

  const actualRValue = actualR.toFixed(3);

  const badgeItems = [
    {
      label: t("correlation.simulator.badgeTargetR"),
      value: targetR.toFixed(2),
      color: "text-body",
      groupStart: true,
    },
    {
      label: t("correlation.simulator.badgeActualR"),
      value: actualRValue,
      groupStart: false,
    },
    {
      label: "t",
      value: tStat.toFixed(3),
      color: "text-primary",
      groupStart: true,
    },
    {
      label: "p",
      value: pValue < 0.001 ? "< 0.001" : pValue.toFixed(4),
      color: isSignificant ? "text-success" : "text-danger",
      groupStart: false,
    },
    {
      label: "n",
      value: n,
      color: "text-body",
      groupStart: true,
    },
  ];

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      {/* Controls — equal-width slider columns on desktop, stacked on mobile */}
      <div className="mb-4 w-100" style={{ maxWidth: "800px" }}>
        {/* Grid: 2 equal columns on md+, 1 column on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          {/* targetR slider */}
          <div className="d-flex flex-column align-items-center">
            <label
              className="form-label fw-bold mb-2 text-center"
              style={{ fontSize: "0.9rem" }}
            >
              {t("correlation.simulator.targetR")}
              <span
                className="text-primary ms-1"
                style={{
                  display: "inline-block",
                  width: "3rem",
                  textAlign: "left",
                }}
              >
                {targetR.toFixed(2)}
              </span>
            </label>
            <input
              type="range"
              className="form-range"
              min="-1"
              max="1"
              step="0.01"
              value={targetR}
              onChange={(e) => setTargetR(parseFloat(e.target.value))}
              style={{ maxWidth: "250px", width: "100%" }}
            />
          </div>

          {/* n slider */}
          <div className="d-flex flex-column align-items-center">
            <label
              className="form-label fw-bold mb-2 text-center"
              style={{ fontSize: "0.9rem" }}
            >
              {t("correlation.simulator.pointCount")}
              <span
                className="text-primary ms-1"
                style={{
                  display: "inline-block",
                  width: "2.5rem",
                  textAlign: "left",
                }}
              >
                {n}
              </span>
            </label>
            <input
              type="range"
              className="form-range"
              min="5"
              max="200"
              step="1"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              style={{ maxWidth: "250px", width: "100%" }}
            />
          </div>
        </div>

        {/* Generate button — centered below the grid */}
        <div className="text-center">
          <button
            type="button"
            className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
            onClick={() => setRegenTrigger((prev) => prev + 1)}
          >
            {t("correlation.simulator.generateNew")}
          </button>
        </div>
      </div>

      {/* Stats badge — now using the shared component */}
      <div className="mb-4 text-center">
        <StatsBadge items={badgeItems} />
      </div>

      {/* Chart */}
      <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <StyledScatterChart
          data={data}
          xLabel={t("correlation.simulator.xAxisLabel")}
          yLabel={t("correlation.simulator.yAxisLabel")}
          xAxisDomain={AXIS_DOMAIN}
          yAxisDomain={AXIS_DOMAIN}
          xTickFormatter={(v) => v}
          yTickFormatter={(v) => v * 2}
          fillColor="var(--bs-primary)"
          height={300}
        />
      </div>

      <div
        className="alert alert-info border-0 shadow-sm mt-3 mb-2 small d-flex align-items-start gap-3"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <i className="bi bi-info-circle-fill text-primary fs-5 mt-1"></i>
        <div>
          <Trans
            i18nKey="correlation.simulator.rDiffInfo"
            components={{ bold: <strong /> }}
          />
        </div>
      </div>

      {/* Calculation toggle — shown BEFORE result block */}
      <div className="mt-4" style={{ maxWidth: "800px", width: "100%" }}>
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
          <div style={{ overflow: "hidden" }}>
            <CalcPanel title={t("correlation.simulator.calcTitle")}>
              {/* T statistic */}
              <CalcPanel.Row formula="T = \frac{r \cdot \sqrt{n - 2}}{\sqrt{1 - r^2}} \sim t_{n-2}" />
              <CalcPanel.Row
                concrete
                formula={`T = \\frac{${actualR.toFixed(3)} \\cdot \\sqrt{${n} - 2}}{\\sqrt{1 - (${actualR.toFixed(3)})^2}} = ${tStat.toFixed(3)}`}
              />

              <CalcPanel.Divider />

              {/* p-value */}
              <CalcPanel.Row formula="p = 2 \cdot P(T_{n-2} > |T|) = 2 \cdot (1 - F_{t}(|T|))" />
              <CalcPanel.Row
                concrete
                formula={`p = 2 \\cdot (1 - F_{${n - 2}}(${Math.abs(tStat).toFixed(3)})) = ${pValue < 0.001 ? "< 0{,}001" : pValue.toFixed(4)}`}
              />
              <CalcPanel.Note>
                {t("correlation.simulator.calcDesc")}{" "}
                <InlineMath math={`df = n - 2 = ${n - 2}`} />
              </CalcPanel.Note>
            </CalcPanel>
          </div>
        </div>
      </div>

      {/* Significance result — green = significant, red = not significant */}
      <div
        className={`alert ${isSignificant ? "alert-success" : "alert-danger"} shadow-sm border-0 mt-3 mb-0 text-center`}
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <strong>
          {isSignificant
            ? t("correlation.simulator.significant")
            : t("correlation.simulator.insignificant")}
        </strong>
        <div className="small mt-1 opacity-75">
          {isSignificant
            ? t("correlation.simulator.significantDesc", { alpha })
            : t("correlation.simulator.insignificantDesc", { alpha })}
        </div>
      </div>
    </div>
  );
};

export default CorrelationChart;
