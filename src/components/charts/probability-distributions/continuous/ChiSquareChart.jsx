// src/components/charts/probability-distributions/continuous/ChiSquareChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import { chiSquarePDF, chiSquareCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

/**
 * @component ChiSquareChart
 * @description Renders interactive probability density function (PDF) and cumulative distribution function (CDF) charts for the Chi-Square distribution. Allows users to adjust the degrees of freedom (k) via a slider.
 */
function ChiSquareChart() {
  const { t } = useTranslation();

  // Local state for degrees of freedom (k) and synchronized hover position
  const [k, setK] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  /**
   * Dynamically calculates data points for both PDF and CDF based on the current 'k'.
   * Also determines optimal axis boundaries to ensure the curve fits well within the view.
   */
  const { dataPDF, dataCDF, maxX, maxY_PDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];

    // Calculate a reasonable upper bound for the X-axis to capture the main body of the distribution
    const calculatedMaxX = k + 4 * Math.sqrt(2 * k);
    const step = calculatedMaxX / 200;

    // Generate 200 data points across the domain
    for (let i = 1; i <= 200; i++) {
      const x = i === 200 ? calculatedMaxX : i * step;
      const yPDF = chiSquarePDF(x, k);
      const yCDF = chiSquareCDF(x, k);

      // Filter out invalid/infinite values (especially relevant for k <= 2 near x=0)
      if (!isNaN(yPDF) && isFinite(yPDF)) {
        pdf.push({ x, y: yPDF });
      }
      cdf.push({ x, y: yCDF });
    }

    // Explicitly handle the origin (x=0)
    // For k > 2, the PDF starts at 0. For k <= 2, it tends to infinity, so we omit x=0 for the PDF.
    if (k > 2) {
      pdf.unshift({ x: 0, y: 0 });
      cdf.unshift({ x: 0, y: 0 });
    } else {
      cdf.unshift({ x: 0, y: 0 });
    }

    // Find the peak density value to scale the Y-axis correctly
    const calculatedMaxY = Math.max(...pdf.map((p) => p.y), 0);

    return {
      dataPDF: pdf,
      dataCDF: cdf,
      maxX: calculatedMaxX,
      maxY_PDF: calculatedMaxY > 0 ? calculatedMaxY * 1.1 : 0.5,
    };
  }, [k]);

  /**
   * Retrieves the exact cumulative probability (area under the curve) up to the hovered X value.
   * This acts as a lookup into the generated CDF dataset to provide accurate tooltip data for the PDF chart.
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
            htmlFor="kRange"
            className="form-label fw-bold mb-2 text-center small"
          >
            {t("components.probabilityCharts.chiSquare.df")}
            <span className="parameter-value">{k}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="kRange"
            min="1"
            max="30"
            step="1"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
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
            minX={0}
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
            minX={0}
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

export default ChiSquareChart;
