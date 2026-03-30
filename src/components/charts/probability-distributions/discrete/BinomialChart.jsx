// src/components/charts/probability-distributions/discrete/BinomialChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import { binomialPMF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function BinomialChart() {
  const { t } = useTranslation();
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);
  const [hoverX, setHoverX] = useState(null);

  const { pmfData, cdfData } = useMemo(() => {
    const pmf = [];
    const cdf = [];
    for (let k = 0; k <= n; k++) {
      const prob = binomialPMF(k, n, p);
      pmf.push({ x: String(k), y: prob });
      cdf.push({ x: k, p: prob });
    }
    return { pmfData: pmf, cdfData: cdf };
  }, [n, p]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      <div className="controls mb-4 row justify-content-center gx-4 gy-3 w-100 mx-0">
        <div className="col-10 col-sm-5 col-md-4 col-lg-3 d-flex flex-column align-items-center">
          <label
            htmlFor="nRangeBinom"
            className="form-label fw-bold mb-2 text-center small"
          >
            {t("components.probabilityCharts.binomial.trialsN")}
            <span className="parameter-value">{n}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="nRangeBinom"
            min="1"
            max="20"
            step="1"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
        </div>

        <div className="col-10 col-sm-5 col-md-4 col-lg-3 d-flex flex-column align-items-center">
          <label
            htmlFor="pRangeBinom"
            className="form-label fw-bold mb-2 text-center small"
          >
            {t("components.probabilityCharts.binomial.probP")}
            <span className="parameter-value">{p.toFixed(2)}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="pRangeBinom"
            min="0"
            max="1"
            step="0.01"
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
          />
        </div>
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

export default BinomialChart;
