// src/components/content/characteristics/WeightedMeanCalc.jsx
import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import DataInputControl from "../helpers/DataInputControl";
import "katex/dist/katex.min.css";

const DEFAULT_DATA = [
  { x: 420.15, w: 3 },
  { x: 420.18, w: 1 },
  { x: 420.12, w: 2 },
];

function WeightedMeanCalc() {
  const [measurements, setMeasurements] = useState(DEFAULT_DATA);

  const isDefault =
    measurements.length === DEFAULT_DATA.length &&
    measurements.every(
      (m, idx) => m.x === DEFAULT_DATA[idx].x && m.w === DEFAULT_DATA[idx].w,
    );

  const handleAdd = (newItem) => {
    setMeasurements([...measurements, newItem]);
  };

  const handleRemove = (indexToRemove) => {
    setMeasurements(measurements.filter((_, idx) => idx !== indexToRemove));
  };

  const handleEdit = (idx, newValue) => {
    const newMeasurements = [...measurements];
    newMeasurements[idx] = newValue;
    setMeasurements(newMeasurements);
  };

  const handleReset = () => {
    setMeasurements([...DEFAULT_DATA]);
  };

  const n = measurements.length;
  const sumW = measurements.reduce((acc, m) => acc + m.w, 0);
  const sumWX = measurements.reduce((acc, m) => acc + m.x * m.w, 0);
  const weightedMean = sumW > 0 ? sumWX / sumW : 0;

  const numString = measurements
    .map((m) => `(${m.w} \\cdot ${m.x})`)
    .join(" + ");
  const denString = measurements.map((m) => m.w).join(" + ");

  return (
    <div
      className="chart-with-controls-container d-flex flex-column mb-4 w-100 mx-auto"
      style={{ maxWidth: "800px" }}
    >
      <h6 className="mb-4 text-center">
        Vážený priemer nadmorskej výšky (podľa presnosti)
      </h6>

      <div className="w-100 mb-4">
        <h6 className="mb-3" style={{ fontSize: "0.95rem" }}>
          Namerané hodnoty a ich váhy:
        </h6>

        <DataInputControl
          data={measurements}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onReset={handleReset}
          isDefault={isDefault}
          placeholder="Hodnota (m)"
          isWeighted={true}
          weightPlaceholder="Váha"
          editable={true}
          onEdit={handleEdit}
          formatItem={(item) => (
            <>
              {item.x} m <span className="opacity-75 ms-1">(v: {item.w})</span>
            </>
          )}
        />
      </div>

      {n > 0 && sumW > 0 && (
        <div className="p-3 rounded-3 shadow-sm border bg-body-tertiary text-center overflow-auto w-100">
          <p
            className="mb-2 fw-bold text-muted"
            style={{ fontSize: "0.9rem", textAlign: "left" }}
          >
            Postup výpočtu:
          </p>
          <div className="mb-2" style={{ fontSize: "1.1rem" }}>
            {/* Pridaný abstraktný vzorec pre vážený priemer */}
            <div style={{ paddingBottom: "10px" }}>
              <BlockMath
                math={`\\bar{x}_w = \\frac{ \\sum_{i=1}^{k} w_i x_i }{ \\sum_{i=1}^{k} w_i }`}
              />
            </div>
            {/* Dosadené čísla pod sebou */}
            <div style={{ paddingBottom: "15px" }}>
              <BlockMath
                math={`\\bar{x}_w = \\frac{ ${numString} }{ ${denString} }`}
              />
            </div>
          </div>
          <div className="fs-5 mt-3">
            <InlineMath math={`\\bar{x}_w = `} />
            <strong className="text-primary">
              {weightedMean.toFixed(3)} m
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeightedMeanCalc;
