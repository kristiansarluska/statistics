// src/pages/anova/SingleFactorAnova.jsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";

const SingleFactorAnova = () => {
  return (
    <section id="single-factor" className="mb-5">
      <h2 className="mb-4 fw-bold">Jednofaktorová ANOVA</h2>

      <p>
        Skúma vplyv <strong>jedného faktora</strong> (kategorickej premennej) na
        spojitú náhodnú veličinu. Faktor definuje <InlineMath math="k" /> skupín
        (kategórií). Testujeme nulovú hypotézu, že všetky skupinové stredné
        hodnoty pochádzajú z rovnakej populácie:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="H_0\colon \mu_1 = \mu_2 = \cdots = \mu_k" />
      </div>
      <p>
        Alternatívna hypotéza hovorí, že <strong>aspoň jedna</strong> stredná
        hodnota pochádza z inej populácie. ANOVA sama osebe neurčuje, ktorá
        dvojica sa líši, táto skutočnosť sa zisťuje až prípadnými{" "}
        <strong>post-hoc testmi</strong>.
      </p>

      <p>
        Každé pozorovanie <InlineMath math="x_{kn}" /> (j-tý prvok k-tej
        skupiny) sa rozkladá na tri zložky:
      </p>
      <div className="text-center overflow-none my-4">
        <BlockMath math="x_{kn} = \mu + \alpha_k + \varepsilon_{kn}" />

        <div className="text-muted small text-start d-inline-block">
          <InlineMath math="\mu" /> – celkový priemer
          <br />
          <InlineMath math="\alpha_k" /> – efekt faktora
          <br />
          <InlineMath math="\varepsilon_{kn}" /> – náhodná chyba
        </div>
      </div>

      {/* VARIANCE DECOMPOSITION */}
      <h4 className="mt-5 mb-3">Rozklad variability</h4>
      <p>
        Základnou myšlienkou ANOVY je, že celková variabilita dát{" "}
        <InlineMath math="S_T" /> sa rozkladá na dve nezávislé zložky. Ak je
        vplyv faktora skutočný, variabilita <em>medzi skupinami</em> bude
        výrazne prevyšovať variabilitu <em>vnútri skupín</em>.
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="S_T = S_\alpha + S_\varepsilon" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-primary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-primary">
                Variabilita medzi skupinami <InlineMath math="S_\alpha" />
              </h5>
              <p className="card-text small">
                Meria vzdialenosť skupinových priemerov od celkového priemeru.
                Zachytáva <strong>vplyv faktora</strong>. Čím väčšia, tým
                výraznejší je efekt sledovanej kategórie.
              </p>
              <div className="text-center overflow-auto mt-3">
                <BlockMath math="S_\alpha = n_i \sum_{i}^{k} (\bar{x}_{i} - \bar{x})^2" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-success border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-success">
                Variabilita vnútri skupín <InlineMath math="S_\varepsilon" />
              </h5>
              <p className="card-text small">
                Prirodzená variabilita pozorovaní okolo ich skupinového
                priemeru. <strong>Náhodná</strong> zložka — nezávisí od faktora.
              </p>
              <div className="text-center overflow-auto mt-3">
                <BlockMath math="S_\varepsilon = \sum_{i}^{k}\sum_{j}^{n} (x_{ij} - \bar{x}_{i})^2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* F-TEST */}
      <h4 className="mt-5 mb-3">Testové kritérium a rozhodovanie</h4>
      <p>
        Štatistika <InlineMath math="F" /> je pomer variability{" "}
        <em>medzi skupinami</em> voči variabilite <em>vnútri skupín</em>, oba
        výrazy normalizované príslušnými stupňami voľnosti. Za platnosti{" "}
        <InlineMath math="H_0" /> má Fisherovo F-rozdelenie s{" "}
        <InlineMath math="k-1" /> a <InlineMath math="n-k" /> stupňami voľnosti:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="F_{(k-1,\; n-k)} = \frac{S_\alpha}{S_\varepsilon} \cdot \frac{n-k}{k-1} = \frac{M_\alpha}{M_\varepsilon}" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-danger">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="F > F_{1-\alpha}" /> → zamietame{" "}
                <InlineMath math="H_0" />
              </h6>
              <p className="small text-muted mb-0">
                Rozdiel je štatisticky významný, variabilita medzi skupinami je
                výrazne väčšia ako vnútri skupín. Aspoň jeden skupinový priemer
                sa štatisticky významne líši od ostatných.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="F \leq F_{1-\alpha}" /> → nezamietame{" "}
                <InlineMath math="H_0" />
              </h6>
              <p className="small text-muted mb-0">
                Rozdiel nie je štatisticky významný, variabilita medzi skupinami
                je porovnateľná s variabilitou vnútri skupín. Pozorované
                rozdiely priemerov možno pripísať náhodným výkyvom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleFactorAnova;
