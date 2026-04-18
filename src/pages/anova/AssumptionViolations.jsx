// src/pages/anova/AssumptionViolations.jsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";

const AssumptionViolations = () => {
  return (
    <section
      id="violation"
      className="mb-5"
      style={{
        minHeight: "75vh",
        scrollMarginTop: "100px",
      }}
    >
      {" "}
      <h2 className="mb-4 fw-bold">Narušenie predpokladov ANOVY</h2>
      <div className="mb-4">
        Pred samotnou ANOVA analýzou je nevyhnutné overiť spomínané tri
        predpoklady:{" "}
        <ul>
          <li>nezávislosť meraní</li>
          <li>normalita rozdelenia</li>
          <li>homoskedasticita</li>
        </ul>
        Ich porušenie a následné použitie ANOVY môže viesť k chybným záverom —
        najmä k zvýšenému riziku chyby I. druhu. Nasledujúce metódy nahrádzajú
        klasickú ANOVU v situáciách, keď sú niektoré predpoklady porušené.
      </div>
      <div className="row mb-5 g-3">
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                Porušenie nezávislosti meraní
              </h6>
              <h5 className="card-title mb-2">Friedmannov test</h5>
              <p className="card-text small text-muted mb-0">
                Neparametrická alternatíva pre{" "}
                <strong className="text-body">
                  závislé (opakované) merania
                </strong>
                . Test mediánu pre viac ako dva súbory – na rozdiel od
                Kruskal-Wallisovho testu berie do úvahy závislosť výberov.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                Porušenie normality
              </h6>
              <h5 className="card-title mb-2">Kruskal-Wallisov test</h5>
              <p className="card-text small text-muted mb-0">
                <strong className="text-body">
                  Neparametrická náhrada ANOVY
                </strong>{" "}
                – zovšeobecnenie Mann-Whitneyho testu pre viac skupín. Namiesto
                stredných hodnôt testuje zhodu distribučných funkcií. Nefunguje
                dobre pri heterogénnych rozptyloch.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                Porušenie homogenity rozptylov
              </h6>
              <h5 className="card-title mb-2">Welchova ANOVA</h5>
              <p className="card-text small text-muted mb-0">
                Modifikácia ANOVY, ktorá{" "}
                <strong className="text-body">
                  nevyžaduje rovnaké rozptyly
                </strong>
                . Znižuje riziko chyby I. druhu pri nehomogénnych rozptyloch.
                Stále{" "}
                <strong className="text-body">predpokladá normalitu</strong> a
                pracuje lepšie pri podobných veľkostiach výberov.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssumptionViolations;
