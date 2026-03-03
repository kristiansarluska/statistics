// src/components/charts/random-variable/characteristics/KurtosisChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "../../helpers/StyledLineChart";

function KurtosisChart() {
  const [kurtosisValue, setKurtosisValue] = useState(0);
  const [hoverX, setHoverX] = useState(null);

  const chartData = useMemo(() => {
    // Transformácia slideru na exponent 'p' pre zovšeobecnené normálne rozdelenie e^(-|x|^p)
    const p = kurtosisValue >= 0 ? 2 - kurtosisValue : 2 - 2 * kurtosisValue;

    let sum = 0;
    const rawData = [];

    // Os X: Odchýlka od bežného prietoku
    for (let x = -5; x <= 5; x += 0.1) {
      const y = Math.exp(-Math.pow(Math.abs(x), p));
      rawData.push({ x: Number(x.toFixed(1)), y });
      sum += y;
    }

    // Normalizácia
    return rawData.map((point) => ({
      x: point.x,
      y: sum > 0 ? Number(((point.y / sum) * 100).toFixed(2)) : 0,
    }));
  }, [kurtosisValue]);

  let kurtosisText = "Normálne rozdelenie (Mezokurtické)";
  let kurtosisColor = "text-success";
  if (kurtosisValue > 0.2) {
    kurtosisText = "Špicaté rozdelenie (Leptokurtické)";
    kurtosisColor = "text-info";
  } else if (kurtosisValue < -0.2) {
    kurtosisText = "Ploché rozdelenie (Platykurtické)";
    kurtosisColor = "text-danger";
  }

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center w-100 mt-2">
      <h6 className="mb-4 text-center">
        Tvar rozdelenia: <span className={kurtosisColor}>{kurtosisText}</span>
      </h6>

      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <div style={{ flex: "1 1 100%" }}>
          <label
            htmlFor="kurtosisSlider"
            className="form-label w-100 text-center mb-2"
          >
            Hodnota excesu:{" "}
            <strong>
              {kurtosisValue > 0 ? `+${kurtosisValue}` : kurtosisValue}
            </strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="kurtosisSlider"
            min="-1"
            max="1"
            step="0.1"
            value={kurtosisValue}
            onChange={(e) => setKurtosisValue(parseFloat(e.target.value))}
          />
          <div
            className="d-flex justify-content-between text-muted small mt-1"
            style={{ fontSize: "0.8rem" }}
          >
            <span>Ploché (Regulovaná)</span>
            <span>Špicaté (Bystrina)</span>
          </div>
        </div>
      </div>

      <div className="charts-wrapper w-100">
        <StyledLineChart
          data={chartData}
          xLabel="Odchýlka od bežného stavu"
          yLabel="Pravdepodobnosť (%)"
          lineClass="chart-line-primary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          type="line"
          showReferenceArea={false}
          minX={-5}
          maxX={5}
        />
      </div>
    </div>
  );
}

export default KurtosisChart;
