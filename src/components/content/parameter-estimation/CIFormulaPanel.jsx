// src/components/content/parameterEstimation/CIFormulaPanel.jsx
import React from "react";
import { InlineMath } from "react-katex";
import CalcPanel from "../helpers/CalcPanel";
import { POP_MEAN, POP_STD } from "../../../utils/ciMath";

/**
 * @component CIFormulaPanel
 * @description Displays the mathematical formulas and step-by-step concrete calculations for confidence intervals.
 * Dynamically adjusts LaTeX equations based on interval type, variance knowledge, and current sample data.
 * @param {Object} props
 * @param {number} props.cl - Confidence level (e.g., 0.95 for 95%).
 * @param {string} props.type - Type of the confidence interval ("two", "left", "right").
 * @param {boolean} props.knowSigma - Flag indicating whether the population variance is known.
 * @param {Object|null} props.lastSample - Statistics from the most recently drawn sample.
 * @param {number} props.lastSample.mean - Sample mean.
 * @param {number} props.lastSample.sd - Sample standard deviation.
 * @param {number} props.lastSample.n - Sample size.
 * @param {number} props.lastSample.lower - Lower bound of the confidence interval.
 * @param {number} props.lastSample.upper - Upper bound of the confidence interval.
 * @param {number} props.lastSample.crit - Critical value (z or t) used for calculation.
 * @param {number} props.lastSample.se - Standard error.
 * @param {boolean} props.lastSample.hit - Flag indicating if the interval successfully contains the population mean.
 * @param {Function} props.t - i18n translation function.
 */
function CIFormulaPanel({ cl, type, knowSigma, lastSample, t }) {
  const sigStr = knowSigma ? "\\sigma" : "s";
  const critSub = type === "two" ? "1-\\alpha/2" : "1-\\alpha";
  const critStr = knowSigma ? `z_{${critSub}}` : `t_{n-1,\\,${critSub}}`;

  let formulaLatex;
  if (type === "two") {
    formulaLatex = `\\bar{x} \\pm ${critStr} \\cdot \\frac{${sigStr}}{\\sqrt{n}}`;
  } else if (type === "left") {
    formulaLatex = `\\left(\\bar{x} - ${critStr} \\cdot \\frac{${sigStr}}{\\sqrt{n}},\\;+\\infty\\right)`;
  } else {
    formulaLatex = `\\left(-\\infty,\\;\\bar{x} + ${critStr} \\cdot \\frac{${sigStr}}{\\sqrt{n}}\\right)`;
  }

  const typeMap = { two: "Two", left: "Left", right: "Right" };
  const typeLabel = t(
    `parameterEstimation.intervalEstimation.simulation.controls.type${typeMap[type]}`,
  );
  const varTypeLabel = knowSigma
    ? t("parameterEstimation.intervalEstimation.simulation.formula.varKnown")
    : t("parameterEstimation.intervalEstimation.simulation.formula.varUnknown");

  const title = t(
    "parameterEstimation.intervalEstimation.simulation.formula.title",
    {
      cl,
      type: typeLabel,
      varType: varTypeLabel,
    },
  );

  let calcLatex = null;
  let resultHit = null;

  if (lastSample) {
    const { mean, sd, n, lower, upper, crit, se } = lastSample;
    const sigVal = (knowSigma ? POP_STD : sd).toFixed(4);
    const lStr = lower === -Infinity ? "-\\infty" : lower.toFixed(3);
    const uStr = upper === Infinity ? "+\\infty" : upper.toFixed(3);
    const critLbl = knowSigma ? "z" : `t_{${n - 1}}`;

    if (type === "two") {
      calcLatex = `\\begin{aligned}
        \\bar{x} &= ${mean.toFixed(3)},\\quad ${knowSigma ? "\\sigma" : "s"} = ${sigVal},\\quad n = ${n} \\\\
        SE &= \\frac{${sigVal}}{\\sqrt{${n}}} = ${se.toFixed(4)} \\\\
        ${critLbl} &= ${crit.toFixed(4)} \\\\
        CI &= ${mean.toFixed(3)} \\pm ${crit.toFixed(4)} \\cdot ${se.toFixed(4)} = (${lStr},\\;${uStr})
      \\end{aligned}`;
    } else if (type === "left") {
      calcLatex = `\\begin{aligned}
        SE &= ${se.toFixed(4)},\\quad ${critLbl} = ${crit.toFixed(4)} \\\\
        CI &= (${mean.toFixed(3)} - ${crit.toFixed(4)} \\cdot ${se.toFixed(4)},\\;+\\infty) = (${lStr},\\;+\\infty)
      \\end{aligned}`;
    } else {
      calcLatex = `\\begin{aligned}
        SE &= ${se.toFixed(4)},\\quad ${critLbl} = ${crit.toFixed(4)} \\\\
        CI &= (-\\infty,\\;${mean.toFixed(3)} + ${crit.toFixed(4)} \\cdot ${se.toFixed(4)}) = (-\\infty,\\;${uStr})
      \\end{aligned}`;
    }
    resultHit = lastSample.hit;
  }

  return (
    <CalcPanel title={title}>
      <CalcPanel.Row formula={formulaLatex} />

      {calcLatex && (
        <>
          <CalcPanel.Divider />
          <CalcPanel.Note>
            {t(
              "parameterEstimation.intervalEstimation.simulation.formula.calcTitle",
              {
                n: lastSample.n,
              },
            )}
          </CalcPanel.Note>
          <CalcPanel.Row concrete formula={calcLatex} />

          <p className="text-center mb-0 mt-2" style={{ fontSize: "0.85rem" }}>
            {t(
              "parameterEstimation.intervalEstimation.simulation.formula.resultPrefix",
            )}{" "}
            {resultHit ? (
              <strong className="text-success">
                {t(
                  "parameterEstimation.intervalEstimation.simulation.formula.resultContains",
                )}
              </strong>
            ) : (
              <strong className="text-danger">
                {t(
                  "parameterEstimation.intervalEstimation.simulation.formula.resultNotContains",
                )}
              </strong>
            )}{" "}
            {t(
              "parameterEstimation.intervalEstimation.simulation.formula.resultSuffix",
              {
                mu: POP_MEAN,
              },
            )}
          </p>
        </>
      )}
    </CalcPanel>
  );
}

export default CIFormulaPanel;
