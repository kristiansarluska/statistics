// src/components/content/helpers/CalculatorTemplate.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import DataInputControl from "./DataInputControl";
import "katex/dist/katex.min.css";

function CalculatorTemplate({
  title,
  inputLabel,
  defaultData = [],
  onValidate = (val) => !isNaN(val),
  getMathContent,
  min,
  max,
  step = "any",
  placeholder,
  sortData = false,
  renderExtra,
  bottomContent,
}) {
  const { t } = useTranslation();
  const initData = sortData
    ? [...defaultData].sort((a, b) => a - b)
    : defaultData;
  const [measurements, setMeasurements] = useState(initData);
  const [isMathExpanded, setIsMathExpanded] = useState(false);

  const isDefault =
    measurements.length === defaultData.length &&
    measurements.every((val, idx) => val === initData[idx]);

  const handleAdd = (val) => {
    if (onValidate(val)) {
      let newData = [...measurements, val];
      if (sortData) newData.sort((a, b) => a - b);
      setMeasurements(newData);
    }
  };

  const handleRemove = (indexToRemove) => {
    setMeasurements(measurements.filter((_, idx) => idx !== indexToRemove));
  };

  const handleReset = () => {
    setMeasurements([...initData]);
    setIsMathExpanded(false);
  };

  const n = measurements.length;
  const mathContent =
    n > 0 ? getMathContent(measurements, isMathExpanded) : null;
  const highlightIndices = mathContent?.highlightIndices || [];

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
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          itemClassName={(_, idx) =>
            highlightIndices.includes(idx) ? "btn-info" : ""
          }
          renderExtra={(val, idx) =>
            renderExtra ? renderExtra(val, idx, mathContent) : null
          }
        />
      </div>

      {n > 0 && mathContent && (
        <div className="p-3 rounded-3 shadow-sm border bg-body-tertiary text-center w-100">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p
              className="mb-0 fw-bold text-muted text-start"
              style={{ fontSize: "0.9rem" }}
            >
              {t("components.calculatorTemplate.calcSteps")}
            </p>

            {mathContent.isExpandable && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                style={{ fontSize: "0.75rem" }}
                onClick={() => setIsMathExpanded(!isMathExpanded)}
              >
                {isMathExpanded
                  ? t("components.calculatorTemplate.collapse")
                  : t("components.calculatorTemplate.expand")}
              </button>
            )}
          </div>

          <div
            className="w-100 text-center"
            style={{
              fontSize: "1.1rem",
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            {mathContent.formulaMath && (
              <div style={{ paddingBottom: "10px" }}>
                <BlockMath math={mathContent.formulaMath} />
              </div>
            )}

            <div style={{ paddingBottom: "15px" }}>
              <BlockMath math={mathContent.blockMath} />
            </div>
          </div>

          <div className="fs-5 mt-1">
            <InlineMath math={mathContent.inlineMath} />
            <strong className="text-primary">{mathContent.resultText}</strong>
          </div>
        </div>
      )}

      {bottomContent && n > 0 && (
        <div className="w-100 mt-3">{bottomContent(measurements)}</div>
      )}
    </div>
  );
}

export default CalculatorTemplate;
