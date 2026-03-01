// src/components/content/characteristics/ArithmeticMeanCalc.jsx
import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import DataInputControl from "../helpers/DataInputControl";
import "katex/dist/katex.min.css";

function ArithmeticMeanCalc() {
  const DEFAULT_DATA = [420.15, 420.18, 420.12];
  const [measurements, setMeasurements] = useState(DEFAULT_DATA);

  const isDefault =
    measurements.length === DEFAULT_DATA.length &&
    measurements.every((val, idx) => val === DEFAULT_DATA[idx]);

  const handleAdd = (val) => {
    setMeasurements([...measurements, val]);
  };

  const handleRemove = (indexToRemove) => {
    setMeasurements(measurements.filter((_, idx) => idx !== indexToRemove));
  };

  const handleReset = () => setMeasurements([...DEFAULT_DATA]);

  const n = measurements.length;
  const sum = measurements.reduce((acc, val) => acc + val, 0);
  const mean = n > 0 ? sum / n : 0;

  return (
    <div
      className="chart-with-controls-container d-flex flex-column mb-4 w-100 mx-auto"
      style={{ maxWidth: "800px" }}
    >
      {/* Vstupy pomocou nášho nového znovupoužiteľného komponentu */}
      <div className="w-100 mb-4">
        <h6 className="mb-3" style={{ fontSize: "0.95rem" }}>
          Namerané hodnoty (m):
        </h6>
        <DataInputControl
          data={measurements}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onReset={handleReset}
          isDefault={isDefault}
        />
      </div>

      {/* Výsledok výpočtu - prepracovaný do flexibilných Bootstrap farieb */}
      {n > 0 && (
        <div className="p-3 rounded-3 shadow-sm border bg-body-tertiary text-center overflow-auto w-100">
          <p className="mb-2 fw-bold text-muted" style={{ fontSize: "0.9rem" }}>
            Postup výpočtu:
          </p>
          <div className="mb-2" style={{ fontSize: "1.1rem" }}>
            <BlockMath
              math={`\\bar{x} = \\frac{ \\sum x_i }{ n } = \\frac{ ${measurements.join(" + ")} }{ ${n} }`}
            />
          </div>
          <div className="fs-5 mt-3">
            <InlineMath math={`\\bar{x} = `} />
            <strong className="text-primary">{mean.toFixed(3)} m</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArithmeticMeanCalc;
