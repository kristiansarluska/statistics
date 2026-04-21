// src/components/content/characteristics/WeightedMeanCalc.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";
import DataInputControl from "../helpers/DataInputControl";

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
 * Uses CalculatorTemplate for layout and math rendering, with a custom renderInput
 * prop to support weighted {x, w} data instead of plain numbers.
 */
function WeightedMeanCalc() {
  const { t } = useTranslation();

  // Consumer owns the weighted dataset — CalculatorTemplate only handles number[] internally
  const [measurements, setMeasurements] = useState(DEFAULT_DATA);

  const isDefault =
    measurements.length === DEFAULT_DATA.length &&
    measurements.every(
      (m, idx) => m.x === DEFAULT_DATA[idx].x && m.w === DEFAULT_DATA[idx].w,
    );

  const handleAdd = (newItem) => setMeasurements((prev) => [...prev, newItem]);

  const handleRemove = (indexToRemove) =>
    setMeasurements((prev) => prev.filter((_, idx) => idx !== indexToRemove));

  const handleEdit = (idx, newValue) =>
    setMeasurements((prev) => {
      const next = [...prev];
      next[idx] = newValue;
      return next;
    });

  const handleReset = () => setMeasurements([...DEFAULT_DATA]);

  /**
   * Builds the mathContent object expected by CalculatorTemplate.
   * Called with null as measurements (external mode) — we close over the state directly.
   */
  const getMathContent = () => {
    const sumWX = measurements.reduce((acc, m) => acc + m.x * m.w, 0);
    const sumW = measurements.reduce((acc, m) => acc + m.w, 0);
    const weightedMean = sumW > 0 ? sumWX / sumW : 0;

    const numString = measurements
      .map((m) => `(${m.w} \\cdot ${m.x})`)
      .join(" + ");
    const denString = measurements.map((m) => m.w).join(" + ");

    return {
      formulaMath: `\\bar{x}_w = \\frac{ \\sum_{i=1}^{k} w_i x_i }{ \\sum_{i=1}^{k} w_i }`,
      blockMath: `\\bar{x}_w = \\frac{ ${numString} }{ ${denString} }`,
      inlineMath: `\\bar{x}_w = `,
      resultText: `${weightedMean.toFixed(3)} m`,
    };
  };

  return (
    <CalculatorTemplate
      title={t("components.characteristics.weighted.title")}
      inputLabel={t("components.characteristics.weighted.inputValuesLabel")}
      getMathContent={getMathContent}
      externalN={measurements.length}
      renderInput={() => (
        <DataInputControl
          data={measurements}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onReset={handleReset}
          isDefault={isDefault}
          placeholder={t("components.characteristics.weighted.placeholder")}
          isWeighted={true}
          editable={true}
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
      )}
    />
  );
}

export default WeightedMeanCalc;
