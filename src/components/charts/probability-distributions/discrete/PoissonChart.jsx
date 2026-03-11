// src/components/charts/probability-distributions/discrete/PoissonChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import { poissonPMF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function PoissonChart() {
  const { t } = useTranslation();
  const [lambda, setLambda] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  const { pmfData, cdfData } = useMemo(() => {
    const pmf = [];
    const cdf = [];
    const maxK = Math.max(15, Math.ceil(lambda + 4 * Math.sqrt(lambda)));

    for (let k = 0; k <= maxK; k++) {
      const prob = poissonPMF(k, lambda);
      pmf.push({ x: String(k), y: prob });
      cdf.push({ x: k, p: prob });
    }
    return { pmfData: pmf, cdfData: cdf };
  }, [lambda]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      <div
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <label htmlFor="lambdaRange" className="form-label w-100 text-center">
          {t("components.probabilityCharts.poisson.paramLambda")}{" "}
          <strong>{lambda.toFixed(1)}</strong>
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

      <div className="charts-wrapper w-100">
        <div>
          <h6 className="mb-3 text-center">
            {t("components.probabilityCharts.pmfTitle")}
          </h6>
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

export default PoissonChart;
