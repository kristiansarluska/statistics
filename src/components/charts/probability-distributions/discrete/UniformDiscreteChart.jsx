// src/components/charts/probability-distributions/discrete/UniformDiscreteChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import "../../../../styles/charts.css";

function UniformDiscreteChart() {
  const [n, setN] = useState(6); // Default set to 6
  const [hoverX, setHoverX] = useState(null);

  // Výpočet pravdepodobnosti
  const p = 1 / n;

  const { pmfData, cdfData } = useMemo(() => {
    const pmf = [];
    const cdf = [];

    // Generovanie možných výsledkov od 1 do n
    for (let i = 1; i <= n; i++) {
      pmf.push({ x: String(i), y: p }); // String pre zosúladenie osí v BarCharte
      cdf.push({ x: i, p: p }); // Číslo pre presné výpočty v šablóne CDF
    }

    return { pmfData: pmf, cdfData: cdf };
  }, [n, p]);

  // Vypočítame pekné maxY pre PMF (vždy ďalšia desatina) pre priestor nad stĺpcami
  const maxY = (Math.floor(p * 10) + 1) / 10;

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky (Slider) */}
      <div
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <label htmlFor="nRange" className="form-label w-100 text-center">
          Počet možných výsledkov (n): <strong>{n}</strong>
        </label>
        <input
          type="range"
          className="form-range"
          id="nRange"
          min="2"
          max="10"
          step="1"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
        <div className="text-center mt-2 small text-muted">
          P(X=x) = 1/{n} &asymp; {p.toFixed(4)}
        </div>
      </div>

      {/* Prepojené grafy v spoločnom wrapperi */}
      <div className="charts-wrapper w-100">
        <div>
          <h6 className="mb-3 text-center">Pravdepodobnostná funkcia (PMF)</h6>
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

export default UniformDiscreteChart;
