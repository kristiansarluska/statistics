// src/components/charts/probability-distributions/discrete/UniformDiscreteChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import "../../../../styles/charts.css";

/**
 * @component UniformDiscreteChart
 * @description Renders interactive Probability Mass Function (PMF) and Cumulative Distribution Function (CDF) charts for the Discrete Uniform distribution.
 * Users can adjust the number of possible outcomes (n) via a slider.
 */
function UniformDiscreteChart() {
  const { t } = useTranslation();

  // State for the number of outcomes (n) and synchronized hover state across charts
  const [n, setN] = useState(6);
  const [hoverX, setHoverX] = useState(null);

  // Constant probability for each outcome in a uniform distribution
  const p = 1 / n;

  /**
   * Generates PMF and CDF datasets based on the current number of outcomes 'n'.
   * PMF uses string keys for bar chart labels, while CDF uses numeric values for step function logic.
   */
  const { pmfData, cdfData } = useMemo(() => {
    const pmf = [];
    const cdf = [];
    for (let i = 1; i <= n; i++) {
      pmf.push({ x: String(i), y: p });
      cdf.push({ x: i, p: p });
    }
    return { pmfData: pmf, cdfData: cdf };
  }, [n, p]);

  // Calculate dynamic Y-axis maximum for the PMF chart to maintain visual clarity
  const maxY = (Math.floor(p * 10) + 1) / 10;

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Parameter Control Panel */}
      <div className="controls mb-4 row justify-content-center w-100 mx-0">
        <div className="col-10 col-sm-8 col-md-5 col-lg-4 d-flex flex-column align-items-center">
          <label
            htmlFor="nRange"
            className="form-label fw-bold mb-2 text-center small"
          >
            {t("components.probabilityCharts.uniform.outcomes")}
            <span className="parameter-value">{n}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="nRange"
            min="2"
            max="10"
            step="1"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
          {/* Helper text showing the exact probability calculation */}
          <div className="text-center mt-2 small text-muted">
            {t("components.probabilityCharts.uniform.probCalc", {
              n,
              p: p.toFixed(4),
            })}
          </div>
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
            yDomain={[0, maxY]}
            hoverX={hoverX}
            setHoverX={setHoverX}
            showReferenceArea={true}
            referenceAreaX1="1"
            referenceAreaX2={hoverX}
          />
        </div>

        {/* Cumulative Distribution Function (CDF) Visualization */}
        <div>
          <h6 className="mb-3 text-center">
            {t("components.probabilityCharts.cdfTitle")}
          </h6>
          <StyledDiscreteCDFChart
            data={cdfData}
            hoverX={hoverX}
            setHoverX={setHoverX}
          />
        </div>
      </div>
    </div>
  );
}

export default UniformDiscreteChart;
