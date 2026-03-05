// src/components/charts/probability-distributions/discrete/PoissonChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import { poissonPMF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function PoissonChart() {
  const [lambda, setLambda] = useState(5); // Defaultná lambda
  const [hoverX, setHoverX] = useState(null);

  const { pmfData, cdfData } = useMemo(() => {
    const pmf = [];
    const cdf = [];
    // Dynamicky určíme hornú hranicu k (aby sme nevykresľovali zbytočné nuly)
    // Zoberieme lambda + 4 smerodajné odchýlky (odmocnina z lambda), minimálne však 15 stĺpcov
    const maxK = Math.max(15, Math.ceil(lambda + 4 * Math.sqrt(lambda)));

    for (let k = 0; k <= maxK; k++) {
      const prob = poissonPMF(k, lambda);
      pmf.push({ x: String(k), y: prob }); // String pre zosúladenie osí v BarCharte
      cdf.push({ x: k, p: prob }); // Číslo pre presné výpočty v šablóne CDF
    }
    return { pmfData: pmf, cdfData: cdf };
  }, [lambda]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Parameter Control (Slider) */}
      <div
        className="controls mb-4"
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

      {/* Prepojené grafy v spoločnom wrapperi */}
      <div className="charts-wrapper w-100">
        <div>
          <h6 className="mb-3 text-center">Pravdepodobnostná funkcia (PMF)</h6>
          <StyledBarChart
            data={pmfData}
            xLabel="k"
            yLabel="P(X=k)"
            yDomain={[0, "auto"]}
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

export default PoissonChart;
