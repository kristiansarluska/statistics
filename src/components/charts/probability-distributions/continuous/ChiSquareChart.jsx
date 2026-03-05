// src/components/charts/probability-distributions/continuous/ChiSquareChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "../../helpers/StyledLineChart";
import { chiSquarePDF, chiSquareCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function ChiSquareChart() {
  const [k, setK] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  const { dataPDF, dataCDF, maxX, maxY_PDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    // Dynamický rozsah osi X na základe stupňov voľnosti
    const calculatedMaxX = k + 4 * Math.sqrt(2 * k);
    const step = calculatedMaxX / 200;

    for (let i = 1; i <= 200; i++) {
      const x = i === 200 ? calculatedMaxX : i * step;
      const yPDF = chiSquarePDF(x, k);
      const yCDF = chiSquareCDF(x, k);

      if (!isNaN(yPDF) && isFinite(yPDF)) {
        pdf.push({ x, y: yPDF });
      }
      cdf.push({ x, y: yCDF });
    }

    // Pre k > 2 začína hustota presne v bode [0, 0]
    if (k > 2) {
      pdf.unshift({ x: 0, y: 0 });
      cdf.unshift({ x: 0, y: 0 });
    } else {
      // Pre k = 1 a k = 2 PDF v nule uteká do nekonečna alebo je 1/2, ale CDF je v nule vždy 0
      cdf.unshift({ x: 0, y: 0 });
    }

    const calculatedMaxY = Math.max(...pdf.map((p) => p.y), 0);

    return {
      dataPDF: pdf,
      dataCDF: cdf,
      maxX: calculatedMaxX,
      maxY_PDF: calculatedMaxY > 0 ? calculatedMaxY * 1.1 : 0.5,
    };
  }, [k]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky (Slider) */}
      <div
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <label htmlFor="kRange" className="form-label w-100 text-center">
          Stupne voľnosti (k): <strong>{k}</strong>
        </label>
        <input
          type="range"
          className="form-range"
          id="kRange"
          min="1"
          max="30"
          step="1"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
        />
      </div>

      {/* Prepojené grafy v spoločnom wrapperi */}
      <div className="charts-wrapper w-100">
        <div>
          <StyledLineChart
            data={dataPDF}
            title={`Hustota pravdepodobnosti (PDF)`}
            xLabel="x"
            yLabel="f(x; k)"
            lineClass="chart-line-primary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={0}
            maxX={maxX}
            yAxisDomain={[0, maxY_PDF]}
            type="pdf"
            showReferenceArea={true}
          />
        </div>
        <div>
          <StyledLineChart
            data={dataCDF}
            title={`Distribučná funkcia (CDF)`}
            xLabel="x"
            yLabel="F(x; k)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={0}
            maxX={maxX}
            yAxisDomain={[0, 1.1]}
            type="cdf"
            showReferenceArea={false}
          />
        </div>
      </div>
    </div>
  );
}

export default ChiSquareChart;
