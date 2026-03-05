// src/components/charts/probability-distributions/discrete/BernoulliChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import "../../../../styles/charts.css";

function BernoulliChart() {
  const [bernoulliP, setBernoulliP] = useState(0.25);
  const [hoverX, setHoverX] = useState(null);

  const handleBernoulliPChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      setBernoulliP(value);
    }
  };

  const pVal = Number(bernoulliP);
  const qVal = 1 - pVal;

  // Dáta pre pravdepodobnostnú funkciu (PMF)
  const pmfData = useMemo(
    () => [
      { x: "0", probability: qVal, fill: "var(--bs-info)" },
      { x: "1", probability: pVal, fill: "var(--bs-primary)" },
    ],
    [pVal, qVal],
  );

  // Dáta pre distribučnú funkciu (CDF) - šablóna očakáva pole objektov { x, p }
  const cdfData = useMemo(
    () => [
      { x: 0, p: qVal },
      { x: 1, p: pVal },
    ],
    [pVal, qVal],
  );

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládanie (slider) */}
      <div className="controls mb-4">
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
            style={{ width: "200px", cursor: "pointer", margin: "0 10px" }}
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

      {/* Prepojené grafy PMF a CDF */}
      <div className="charts-wrapper w-100">
        <div>
          <h6 className="mb-3 text-center">Pravdepodobnostná funkcia (PMF)</h6>
          <StyledBarChart
            data={pmfData}
            barDataKey="probability"
            xLabel="x"
            yLabel="P(X=x)"
            yDomain={[0, 1]}
            hoverX={hoverX}
            setHoverX={setHoverX}
            showReferenceArea={true}
            referenceAreaX1="0"
            referenceAreaX2={hoverX}
          />
        </div>

        <div>
          <h6 className="mb-3 text-center">Distribučná funkcia (CDF)</h6>
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

export default BernoulliChart;
