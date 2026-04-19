// src/components/charts/probability-distributions/continuous/StudentTChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import { studentTPDF, studentTCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

/**
 * @component StudentTChart
 * @description Renders interactive probability density function (PDF) and cumulative distribution function (CDF) charts for the Student's t-distribution.
 * Allows users to adjust the degrees of freedom (k) to see how the distribution approaches the Normal distribution.
 */
function StudentTChart() {
  const { t } = useTranslation();

  // Local state for degrees of freedom (k) and synchronized hover position
  const [k, setK] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  // Fixed domain boundaries for the charts
  const minX = -5;
  const maxX = 5;

  /**
   * Generates data points for both PDF and CDF based on the current degrees of freedom.
   * Computes 200 discrete points across the [-5, 5] domain.
   */
  const { dataPDF, dataCDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const step = (maxX - minX) / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : minX + i * step;
      pdf.push({ x, y: studentTPDF(x, k) });
      cdf.push({ x, y: studentTCDF(x, k) });
    }
    return { dataPDF: pdf, dataCDF: cdf };
  }, [k]);

  // Fixed Y-axis maximum for the PDF chart as t-distribution density peak is always below 0.4
  const maxY_PDF = 0.5;

  /**
   * Retrieves the exact cumulative probability (area under the curve) up to the hovered X value.
   * Finds the closest pre-calculated CDF point to sync the visualization.
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
            htmlFor="kRangeStudent"
            className="form-label fw-bold mb-2 text-center small"
          >
            {t("components.probabilityCharts.studentT.df")}
            <span className="parameter-value">{k}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="kRangeStudent"
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

export default StudentTChart;
