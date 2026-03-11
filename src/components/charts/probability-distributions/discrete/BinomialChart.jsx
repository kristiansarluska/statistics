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
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="pRangeBinom" className="form-label w-100 text-center">
            {t("components.probabilityCharts.binomial.probP")}{" "}
            <strong>{p.toFixed(2)}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="pRangeBinom"
            min="0"
            max="1"
            step="0.01"
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
          />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="nRangeBinom" className="form-label w-100 text-center">
            {t("components.probabilityCharts.binomial.trialsN")}{" "}
            <strong>{n}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="nRangeBinom"
            min="1"
            max="20"
            step="1"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
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
