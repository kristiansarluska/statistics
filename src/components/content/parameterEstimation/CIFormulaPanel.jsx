import React from "react";
import { BlockMath } from "react-katex";
import { POP_MEAN, POP_STD } from "../../../utils/ciMath";

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

  let calcLatex = null;
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
  }

  const typeMap = { two: "Two", left: "Left", right: "Right" };
  const typeLabel = t(
    `parameterEstimation.intervalEstimation.simulation.controls.type${typeMap[type]}`,
  );
  const varTypeLabel = knowSigma
    ? t("parameterEstimation.intervalEstimation.simulation.formula.varKnown")
    : t("parameterEstimation.intervalEstimation.simulation.formula.varUnknown");

  return (
    <div className="p-3 border rounded-3 bg-body-tertiary shadow-sm mt-1">
      <p className="fw-bold text-muted mb-2" style={{ fontSize: "0.85rem" }}>
        {t("parameterEstimation.intervalEstimation.simulation.formula.title", {
          cl,
          type: typeLabel,
          varType: varTypeLabel,
        })}
      </p>
      <div className="text-center overflow-auto">
        <BlockMath math={formulaLatex} />
      </div>
      {lastSample && (
        <>
          <hr className="my-2" />
          <p
            className="fw-bold text-muted mb-1"
            style={{ fontSize: "0.85rem" }}
          >
            {t(
              "parameterEstimation.intervalEstimation.simulation.formula.calcTitle",
              { n: lastSample.n },
            )}
          </p>
          <div className="text-center overflow-auto">
            <BlockMath math={calcLatex} />
          </div>
          <p className="text-center mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
            {t(
              "parameterEstimation.intervalEstimation.simulation.formula.resultPrefix",
            )}{" "}
            {lastSample.hit ? (
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
              { mu: POP_MEAN },
            )}
          </p>
        </>
      )}
    </div>
  );
}

export default CIFormulaPanel;
