// src/components/charts/probability-distributions/discrete/BernoulliChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "../../helpers/StyledBarChart";
import "../../../../styles/charts.css";

function BernoulliChart() {
  const [bernoulliP, setBernoulliP] = useState(0.25);

  const handleBernoulliPChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      setBernoulliP(value);
    }
  };

  const data = useMemo(
    () => [
      // Vloženie vlastných farieb (fill) priamo do dát
      { x: 0, probability: 1 - bernoulliP, fill: "var(--bs-info)" },
      { x: 1, probability: bernoulliP, fill: "var(--bs-primary)" },
    ],
    [bernoulliP],
  );

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládanie (slider) */}
      <div className="controls mb-3">
        <label className="d-flex align-items-center">
          Parameter p:
          <input
            type="range"
            className="form-range"
            min="0"
            max="1"
            step="0.01"
            value={bernoulliP}
            onChange={handleBernoulliPChange}
            style={{
              width: "200px",
              cursor: "pointer",
              marginLeft: "10px",
              marginRight: "10px",
              verticalAlign: "middle",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              minWidth: "40px",
              textAlign: "right",
            }}
          >
            {bernoulliP.toFixed(2)}
          </span>
        </label>
      </div>

      {/* Samotný graf */}
      <div
        className="chart-container"
        style={{ width: "100%", minWidth: "250px", maxWidth: "400px" }}
      >
        <div className="chart-title text-center">
          Alternatívne (Bernoulliho) rozdelenie
        </div>

        <StyledBarChart
          data={data}
          barDataKey="probability" /* KĽÚČOVÁ ZMENA: prispôsobené pre StyledBarChart */
          xLabel="x"
          yLabel="P(X=x)"
          yDomain={[0, 1]}
          maxBarSize={60}
        />
      </div>
    </div>
  );
}

export default BernoulliChart;
