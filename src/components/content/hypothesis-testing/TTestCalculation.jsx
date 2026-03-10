// src/components/content/hypothesis-testing/TTestCalculation.jsx
import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

const TTestCalculation = ({
  stats,
  expectedValue,
  alpha,
  selectedOkres,
  isSignificant,
}) => {
  return (
    <div
      className="card shadow-sm border-0 mx-auto mt-3"
      style={{ maxWidth: "620px" }}
    >
      <div className="card-body">
        <h6 className="card-subtitle mb-3 text-muted text-center">
          Výpočet t-štatistiky pre okres {selectedOkres}
        </h6>
        <div className="text-center mb-2">
          <BlockMath math="t = \frac{\bar{x} - \mu_0}{\dfrac{s}{\sqrt{n}}}" />
        </div>
        <div className="text-center mb-3">
          <BlockMath
            math={`t = \\frac{${stats.mean.toFixed(2)} - ${expectedValue}}{\\dfrac{${stats.sd.toFixed(2)}}{\\sqrt{${stats.n}}}} = \\frac{${(stats.mean - expectedValue).toFixed(2)}}{${(stats.sd / Math.sqrt(stats.n)).toFixed(4)}} = ${stats.t.toFixed(4)}`}
          />
        </div>
        <div className="row text-center small text-muted g-2">
          {[
            {
              math: `\\bar{x} = ${stats.mean.toFixed(2)}`,
              label: "výb. priemer (%)",
            },
            { math: `\\mu_0 = ${expectedValue}`, label: "ref. hodnota (%)" },
            { math: `s = ${stats.sd.toFixed(2)}`, label: "smer. odch." },
            { math: `n = ${stats.n}`, label: "počet obcí" },
          ].map(({ math, label }) => (
            <div key={label} className="col-6 col-sm-3">
              <InlineMath math={math} />
              <div>{label}</div>
            </div>
          ))}
        </div>

        <hr className="my-3" />

        <h6 className="card-subtitle mb-2 text-muted text-center">
          Výpočet p-hodnoty
        </h6>
        <div className="text-center mb-2">
          <BlockMath math="p = 2 \cdot P(T_{df} > |t|) = 2 \cdot (1 - F_{t}(|t|))" />
        </div>
        <div className="text-center mb-3">
          <BlockMath
            math={`p = 2 \\cdot (1 - F_{${stats.df}}(${Math.abs(stats.t).toFixed(4)})) = ${stats.pValue.toFixed(4)}`}
          />
        </div>
        <p className="small text-muted text-center mb-3">
          kde <InlineMath math={`F_{${stats.df}}`} /> je distribučná funkcia
          Studentovho t-rozdelenia s <InlineMath math={`${stats.df}`} />{" "}
          stupňami voľnosti.
        </p>

        <hr className="my-3" />

        <div
          className={`rounded p-2 text-center small ${isSignificant ? "bg-danger-subtle" : "bg-success-subtle"}`}
        >
          <div
            className={`fw-bold mb-1 ${isSignificant ? "text-danger" : "text-success"}`}
          >
            {isSignificant
              ? `p = ${stats.pValue.toFixed(4)} < α = ${alpha} → zamietame H₀`
              : `p = ${stats.pValue.toFixed(4)} ≥ α = ${alpha} → nezamietame H₀`}
          </div>
          <div className="text-muted">
            Ekvivalentne:{" "}
            <InlineMath math={`|t| = ${Math.abs(stats.t).toFixed(4)}`} />
            {isSignificant ? " > " : " ≤ "}
            <InlineMath math={`t_{\\alpha/2} = ${stats.tCrit.toFixed(4)}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTestCalculation;
