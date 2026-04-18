// src/pages/anova/SingleFactorAnova.jsx
import React from "react";

const SingleFactorAnova = () => {
  return (
    <section id="single-factor" className="mb-5">
      <h2 className="mb-4">Jednofaktorová ANOVA</h2>
      <p>
        Skúma vplyv jedného faktora na spojitú náhodnú veličinu. Testujeme
        nulovú hypotézu, že všetky stredné hodnoty skupín sú rovnaké:
      </p>
      <div className="text-center my-4 bg-light p-3 rounded shadow-sm">
        <code>H₀: μ₁ = μ₂ = ... = μₖ</code>
      </div>

      <h4>Rozklad variability</h4>
      <p>ANOVA rozkladá celkovú variabilitu dát (SST) na dve zložky:</p>
      <ul>
        <li>
          <strong>Variabilita medzi skupinami (SSB):</strong> Spôsobená vplyvom
          faktora.
        </li>
        <li>
          <strong>Variabilita vnútri skupín (SSW):</strong> Spôsobená náhodnými
          chybami (reziduálna).
        </li>
      </ul>

      <div className="table-responsive mt-4">
        <table className="table table-bordered shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Zdroj variability</th>
              <th>Súčet štvorcov (SS)</th>
              <th>Stupne voľnosti (df)</th>
              <th>Rozptyl (MS)</th>
              <th>F-štatistika</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Faktor (Medzi skupinami)</td>
              <td>SSB</td>
              <td>k - 1</td>
              <td>MSB = SSB / dfB</td>
              <td
                rowSpan="2"
                className="align-middle text-center font-weight-bold"
              >
                F = MSB / MSW
              </td>
            </tr>
            <tr>
              <td>Reziduálna (Vnútri skupín)</td>
              <td>SSW</td>
              <td>n - k</td>
              <td>MSW = SSW / dfW</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SingleFactorAnova;
