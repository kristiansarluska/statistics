// src/components/content/characteristics/MedianCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset for initial median calculation.
 * Includes an outlier (72) to demonstrate the median's robustness compared to the mean.
 */
const DEFAULT_DATA = [12, 15, 15, 18, 21, 24, 72];

/**
 * @component MedianCalc
 * @description Interactive calculator for the Median.
 * Handles both odd and even number of observations and displays the mathematical steps.
 * Includes a comparison with the arithmetic mean in the footer.
 */
function MedianCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.median.title")}
      inputLabel={t("components.characteristics.median.inputLabel")}
      defaultData={DEFAULT_DATA}
      sortData={true}
      min="0"
      placeholder={t("components.characteristics.median.placeholder")}
      /**
       * Calculates the median and prepares LaTeX strings for visualization.
       * @param {number[]} measurements - Sorted array of input values.
       * @returns {Object} Math content and UI metadata.
       */
      getMathContent={(measurements) => {
        const n = measurements.length;
        const sortedStr = measurements.join(", ");
        let formulaMath = "";
        let blockMath = `\\begin{gathered} \\{ ${sortedStr} \\} \\\\ `;
        let median;
        let highlightIndices = [];
        let injectedMedian = null;

        if (n % 2 !== 0) {
          // Odd number of elements: Median is the exact middle element
          const m = Math.floor(n / 2);
          median = measurements[m];
          highlightIndices = [m];
          formulaMath = `\\tilde{x} = x_{\\frac{n+1}{2}} \\quad \\text{${t("components.characteristics.median.oddCount")}}`;
          blockMath += `\\tilde{x} = x_{${m + 1}} = ${median} \\end{gathered}`;
        } else {
          // Even number of elements: Median is the average of the two middle elements
          const m1 = n / 2 - 1;
          const m2 = n / 2;
          median = (measurements[m1] + measurements[m2]) / 2;
          highlightIndices = [m1, m2];
          // metadata for rendering a virtual element between indices
          injectedMedian = { value: median, insertAfterIdx: m1 };
          formulaMath = `\\tilde{x} = \\frac{x_{\\frac{n}{2}} + x_{\\frac{n}{2}+1}}{2} \\quad \\text{${t("components.characteristics.median.evenCount")}}`;
          blockMath += `\\tilde{x} = \\frac{${measurements[m1]} + ${measurements[m2]}}{2} = ${median} \\end{gathered}`;
        }

        return {
          formulaMath,
          blockMath,
          inlineMath: `\\tilde{x} = `,
          resultText: `${median.toFixed(2)} m`,
          highlightIndices,
          injectedMedian,
        };
      }}
      /**
       * Renders an extra UI element (badge) for even-length datasets
       * to show where the calculated median sits between two middle values.
       */
      renderExtra={(val, idx, mathContent) => {
        if (mathContent?.injectedMedian?.insertAfterIdx === idx) {
          return (
            <span
              key={`inj-${idx}`}
              className="badge rounded-pill border border-info bg-info-subtle text-info"
              style={{ fontSize: "0.85rem", userSelect: "none", zIndex: 1 }}
              title={t("components.characteristics.median.tooltip")}
            >
              =
              {mathContent.injectedMedian.value.toLocaleString("sk-SK", {
                maximumFractionDigits: 2,
              })}
            </span>
          );
        }
        return null;
      }}
      /**
       * Displays a comparison block showing the difference
       * between the median and the arithmetic mean.
       */
      bottomContent={(measurements) => {
        if (measurements.length === 0) return null;
        const sum = measurements.reduce((a, b) => a + b, 0);
        const mean = sum / measurements.length;
        return (
          <div className="alert alert-secondary text-center shadow-sm py-2 mb-0 border-secondary-subtle">
            <span className="fw-bold">
              {t("components.characteristics.median.comparisonTitle")}
            </span>{" "}
            {t("components.characteristics.median.comparisonMean")}{" "}
            <strong className="text-primary">{mean.toFixed(2)} m</strong>.
            <div className="small mt-1 text-muted">
              {t("components.characteristics.median.comparisonDesc")}
            </div>
          </div>
        );
      }}
    />
  );
}

export default MedianCalc;
