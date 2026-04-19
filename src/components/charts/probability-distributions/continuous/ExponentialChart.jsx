// src/components/charts/probability-distributions/continuous/ExponentialChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import {
  exponentialPDF,
  exponentialCDF,
} from "../../../../utils/distributions";
import "../../../../styles/charts.css";

/**
 * @component ExponentialChart
 * @description Renders interactive probability density function (PDF) and cumulative distribution function (CDF) charts for the Exponential distribution. Allows users to adjust the rate parameter (λ) via a slider.
 */
function ExponentialChart() {
  const { t } = useTranslation();

  // Local state for the rate parameter (λ) and synchronized hover position
  const [lambda, setLambda] = useState(1);
  const [hoverX, setHoverX] = useState(null);

  // Fixed domain boundaries for the charts
  const minX = 0;
  const maxX = 10;

  /**
   * Generates data points for both PDF and CDF based on the current lambda.
   * Calculates 200 discrete points across the fixed [0, 10] domain.
   */
  const { dataPDF, dataCDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const step = maxX / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : i * step;
      pdf.push({ x, y: exponentialPDF(x, lambda) });
      cdf.push({ x, y: exponentialCDF(x, lambda) });
    }
    return { dataPDF: pdf, dataCDF: cdf };
  }, [lambda]);

  /**
   * Dynamically calculates the Y-axis maximum for the PDF chart.
   * Since the exponential PDF peaks at x=0 with a value of λ, we scale the axis relative to λ.
   */
  const maxY_PDF = useMemo(() => {
    return (Math.floor(lambda * 1.1 * 10) + 1) / 10;
  }, [lambda]);

  /**
   * Retrieves the cumulative probability (area under the curve) up to the hovered X value.
   * Finds the closest pre-calculated CDF point to avoid recalculating the integral on every mouse move.
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
      {/* Parameter Control Panel */}
      <div className="controls mb-4 row justify-content-center w-100 mx-0">
        <div className="col-10 col-sm-8 col-md-5 col-lg-4 d-flex flex-column align-items-center">
          <label
            htmlFor="lambdaRangeExp"
            className="form-label fw-bold mb-2 text-center small"
          >
            {t("components.probabilityCharts.poisson.paramLambda")}
            <span className="parameter-value">{lambda.toFixed(1)}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="lambdaRangeExp"
            min="0.1"
            max="5"
            step="0.1"
            value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
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

export default ExponentialChart;
