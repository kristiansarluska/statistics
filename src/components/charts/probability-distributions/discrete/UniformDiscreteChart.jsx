// src/components/charts/probability-distributions/discrete/UniformDiscreteChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import "../../../../styles/charts.css";

function UniformDiscreteChart() {
  const { t } = useTranslation();
  const [n, setN] = useState(6);
  const [hoverX, setHoverX] = useState(null);

  const p = 1 / n;

  const { pmfData, cdfData } = useMemo(() => {
    const pmf = [];
    const cdf = [];
    for (let i = 1; i <= n; i++) {
      pmf.push({ x: String(i), y: p });
      cdf.push({ x: i, p: p });
    }
    return { pmfData: pmf, cdfData: cdf };
  }, [n, p]);

  const maxY = (Math.floor(p * 10) + 1) / 10;

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
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
          <div className="text-center mt-2 small text-muted">
            {t("components.probabilityCharts.uniform.probCalc", {
              n,
              p: p.toFixed(4),
            })}
          </div>
        </div>
      </div>
      <div className="charts-wrapper w-100">
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
