// src/components/charts/random-variable/distribution/SimulatedPDFChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import BackgroundArea from "../../helpers/BackgroundArea";
import { normalPDF } from "../../../../utils/distributions";
import ResetButton from "../../helpers/ResetButton";

function SimulatedPDFChart() {
  const { t } = useTranslation();
  const [hoverX, setHoverX] = useState(null);
  const [measurements, setMeasurements] = useState([]);

  const m = 0;
  const s = 2.5;
  const minX = m - 4 * s;
  const maxX = m + 4 * s;

  const addMeasurements = (count) => {
    const newMeasurements = [];
    for (let i = 0; i < count; i++) {
      let u = 0,
        v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      newMeasurements.push(num * s + m);
    }
    setMeasurements((prev) => [...prev, ...newMeasurements]);
  };

  const handleReset = () => setMeasurements([]);

  const { dataPDF } = useMemo(() => {
    const step = (maxX - minX) / 200;
    const pdf = [];
    const total = measurements.length;
    const numBins = 40;
    const binWidth = (maxX - minX) / numBins;
    const bins = Array(numBins).fill(0);

    if (total > 0) {
      measurements.forEach((val) => {
        if (val >= minX && val <= maxX) {
          const binIdx = Math.min(
            Math.floor((val - minX) / binWidth),
            numBins - 1,
          );
          bins[binIdx]++;
        }
      });
    }

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : minX + i * step;
      let histY = null;
      if (total > 0) {
        const binIdx = Math.min(Math.floor((x - minX) / binWidth), numBins - 1);
        histY = bins[binIdx] / (total * binWidth);
      }
      pdf.push({ x, y: normalPDF(x, m, s), histY });
    }

    return { dataPDF: pdf };
  }, [minX, maxX, measurements]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      <div className="controls mb-4 d-flex flex-wrap justify-content-center align-items-center gap-3">
        <div className="btn-group shadow-sm rounded-pill overflow-hidden">
          <button
            className="btn btn-primary btn-sm px-3"
            style={{ borderRight: "1px solid rgba(255,255,255,0.3)" }}
            onClick={() => addMeasurements(1)}
          >
            + 1
          </button>
          <button
            className="btn btn-primary btn-sm px-3"
            style={{ borderRight: "1px solid rgba(255,255,255,0.3)" }}
            onClick={() => addMeasurements(10)}
          >
            + 10
          </button>
          <button
            className="btn btn-primary btn-sm px-3"
            onClick={() => addMeasurements(100)}
          >
            + 100
          </button>
        </div>

        <div
          className="fw-bold text-success bg-success-subtle px-3 py-1 rounded-pill shadow-sm"
          style={{ fontSize: "0.9rem" }}
        >
          {t("components.randomVariableCharts.measurements", {
            count: measurements.length,
          })}
        </div>

        <ResetButton
          onClick={handleReset}
          disabled={measurements.length === 0}
        />
      </div>

      <div className="charts-wrapper w-100" style={{ maxWidth: "800px" }}>
        <StyledLineChart
          data={dataPDF}
          hoverX={hoverX}
          setHoverX={setHoverX}
          title={t("components.randomVariableCharts.simulatedPDF.title")}
          xLabel={t("components.randomVariableCharts.simulatedPDF.xLabel")}
          yLabel={t("components.randomVariableCharts.simulatedPDF.yLabel")}
          lineClass="chart-line-primary"
          minX={minX}
          maxX={maxX}
          type="pdf"
          showReferenceArea={true}
        >
          {measurements.length > 0 && (
            <BackgroundArea
              dataKey="histY"
              type="stepBefore"
              color="var(--bs-gray-400)"
              fillOpacity={0.05}
              strokeWidth={1}
              isAnimationActive={true}
              animationDuration={500}
            />
          )}
        </StyledLineChart>
      </div>
    </div>
  );
}

export default SimulatedPDFChart;
