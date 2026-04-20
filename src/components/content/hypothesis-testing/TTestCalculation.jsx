// src/components/content/hypothesis-testing/TTestCalculation.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";
import CalcPanel from "../helpers/CalcPanel";

/**
 * @component TTestCalculation
 * @description Displays the step-by-step mathematical calculation for a One-Sample T-Test.
 * @param {Object} props
 * @param {Object} props.stats - Calculated statistics (mean, sd, n, t, df, pValue).
 * @param {number} props.expectedValue - Population mean under the null hypothesis (mu0).
 * @param {number} props.alpha - Significance level.
 * @param {string} props.selectedOkres - Label of the selected spatial unit.
 * @param {boolean} props.isSignificant - Whether the null hypothesis is rejected.
 */
function TTestCalculation({
  stats,
  expectedValue,
  alpha,
  selectedOkres,
  isSignificant,
}) {
  const { t } = useTranslation();
  const se = stats.sd / Math.sqrt(stats.n);

  return (
    <CalcPanel
      title={t("hypothesisTesting.tTestDashboard.calculation.tStatTitle", {
        district: selectedOkres,
      })}
    >
      {/* T statistic formulas */}{" "}
      <CalcPanel.Row formula="t = \frac{\bar{x} - \mu_0}{\dfrac{s}{\sqrt{n}}}" />
      <CalcPanel.Row
        concrete
        formula={`t = \\frac{${stats.mean.toFixed(2)} - ${expectedValue}}{\\dfrac{${stats.sd.toFixed(2)}}{\\sqrt{${stats.n}}}} = \\frac{${(stats.mean - expectedValue).toFixed(2)}}{${se.toFixed(4)}} = ${stats.t.toFixed(4)}`}
      />
      {/* Parameter legend */}
      <div className="row text-center small text-muted g-2 mb-1">
        {[
          {
            math: `\\bar{x} = ${stats.mean.toFixed(2)}`,
            label: t("hypothesisTesting.tTestDashboard.calculation.meanLabel"),
          },
          {
            math: `\\mu_0 = ${expectedValue}`,
            label: t(
              "hypothesisTesting.tTestDashboard.calculation.expectedLabel",
            ),
          },
          {
            math: `s = ${stats.sd.toFixed(2)}`,
            label: t("hypothesisTesting.tTestDashboard.calculation.sdLabel"),
          },
          {
            math: `n = ${stats.n}`,
            label: t("hypothesisTesting.tTestDashboard.calculation.nLabel"),
          },
        ].map(({ math, label }) => (
          <div key={label} className="col-6 col-sm-3">
            <InlineMath math={math} />
            <div>{label}</div>
          </div>
        ))}
      </div>
      <CalcPanel.Divider />
      {/* p-value */}
      <CalcPanel.Row formula="p = 2 \cdot P(T_{df} > |t|) = 2 \cdot (1 - F_{t}(|t|))" />
      <CalcPanel.Row
        concrete
        formula={`p = 2 \\cdot (1 - F_{${stats.df}}(${Math.abs(stats.t).toFixed(4)})) = ${stats.pValue.toFixed(4)}`}
      />
      <CalcPanel.Note>
        <Trans
          i18nKey="hypothesisTesting.tTestDashboard.calculation.pValDesc"
          components={{
            fdf: <InlineMath math={`F_{${stats.df}}`} />,
            df: <InlineMath math={`${stats.df}`} />,
          }}
        />
      </CalcPanel.Note>
      <CalcPanel.Divider />
      {/* Conclusion */}
      <div
        className={`rounded p-2 text-center small ${isSignificant ? "bg-danger-subtle" : "bg-success-subtle"}`}
      >
        <div
          className={`fw-bold mb-1 ${isSignificant ? "text-danger" : "text-success"}`}
        >
          {isSignificant
            ? `p = ${stats.pValue.toFixed(4)} < α = ${alpha} → ${t("hypothesisTesting.tTestDashboard.calculation.rejectSummary")}`
            : `p = ${stats.pValue.toFixed(4)} ≥ α = ${alpha} → ${t("hypothesisTesting.tTestDashboard.calculation.acceptSummary")}`}
        </div>
        <div className="text-muted">
          {t("hypothesisTesting.tTestDashboard.calculation.equivalent")}{" "}
          <InlineMath math={`|t| = ${Math.abs(stats.t).toFixed(4)}`} />
          {isSignificant ? " > " : " ≤ "}
          <InlineMath math={`t_{\\alpha/2} = ${stats.tCrit.toFixed(4)}`} />
        </div>
      </div>
    </CalcPanel>
  );
}

export default TTestCalculation;
