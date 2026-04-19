// src/components/content/anova/AnovaTable.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import { fisherFCDF } from "../../../utils/distributions";

/**
 * @component AnovaTable
 * @description Renders a standard Analysis of Variance (ANOVA) summary table
 * and outputs the statistical decision (reject/fail to reject H0).
 * @param {Object} props
 * @param {Object} props.stats - The ANOVA statistics object calculated from the dataset
 * @param {number} props.stats.sst - Total Sum of Squares
 * @param {number} props.stats.ssw - Sum of Squares Within groups (Error)
 * @param {number} props.stats.ssb - Sum of Squares Between groups (Treatment)
 * @param {number} props.stats.dfB - Degrees of Freedom Between groups
 * @param {number} props.stats.dfW - Degrees of Freedom Within groups
 * @param {number} props.stats.msB - Mean Square Between groups
 * @param {number} props.stats.msW - Mean Square Within groups
 * @param {number} props.stats.fStat - Calculated F-statistic
 * @param {Array} props.stats.groupStats - Statistics for each group (used to get total n)
 */
function AnovaTable({ stats }) {
  const { t } = useTranslation();

  // Return null if stats are not provided yet
  if (!stats) return null;

  const { sst, ssw, ssb, dfB, dfW, msB, msW, fStat, groupStats } = stats;

  // Calculate total sample size (n) by summing up the sizes of all groups
  const n = groupStats.reduce((acc, g) => acc + g.n, 0);

  // Calculate p-value using existing F-distribution
  const alpha = 0.05;
  const pValue = 1 - fisherFCDF(fStat, dfB, dfW);

  // Evaluate the null hypothesis
  const rejectH0 = pValue < alpha;

  return (
    <div>
      <h4 className="mb-3">
        {t("components.anovaSimulation.anovaTable.title")}
      </h4>

      {/* ANOVA Summary Table */}
      <div className="table-responsive pb-2">
        <table className="table text-center align-middle mb-0">
          <thead className="table-active border fw-normal">
            <tr>
              <th style={{ width: "20%" }}>
                {t("components.anovaSimulation.anovaTable.colSource")}
              </th>
              <th style={{ width: "20%" }}>
                {t("components.anovaSimulation.anovaTable.colSS")}
              </th>
              <th style={{ width: "15%" }}>
                {t("components.anovaSimulation.anovaTable.colDF")}
              </th>
              <th style={{ width: "20%" }}>
                {t("components.anovaSimulation.anovaTable.colMS")}
              </th>
              <th style={{ width: "20%" }}>
                {t("components.anovaSimulation.anovaTable.colF")}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Between Groups Row */}
            <tr>
              <td className="border-start border-end text-start fw-bold px-3 small">
                {t("components.anovaSimulation.anovaTable.rowBetween")}
              </td>
              <td className="border-start border-end">
                <div className="mb-1">
                  <InlineMath math="S_a = n_i \sum_i^k (\bar{x}_i - \bar{x})^2" />
                </div>
                <div className="fw-bold border-top pt-1 small">
                  <InlineMath math={`S_a = ${ssb.toFixed(2)}`} />
                </div>
              </td>
              <td className="border-start border-end">
                <div className="mb-1">
                  <InlineMath math="DF_{\alpha} = k - 1" />
                </div>
                <div className="fw-bold border-top pt-1 small">
                  <InlineMath math={`DF_{\\alpha} = ${dfB}`} />
                </div>
              </td>
              <td className="border-start border-end">
                <div className="mb-1">
                  <InlineMath math="M_{\alpha} = \frac{S_{\alpha}}{D F_{\alpha}}" />
                </div>
                <div className="fw-bold border-top pt-1 small">
                  <InlineMath math={`M_{\\alpha} = ${msB.toFixed(2)}`} />
                </div>
              </td>
              {/* Test criterion spanning all 3 rows */}
              <td
                rowSpan="3"
                className="border-end bg-secondary-subtle align-middle"
              >
                <div className="mb-1">
                  <InlineMath math="F = \frac{M_{\alpha}}{M_{\varepsilon}}" />
                </div>
                <div className="fw-bold fs-5 text-primary">
                  <InlineMath math={`F = ${fStat.toFixed(3)}`} />
                </div>
              </td>
            </tr>
            {/* Within Groups Row */}
            <tr>
              <td className="border-start border-end text-start fw-bold px-3 small">
                {t("components.anovaSimulation.anovaTable.rowWithin")}
              </td>
              <td className="border-start border-end">
                <div className="mb-1">
                  <InlineMath math="S_{\varepsilon} = \sum_{i}^{k} \sum_{j}^{n} \left( x_{ij} - \bar{x}_{i} \right)^{2}" />
                </div>
                <div className="fw-bold border-top pt-1 small">
                  <InlineMath math={`S_{\\varepsilon} = ${ssw.toFixed(2)}`} />
                </div>
              </td>
              <td className="border-start border-end">
                <div className="mb-1">
                  <InlineMath math="DF_{\varepsilon} = n - k" />
                </div>
                <div className="fw-bold border-top pt-1 small">
                  <InlineMath math={`DF_{\\varepsilon} = ${dfW}`} />
                </div>
              </td>
              <td className="border-start border-end">
                <div className="mb-1">
                  <InlineMath math="M_{\varepsilon} = \frac{S_{\varepsilon}}{D F_{\varepsilon}}" />
                </div>
                <div className="fw-bold border-top pt-1 small">
                  <InlineMath math={`M_{\\varepsilon} = ${msW.toFixed(2)}`} />
                </div>
              </td>
            </tr>
            {/* Total Row */}
            <tr>
              <td className="border-start border-end text-start fw-bold px-3 small">
                {t("components.anovaSimulation.anovaTable.rowTotal")}
              </td>
              <td>
                <div className="mb-1">
                  <InlineMath math="S_T = \sum_i^k \sum_{j}^n (x_{ij} - \bar{x})^2" />
                </div>
                <div className="fw-bold border-top pt-1 small">
                  <InlineMath math={`S_T = ${sst.toFixed(2)}`} />
                </div>
              </td>
              <td className="border-start border-end">
                <div className="mb-1">
                  <InlineMath math="DF_T = n - 1" />
                </div>
                <div className="fw-bold border-top pt-1 small">
                  <InlineMath math={`DF_T = ${n - 1}`} />
                </div>
              </td>
              {/* Empty cell to fill the layout */}
              <td className="border-start border-end"></td>
            </tr>
          </tbody>
        </table>

        {/* DECISION BLOCK BELOW THE TABLE */}
        <div
          className={`mt-3 p-3 rounded text-center ${
            rejectH0 ? "bg-danger-subtle" : "bg-success-subtle"
          }`}
        >
          <div className="fw-bold mb-1">
            {t("components.anovaSimulation.anovaTable.decision")} (
            <InlineMath math="\alpha = 0.05" />)
          </div>
          <div className="small mb-1">
            <InlineMath
              math={`p \\approx ${
                pValue < 0.0001 ? "< 0.0001" : pValue.toFixed(4)
              }`}
            />
          </div>
          <div
            className={`fw-bold  ${rejectH0 ? "text-danger" : "text-success"}`}
          >
            {rejectH0
              ? t("components.anovaSimulation.anovaTable.rejectH0")
              : t("components.anovaSimulation.anovaTable.acceptH0")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnovaTable;
