// src/components/charts/random-variable/distribution/DiscreteDistributionChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import ResetButton from "../../helpers/ResetButton";
import "../../../../styles/charts.css";

const DEFAULT_COUNTS = ["10", "20", "35", "20", "10", "5"];

/**
 * @component DiscreteDistributionChart
 * @description Allows users to define a custom discrete probability distribution by entering frequency counts for outcomes 0-5.
 * It automatically normalizes these counts into probabilities and visualizes them using PMF (bar chart) and CDF (step chart).
 */
function DiscreteDistributionChart() {
  const { t } = useTranslation();

  // Local state for hover synchronization and user-defined frequency counts
  const [hoverX, setHoverX] = useState(null);
  const [counts, setCounts] = useState(DEFAULT_COUNTS);

  // Check if current counts match the initial default values for the reset button state
  const isDefault = counts.every((val, index) => val === DEFAULT_COUNTS[index]);

  /**
   * Normalizes raw frequency counts into probabilities (p = count / total_sum).
   * This represents the underlying discrete distribution data.
   */
  const data = useMemo(() => {
    const numericCounts = counts.map((c) => parseInt(c, 10) || 0);
    const sum = numericCounts.reduce((a, b) => a + b, 0);

    return numericCounts.map((count, i) => ({
      x: i,
      p: sum === 0 ? 0 : count / sum,
    }));
  }, [counts]);

  /**
   * Formats normalized data for the Recharts BarChart.
   * Note: BarChart X-axis requires string keys for categorical-like display.
   */
  const pmfData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({ x: String(item.x), y: item.p }));
  }, [data]);

  const handleReset = () => setCounts(DEFAULT_COUNTS);

  // Determine the minimum X value for visual alignment of the reference area
  const minX = data.length > 0 ? data[0].x : 0;

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Input controls for defining outcome frequencies */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center align-items-end gap-2"
        style={{ width: "100%", maxWidth: "800px" }}
      >
        {counts.map((val, index) => (
          <div key={index} className="d-flex flex-column align-items-center">
            <label
              className="form-label mb-1 fw-bold"
              style={{ fontSize: "0.85rem" }}
            >
              x = {index}
            </label>
            <input
              type="number"
              min="0"
              className="form-control form-control-sm text-center shadow-sm"
              style={{ width: "60px" }}
              value={val}
              onChange={(e) => {
                const newCounts = [...counts];
                newCounts[index] = e.target.value;
                setCounts(newCounts);
              }}
            />
          </div>
        ))}

        <div className="ms-2">
          <ResetButton onClick={handleReset} disabled={isDefault} />
        </div>
      </div>

      <div className="charts-wrapper w-100">
        {/* Probability Mass Function (PMF) Visualization */}
        <div>
          <h6 className="mb-3 text-center">
            {t("components.probabilityCharts.pmfTitle")}
          </h6>
          <StyledBarChart
            data={pmfData}
            xLabel="x"
            yLabel="P(X=x)"
            yDomain={[0, "auto"]}
            hoverX={hoverX}
            setHoverX={setHoverX}
            showReferenceArea={true}
            referenceAreaX1={String(minX)}
            referenceAreaX2={hoverX}
          />
        </div>

        {/* Cumulative Distribution Function (CDF) Visualization */}
        <div>
          <h6 className="mb-3 text-center">
            {t("components.probabilityCharts.cdfTitle")}
          </h6>
          <StyledDiscreteCDFChart
            data={data}
            hoverX={hoverX}
            setHoverX={setHoverX}
          />
        </div>
      </div>
    </div>
  );
}

export default DiscreteDistributionChart;
