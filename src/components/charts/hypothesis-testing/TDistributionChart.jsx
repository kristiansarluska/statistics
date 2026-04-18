// src/components/charts/hypothesis-testing/TDistributionChart.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReferenceLine, ReferenceArea } from "recharts";
import StyledLineChart from "../helpers/StyledLineChart";

function TDistributionChart({ data, tValue, tCrit, df, isSignificant }) {
  const { t } = useTranslation();
  const [hoverX, setHoverX] = useState(null);

  if (!data || data.length === 0) return null;

  return (
    <div>
      <div className="chart-title">
        {t("hypothesisTesting.tTestDashboard.charts.tChartTitle", { df })}
      </div>

      <div className="d-flex justify-content-center gap-4 mb-1">
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
        <ReferenceArea
          x1={data[0]?.x}
          x2={-tCrit}
          fill="var(--bs-danger)"
          fillOpacity={0.15}
        />
        <ReferenceArea
          x1={tCrit}
          x2={data[data.length - 1]?.x}
          fill="var(--bs-danger)"
          fillOpacity={0.15}
        />
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
