// src/components/charts/probability-distributions/discrete/BinomialChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import { binomialPMF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function BinomialChart() {
  const [n, setN] = useState(10); // Default number of trials
  const [p, setP] = useState(0.5); // Default probability of success
  const [hoverX, setHoverX] = useState(null);

  const { pmfData, cdfData } = useMemo(() => {
    const pmf = [];
    const cdf = [];
    for (let k = 0; k <= n; k++) {
      const prob = binomialPMF(k, n, p);
      pmf.push({ x: String(k), y: prob }); // String pre zosúladenie osí v BarCharte
      cdf.push({ x: k, p: prob }); // Číslo pre presné výpočty v šablóne CDF
    }
    return { pmfData: pmf, cdfData: cdf };
  }, [n, p]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky (Sliders) */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        {/* Pravdepodobnosť úspechu (p) */}
        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="pRangeBinom" className="form-label w-100 text-center">
            Pravdepodobnosť (p): <strong>{p.toFixed(2)}</strong>
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

        {/* Počet pokusov (n) */}
        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="nRangeBinom" className="form-label w-100 text-center">
            Počet pokusov (n): <strong>{n}</strong>
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

export default BinomialChart;
