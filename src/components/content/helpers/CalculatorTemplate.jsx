// src/components/content/helpers/CalculatorTemplate.jsx
import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import DataInputControl from "./DataInputControl";
import "katex/dist/katex.min.css";

function CalculatorTemplate({
  title,
  inputLabel,
  defaultData = [],
  onValidate = (val) => !isNaN(val),
  getMathContent,
}) {
  const [measurements, setMeasurements] = useState(defaultData);

  const isDefault =
    measurements.length === defaultData.length &&
    measurements.every((val, idx) => val === defaultData[idx]);

  const handleAdd = (val) => {
    if (onValidate(val)) {
      setMeasurements([...measurements, val]);
    }
  };

  const handleRemove = (indexToRemove) => {
    setMeasurements(measurements.filter((_, idx) => idx !== indexToRemove));
  };

  const handleReset = () => setMeasurements([...defaultData]);

  const n = measurements.length;
  const mathContent = n > 0 ? getMathContent(measurements) : null;

  return (
    <div
      className="chart-with-controls-container d-flex flex-column mb-4 w-100 mx-auto"
      style={{ maxWidth: "800px" }}
    >
      {title && <h6 className="mb-4 text-center">{title}</h6>}

      <div className="w-100 mb-4">
        {inputLabel && (
          <h6 className="mb-3" style={{ fontSize: "0.95rem" }}>
            {inputLabel}
          </h6>
        )}
        <DataInputControl
          data={measurements}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onReset={handleReset}
          isDefault={isDefault}
        />
      </div>

      {n > 0 && mathContent && (
        <div className="p-3 rounded-3 shadow-sm border bg-body-tertiary text-center overflow-auto w-100">
          <p className="mb-2 fw-bold text-muted" style={{ fontSize: "0.9rem" }}>
            Postup výpočtu:
          </p>
          <div className="mb-2" style={{ fontSize: "1.1rem" }}>
            <BlockMath math={mathContent.blockMath} />
          </div>
          <div className="fs-5 mt-3">
            <InlineMath math={mathContent.inlineMath} />
            <strong className="text-primary">{mathContent.resultText}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalculatorTemplate;
