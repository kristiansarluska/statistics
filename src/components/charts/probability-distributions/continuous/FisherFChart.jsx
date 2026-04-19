// src/components/charts/probability-distributions/continuous/FisherFChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";
import StyledLineChart from "../../helpers/StyledLineChart";
import { fisherFPDF, fisherFCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

/**
 * @component FisherFChart
 * @description Renders interactive probability density function (PDF) and cumulative distribution function (CDF) charts for the Fisher-Snedecor F-distribution. Allows users to adjust the degrees of freedom (d1, d2) via sliders.
 */
function FisherFChart() {
  const { t } = useTranslation();

  // Local state for degrees of freedom parameters and synchronized hover position
  const [d1, setD1] = useState(4);
  const [d2, setD2] = useState(10);
  const [hoverX, setHoverX] = useState(null);

  // Fixed domain boundaries for the charts
  const minX = 0;
  const maxX = 5;

  /**
   * Generates data points for both PDF and CDF based on current degrees of freedom.
   * Computes 200 discrete points across the [0, 5] domain.
   */
  const { dataPDF, dataCDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const step = maxX / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : i * step;
      // Prevent division by zero or evaluation errors exactly at the origin
      const safeX = x === 0 ? 0.0001 : x;

      let yPDF = fisherFPDF(safeX, d1, d2);

      // Clamp extremely high density values near zero (occurring with small d1) for better visual scaling
      if (yPDF > 2.5) yPDF = 2.5;

      pdf.push({ x, y: yPDF });
      cdf.push({ x, y: fisherFCDF(x, d1, d2) });
    }
    return { dataPDF: pdf, dataCDF: cdf };
  }, [d1, d2]);

  /**
   * Calculates a dynamic Y-axis maximum for the PDF chart.
   * Ignores the initial asymptote peaks (x < 0.1) to ensure the main body of the distribution remains visible.
   */
  const maxY_PDF = useMemo(() => {
    const peak = Math.max(...dataPDF.filter((d) => d.x >= 0.1).map((d) => d.y));
    if (peak > 0.85) {
      return 1.2;
    }
    return 1.0;
  }, [dataPDF]);

  /**
   * Retrieves the exact cumulative probability (area under the curve) up to the hovered X value.
   * Used to display the precise area value in the synchronized tooltip.
   */
  const currentArea = useMemo(() => {
    if (hoverX === null || !dataCDF || dataCDF.length === 0) return null;
    let closest = dataCDF[0];
    let minDiff = Math.abs(dataCDF[0].x - hoverX);

    for (let i = 1; i < dataCDF.length; i++) {
      const diff = Math.abs(dataCDF[i].x - hoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = dataCDF[i];
      }
    }
    return closest.y;
  }, [hoverX, dataCDF]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Parameter Controls Panel */}
      <div className="controls mb-4 row justify-content-center gx-4 gy-3 w-100 mx-0">
        <div className="col-10 col-sm-5 col-md-4 col-lg-3 d-flex flex-column align-items-center">
          <label
            htmlFor="d1Range"
            className="form-label fw-bold mb-2 text-center small"
          >
            <span>
              <Trans
                i18nKey="components.probabilityCharts.fisherF.d1_control"
                components={{
                  m1: <InlineMath math="\nu_1" />,
                }}
              />
            </span>
            <span className="text-primary fw-bold">{d1}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="d1Range"
            min="1"
            max="30"
            step="1"
            value={d1}
            onChange={(e) => setD1(Number(e.target.value))}
          />
        </div>

        <div className="col-10 col-sm-5 col-md-4 col-lg-3 d-flex flex-column align-items-center">
          <label
            htmlFor="d2Range"
            className="form-label fw-bold mb-2 text-center small"
          >
            <span>
              <Trans
                i18nKey="components.probabilityCharts.fisherF.d2_control"
                components={{
                  m2: <InlineMath math="\nu_2" />,
                }}
              />
            </span>
            <span className="text-primary fw-bold">{d2}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="d2Range"
            min="1"
            max="30"
            step="1"
            value={d2}
            onChange={(e) => setD2(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Chart Visualizations */}
      <div className="charts-wrapper w-100">
        {/* Probability Density Function (PDF) Chart */}
        <div>
          <StyledLineChart
            data={dataPDF}
            areaValue={currentArea}
            title={t("components.probabilityCharts.pdfTitle")}
            xLabel="x"
            yLabel="f(x)"
            lineClass="chart-line-primary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            yAxisDomain={[0, maxY_PDF]}
            type="pdf"
            showReferenceArea={true}
          />
        </div>

        {/* Cumulative Distribution Function (CDF) Chart */}
        <div>
          <StyledLineChart
            data={dataCDF}
            areaValue={currentArea}
            title={t("components.probabilityCharts.cdfTitle")}
            xLabel="x"
            yLabel="F(x)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            yAxisDomain={[0, 1.1]}
            type="cdf"
            showReferenceArea={false}
          />
        </div>
      </div>
    </div>
  );
}

export default FisherFChart;
