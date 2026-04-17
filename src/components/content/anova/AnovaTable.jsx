// src/components/content/anova/AnovaTable.jsx
import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import { fisherFCDF } from "../../../utils/distributions";

const AnovaTable = ({ stats }) => {
  if (!stats) return null;

  const { sst, ssw, ssb, dfB, dfW, msB, msW, fStat, groupStats } = stats;
  const n = groupStats.reduce((acc, g) => acc + g.n, 0);

  // Výpočet p-hodnoty pomocou existujúcej F-distribúcie
  const alpha = 0.05;
  const pValue = 1 - fisherFCDF(fStat, dfB, dfW);
  const rejectH0 = pValue < alpha;

  return (
    <div className="table-responsive pb-2">
      <table className="table text-center align-middle mb-0">
        <thead className="table-active border fw-normal">
          <tr>
            <th style={{ width: "20%" }}>Zdroj variability</th>
            <th style={{ width: "25%" }}>Suma štvorcov</th>
            <th style={{ width: "15%" }}>Stupne voľnosti</th>
            <th style={{ width: "20%" }}>Priemerná suma štvorcov</th>
            <th style={{ width: "20%" }}>Testovacie kritérium</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-start border-end text-start fw-bold px-3 small">
              Medzi skupinami (faktor)
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
            <td rowSpan="2" className="border-end bg-secondary-subtle">
              <div className="mb-1">
                <InlineMath math="F = \frac{M_{\alpha}}{M_{\varepsilon}}" />
              </div>
              <div className="fw-bold fs-5 text-primary">
                <InlineMath math={`F = ${fStat.toFixed(3)}`} />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border-start border-end text-start fw-bold px-3 small">
              Vnútri skupín (reziduálna)
            </td>
            <td className="border-start border-end">
              <div className="mb-1">
                <InlineMath math="S_{\varepsilon} = \sum_{i}^{k} \sum_{j}^{n} \left( x_{ij} - \bar{x}_{i} \right)^{2}" />
              </div>
              <div className="fw-bold border-top pt-1 small">
                <InlineMath math={`S_{\\varepsilon} = ${ssw.toFixed(2)}`} />
              </div>
            </td>
            <td>
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
          <tr>
            <td className="border-start border-end text-start fw-bold px-3 small">
              Celkový
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
            <td
              colSpan="2"
              className={`border-start border-end align-middle ${
                rejectH0 ? "bg-danger-subtle" : "bg-success-subtle"
              }`}
            >
              <div className="d-flex flex-column justify-content-center h-100">
                <span className="fw-bold mb-1">
                  Rozhodnutie (<InlineMath math="\alpha = 0.05" />)
                </span>
                <span className="small mb-1">
                  <InlineMath
                    math={`p \\approx ${
                      pValue < 0.0001 ? "< 0.0001" : pValue.toFixed(4)
                    }`}
                  />
                </span>
                <span
                  className={`fw-bold ${
                    rejectH0 ? "text-danger" : "text-success"
                  }`}
                >
                  {rejectH0
                    ? "Zamietame H₀ (významný rozdiel)"
                    : "Nezamietame H₀ (rozdiely nie sú významné)"}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnovaTable;
