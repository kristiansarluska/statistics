// src/components/charts/random-variable/distribution/DiscreteDistributionChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "../../helpers/StyledBarChart";
import StyledDiscreteCDFChart from "../../helpers/StyledDiscreteCDFChart";
import ResetButton from "../../helpers/ResetButton";
import "../../../../styles/charts.css";

const DEFAULT_COUNTS = ["10", "20", "35", "20", "10", "5"];

function DiscreteDistributionChart() {
  const [hoverX, setHoverX] = useState(null);
  const [counts, setCounts] = useState(DEFAULT_COUNTS);

  const isDefault = counts.every((val, index) => val === DEFAULT_COUNTS[index]);

  // Vypočítame základné dáta vo formáte { x, p } pre náš nový CDF komponent
  const data = useMemo(() => {
    const numericCounts = counts.map((c) => parseInt(c, 10) || 0);
    const sum = numericCounts.reduce((a, b) => a + b, 0);

    return numericCounts.map((count, i) => ({
      x: i,
      p: sum === 0 ? 0 : count / sum,
    }));
  }, [counts]);

  // Prispôsobíme dáta pre StyledBarChart (PMF)
  const pmfData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({ x: String(item.x), y: item.p }));
  }, [data]);

  // Zistíme minimum pre vykreslenie podfarbenia v BarCharte
  const minX = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.min(...data.map((d) => d.x));
  }, [data]);

  const handleReset = () => {
    setCounts([...DEFAULT_COUNTS]);
  };

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky - centrované a kompaktné */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center align-items-end gap-2"
        style={{ width: "100%", maxWidth: "800px" }}
      >
        {counts.map((val, index) => (
          <div key={index} className="d-flex flex-column align-items-center">
            <label
              className="form-label mb-1 fw-bold"
              style={{ fontSize: "0.85rem" }}
            >
              x = {index}
            </label>
            <input
              type="number"
              min="0"
              className="form-control form-control-sm text-center shadow-sm"
              style={{ width: "60px" }}
              value={val}
              onChange={(e) => {
                const newCounts = [...counts];
                newCounts[index] = e.target.value;
                setCounts(newCounts);
              }}
            />
          </div>
        ))}

        <div className="ms-2">
          <ResetButton onClick={handleReset} disabled={isDefault} />
        </div>
      </div>

      {/* Grafy v spoločnom wrapperi */}
      <div className="charts-wrapper w-100">
        <div>
          <h6 className="mb-3 text-center">Pravdepodobnostná funkcia (PMF)</h6>
          <StyledBarChart
            data={pmfData}
            xLabel="x"
            yLabel="P(X=x)"
            yDomain={[0, "auto"]}
            hoverX={hoverX}
            setHoverX={setHoverX}
            showReferenceArea={true}
            referenceAreaX1={String(minX)}
            referenceAreaX2={hoverX}
          />
        </div>

        <div>
          <h6 className="mb-3 text-center">Distribučná funkcia (CDF)</h6>
          <StyledDiscreteCDFChart
            data={data}
            hoverX={hoverX}
            setHoverX={setHoverX}
          />
        </div>
      </div>
    </div>
  );
}

export default DiscreteDistributionChart;
