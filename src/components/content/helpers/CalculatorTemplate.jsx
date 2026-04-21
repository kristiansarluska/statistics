// src/components/content/helpers/CalculatorTemplate.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import DataInputControl from "./DataInputControl";
import "katex/dist/katex.min.css";

/*** @component CalculatorTemplate
 * @description A reusable layout component for statistical calculators.
 * It manages data input state, validation, and rendering of mathematical formulas using KaTeX.
 * * @param {Object} props
 * @param {string} props.title - Title of the calculator.
 * @param {string} props.inputLabel - Label for the data input section.
 * @param {Array<number>} [props.defaultData=[]] - Initial dataset (ignored when renderInput is used).
 * @param {Function} [props.onValidate] - Validator function for new inputs (ignored when renderInput is used).
 * @param {Function} props.getMathContent - Function that returns LaTeX formulas and calculation results.
 *   In standard mode receives `(measurements, isMathExpanded)`.
 *   In renderInput mode receives `(null, isMathExpanded)` — the consumer owns the data.
 * @param {number} [props.min] - Minimum allowed value for input (ignored when renderInput is used).
 * @param {number} [props.max] - Maximum allowed value for input (ignored when renderInput is used).
 * @param {string|number} [props.step="any"] - Step attribute for numeric input (ignored when renderInput is used).
 * @param {string} [props.placeholder] - Input placeholder text (ignored when renderInput is used).
 * @param {boolean} [props.sortData=false] - If true, data is automatically sorted ascending (ignored when renderInput is used).
 * @param {Function} [props.renderExtra] - Optional function to render extra UI elements near data badges (ignored when renderInput is used).
 * @param {Function} [props.bottomContent] - Optional function to render additional content below the calculator.
 * @param {Function} [props.renderInput] - Optional render prop that fully replaces the default DataInputControl.
 *   When provided, the consumer manages its own data state and passes `externalN` so the template
 *   knows whether to render the math section.
 * @param {number} [props.externalN] - Item count supplied by the consumer when using renderInput.
 */
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
  renderInput,
  externalN,
}) {
  const { t } = useTranslation();

  const [isMathExpanded, setIsMathExpanded] = useState(false);

  // ── Interný režim (štandardný number[] dataset) ──────────────────────────
  const initData = !renderInput
    ? sortData
      ? [...defaultData].sort((a, b) => a - b)
      : defaultData
    : [];

  const [measurements, setMeasurements] = useState(initData);

  const isDefault =
    !renderInput &&
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
  // ─────────────────────────────────────────────────────────────────────────

  // Ak je aktívny externý režim, počet položiek riadi volajúci cez externalN
  const n = renderInput ? (externalN ?? 0) : measurements.length;

  // getMathContent dostane null pri externom režime — volajúci si sám počíta dáta
  const mathContent =
    n > 0
      ? getMathContent(renderInput ? null : measurements, isMathExpanded)
      : null;
  const highlightIndices = mathContent?.highlightIndices || [];

  return (
    <div
      className="chart-with-controls-container d-flex flex-column mb-4 w-100 mx-auto"
      style={{ maxWidth: "800px" }}
    >
      {title && <h6 className="mb-4 text-center">{title}</h6>}

      {/* Data Input Section */}
      <div className="w-100 mb-4">
        {inputLabel && (
          <h6 className="mb-3" style={{ fontSize: "0.95rem" }}>
            {inputLabel}
          </h6>
        )}

        {renderInput ? (
          // Externý režim — volajúci poskytne vlastný input (napr. weighted DataInputControl)
          renderInput(mathContent)
        ) : (
          // Štandardný režim — interný DataInputControl pre number[]
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
        )}
      </div>

      {/* Results and Mathematical Formula Section */}
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
            {/* Render general formula */}
            {mathContent.formulaMath && (
              <div style={{ paddingBottom: "10px" }}>
                <BlockMath math={mathContent.formulaMath} />
              </div>
            )}

            {/* Render concrete calculation with actual numbers */}
            <div style={{ paddingBottom: "15px" }}>
              <BlockMath math={mathContent.blockMath} />
            </div>
          </div>

          {/* Final Result Display */}
          <div className="fs-5 mt-1">
            <InlineMath math={mathContent.inlineMath} />
            <strong className="text-primary">{mathContent.resultText}</strong>
          </div>
        </div>
      )}

      {/* Optional footer content (e.g., comparisons or warnings) */}
      {bottomContent && n > 0 && (
        <div className="w-100 mt-3">{bottomContent(measurements)}</div>
      )}
    </div>
  );
}

export default CalculatorTemplate;
