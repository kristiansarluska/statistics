// src/components/charts/hypothesis-testing/TDistributionChart.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReferenceLine, ReferenceArea } from "recharts";
import StyledLineChart from "../helpers/StyledLineChart";

/**
 * @component TDistributionChart
 * @description Renders a Student's t-distribution chart for hypothesis testing. Visually highlights critical (rejection) regions and the calculated t-statistic.
 * @param {Object} props
 * @param {Array} props.data - Dataset containing x (t-values) and y (probability density) coordinates.
 * @param {number} props.tValue - The calculated test statistic value.
 * @param {number} props.tCrit - The critical t-value defining the boundaries of rejection regions.
 * @param {number} props.df - Degrees of freedom associated with the t-distribution.
 * @param {boolean} props.isSignificant - Flag indicating if the result is statistically significant (determines marker color).
 */
function TDistributionChart({ data, tValue, tCrit, df, isSignificant }) {
  const { t } = useTranslation();
  // Local state for synchronized crosshair highlighting across charts
  const [hoverX, setHoverX] = useState(null);

  // Safeguard against rendering errors on empty data
  if (!data || data.length === 0) return null;

  return (
    <div>
      {/* Chart Title with dynamic degrees of freedom */}
      <div className="chart-title">
        {t("hypothesisTesting.tTestDashboard.charts.tChartTitle", { df })}
      </div>

      {/* Legend Container */}
      <div className="d-flex justify-content-center gap-4 mb-1">
        {/* Test Statistic Legend */}
        <span className="small d-flex align-items-center gap-1">
          <svg width="18" height="10">
            <line
              x1="0"
              y1="5"
              x2="18"
              y2="5"
              stroke={isSignificant ? "var(--bs-danger)" : "var(--bs-success)"}
              strokeWidth="2"
            />
          </svg>
          <span
            style={{
              color: isSignificant ? "var(--bs-danger)" : "var(--bs-success)",
            }}
          >
            t = {tValue.toFixed(2)}
          </span>
        </span>

        {/* Critical Area Legend */}
        <span className="small d-flex align-items-center gap-1">
          <svg width="18" height="10">
            <rect
              x="0"
              y="0"
              width="18"
              height="10"
              fill="var(--bs-danger)"
              fillOpacity="0.15"
            />
          </svg>
          <span className="text-muted">
            {t("hypothesisTesting.tTestDashboard.charts.tChartCritArea")}
          </span>
        </span>
      </div>

      <StyledLineChart
        data={data}
        title=""
        xLabel="t"
        yLabel="f(t)"
        lineClass="chart-line-secondary"
        hoverX={hoverX}
        setHoverX={setHoverX}
        minX={data[0]?.x}
        maxX={data[data.length - 1]?.x}
        type="pdf"
        showReferenceArea={false}
      >
        {/* Left tail critical (rejection) region */}
        <ReferenceArea
          x1={data[0]?.x}
          x2={-tCrit}
          fill="var(--bs-danger)"
          fillOpacity={0.15}
        />
        {/* Right tail critical (rejection) region */}
        <ReferenceArea
          x1={tCrit}
          x2={data[data.length - 1]?.x}
          fill="var(--bs-danger)"
          fillOpacity={0.15}
        />
        {/* Actual calculated t-statistic reference line */}
        <ReferenceLine
          x={tValue}
          stroke={isSignificant ? "var(--bs-danger)" : "var(--bs-success)"}
          strokeWidth={2}
          label={{
            value: `t = ${tValue.toFixed(2)}`,
            position: "top",
            fill: isSignificant ? "var(--bs-danger)" : "var(--bs-success)",
            fontWeight: "bold",
          }}
        />
      </StyledLineChart>
    </div>
  );
}

export default TDistributionChart;
