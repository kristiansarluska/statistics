// src/components/content/characteristics/WeightedMeanCalc.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import DataInputControl from "../helpers/DataInputControl";
import "katex/dist/katex.min.css";

/**
 * Default dataset used for the initial state of the weighted mean calculator.
 * x: observed value, w: assigned weight.
 */
const DEFAULT_DATA = [
  { x: 420.15, w: 3 },
  { x: 420.18, w: 1 },
  { x: 420.12, w: 2 },
];

/**
 * @component WeightedMeanCalc
 * @description Interactive calculator for computing the weighted arithmetic mean.
 * Allows users to input values and their respective weights, providing a step-by-step
 * LaTeX visualization of the formula and calculation.
 */
function WeightedMeanCalc() {
  const { t } = useTranslation();

  // Local state for the list of measurements (value + weight)
  const [measurements, setMeasurements] = useState(DEFAULT_DATA);

  // Check if current data matches the default values for UI reset state
  const isDefault =
    measurements.length === DEFAULT_DATA.length &&
    measurements.every(
      (m, idx) => m.x === DEFAULT_DATA[idx].x && m.w === DEFAULT_DATA[idx].w,
    );

  /**
   * Adds a new value-weight pair to the dataset.
   * @param {Object} newItem - The new item {x, w}.
   */
  const handleAdd = (newItem) => {
    setMeasurements([...measurements, newItem]);
  };

  /**
   * Removes an item from the dataset by its index.
   * @param {number} indexToRemove - Index of the item to be removed.
   */
  const handleRemove = (indexToRemove) => {
    setMeasurements(measurements.filter((_, idx) => idx !== indexToRemove));
  };

  /**
   * Updates an existing value-weight pair.
   * @param {number} idx - Index of the item to edit.
   * @param {Object} newValue - The updated item {x, w}.
   */
  const handleEdit = (idx, newValue) => {
    const newMeasurements = [...measurements];
    newMeasurements[idx] = newValue;
    setMeasurements(newMeasurements);
  };

  /**
   * Resets the calculator to the default dataset.
   */
  const handleReset = () => {
    setMeasurements([...DEFAULT_DATA]);
  };

  // Perform calculations for the weighted mean
  const n = measurements.length;
  // Sum of products (w_i * x_i)
  const sumWX = measurements.reduce((acc, m) => acc + m.x * m.w, 0);
  // Sum of weights (w_i)
  const sumW = measurements.reduce((acc, m) => acc + m.w, 0);
  const weightedMean = sumW > 0 ? sumWX / sumW : 0;

  // Prepare strings for the numerator and denominator in LaTeX output
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
        {t("components.characteristics.weighted.title")}
      </h6>

      <div className="w-100 mb-4">
        <h6 className="mb-3" style={{ fontSize: "0.95rem" }}>
          {t("components.characteristics.weighted.inputValuesLabel")}
        </h6>

        <DataInputControl
          data={measurements}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onReset={handleReset}
          isDefault={isDefault}
          placeholder={t("components.characteristics.weighted.placeholder")}
          isWeighted={true}
          onEdit={handleEdit}
          formatItem={(item) => (
            <>
              {item.x} m{" "}
              <span className="opacity-75 ms-1">
                ({t("components.characteristics.weighted.weightLabel")} {item.w}
                )
              </span>
            </>
          )}
        />
      </div>

      {/* Calculation steps visualization using KaTeX */}
      {n > 0 && sumW > 0 && (
        <div className="p-3 rounded-3 shadow-sm border bg-body-tertiary text-center overflow-auto w-100">
          <p
            className="mb-2 fw-bold text-muted"
            style={{ fontSize: "0.9rem", textAlign: "left" }}
          >
            {t("components.calculatorTemplate.calcSteps")}
          </p>
          <div className="mb-2" style={{ fontSize: "1.1rem" }}>
            <div style={{ paddingBottom: "10px" }}>
              <BlockMath
                math={`\\bar{x}_w = \\frac{ \\sum_{i=1}^{k} w_i x_i }{ \\sum_{i=1}^{k} w_i }`}
              />
            </div>
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
