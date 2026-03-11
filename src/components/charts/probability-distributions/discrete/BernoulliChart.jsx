// src/components/charts/probability-distributions/discrete/BernoulliChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import "../../../../styles/charts.css";

function BernoulliChart() {
  const { t } = useTranslation();
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

  const pmfData = useMemo(
    () => [
      { x: "0", "P(x)": qVal, fill: "var(--bs-info)" },
      { x: "1", "P(x)": pVal, fill: "var(--bs-primary)" },
    ],
    [pVal, qVal],
  );

  const cdfData = useMemo(
    () => [
      { x: 0, p: qVal },
      { x: 1, p: pVal },
    ],
    [pVal, qVal],
  );

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      <div className="controls mb-4">
        <label className="d-flex align-items-center">
          {t("components.probabilityCharts.bernoulli.paramP")}
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
            style={{ minWidth: "40px", textAlign: "right" }}
            className="ms-2 fw-bold"
          >
            {bernoulliP.toFixed(2)}
          </span>
        </label>
      </div>

      <div className="charts-wrapper w-100">
        <div>
          <h6 className="mb-3 text-center">
            {t("components.probabilityCharts.pmfTitle")}
          </h6>
          <StyledBarChart
            data={pmfData}
            barDataKey="P(x)"
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

export default BernoulliChart;
