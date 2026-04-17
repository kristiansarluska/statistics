// src/components/content/anova/AnovaTable.jsx
import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const AnovaTable = ({ stats }) => {
  if (!stats) return null;

  const { sst, ssw, ssb, dfB, dfW, msB, msW, fStat, groupStats } = stats;
  const n = groupStats.reduce((acc, g) => acc + g.n, 0);

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
            <td>
              <div className="mb-1">
                <InlineMath math="M_{\alpha} = \frac{S_{\alpha}}{D F_{\alpha}}" />
              </div>
              <div className="fw-bold border-top pt-1 small">
                <InlineMath math={`M_{\\alpha} = ${msB.toFixed(2)}`} />
              </div>
            </td>
            <td rowSpan="2" className="border - right bg-secondary-subtle">
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
                <InlineMath
                  math={`S_{\\varepsilon} = ${ssw.toFixed(2)}`}
                />{" "}
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
                <InlineMath math="M_{\varepsilon} = \frac{S_\alpha}{D F_{\varepsilon}}" />
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
              rowSpan="2"
              style={{ border: "none", backgroundColor: "transparent" }}
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnovaTable;
