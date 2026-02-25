// src/components/charts/probability-distributions/discrete/PoissonChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "../../helpers/StyledBarChart";
import { poissonPMF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function PoissonChart() {
  const [lambda, setLambda] = useState(5); // Defaultná lambda

  const chartData = useMemo(() => {
    const data = [];
    // Dynamicky určíme hornú hranicu k (aby sme nevykresľovali zbytočné nuly)
    // Zoberieme lambda + 4 smerodajné odchýlky (odmocnina z lambda), minimálne však 15 stĺpcov
    const maxK = Math.max(15, Math.ceil(lambda + 4 * Math.sqrt(lambda)));

    for (let k = 0; k <= maxK; k++) {
      data.push({ x: k, y: poissonPMF(k, lambda) });
    }
    return data;
  }, [lambda]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Parameter Control (Slider) */}
      <div
        className="controls mb-3"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <label htmlFor="lambdaRange" className="form-label w-100 text-center">
          Parameter (λ): <strong>{lambda.toFixed(1)}</strong>
        </label>
        <input
          type="range"
          className="form-range"
          id="lambdaRange"
          min="0.1"
          max="30"
          step="0.1"
          value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
        />
      </div>

      {/* Render Chart */}
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <StyledBarChart
          data={chartData}
          xLabel="k (počet výskytov)"
          yLabel="P(X=k)"
          yDomain={[0, "auto"]}
        />
      </div>
    </div>
  );
}

export default PoissonChart;
