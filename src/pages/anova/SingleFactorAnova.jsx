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
        hodnoty sú rovnaké:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="H_0\colon \mu_1 = \mu_2 = \cdots = \mu_k" />
        <p className="text-muted small mb-0">
          Presné znenie: všetky stredné hodnoty pochádzajú z tej istej
          populácie.
        </p>
      </div>
      <p>
        Alternatívna hypotéza hovorí, že <strong>aspoň jedna</strong> stredná
        hodnota pochádza z inej populácie. ANOVA ako taká neurčuje, ktorá
        dvojica sa líši — to riešia <strong>post-hoc testy</strong>.
      </p>

      {/* MODEL */}
      <h4 className="mt-5 mb-3">Model jednofaktorovej ANOVY</h4>
      <p>
        Každé pozorovanie <InlineMath math="x_{ij}" /> (j-tý prvok i-tej
        skupiny) sa rozkladá na tri zložky:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="x_{ij} = \mu + \alpha_i + \varepsilon_{ij}" />
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="\mu" /> — celkový priemer
              </h6>
              <p className="small text-muted mb-0">
                Spoločná (grand) stredná hodnota všetkých pozorovaní naprieč
                všetkými skupinami.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="\alpha_i" /> — efekt faktora
              </h6>
              <p className="small text-muted mb-0">
                Vplyv i-tej kategórie faktora (napr. typ školy). Za platnosti{" "}
                <InlineMath math="H_0" /> je <InlineMath math="\alpha_i = 0" />{" "}
                pre všetky skupiny.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="\varepsilon_{ij}" /> — náhodná chyba
              </h6>
              <p className="small text-muted mb-0">
                Reziduálna variabilita nevysvetlená faktorom. Predpokladáme{" "}
                <InlineMath math="\varepsilon_{ij} \sim N(0, \sigma^2)" />.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VARIANCE DECOMPOSITION */}
      <h4 className="mt-5 mb-3">Rozklad variability</h4>
      <p>
        Kľúčová myšlienka ANOVY: celková variabilita dát{" "}
        <InlineMath math="SS_T" /> sa rozkladá na dve nezávislé zložky. Ak je
        vplyv faktora skutočný, variabilita <em>medzi skupinami</em> bude
        výrazne prevyšovať variabilitu <em>vnútri skupín</em>.
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="SS_T = SS_\alpha + SS_\varepsilon" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-primary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-primary">
                Variabilita medzi skupinami <InlineMath math="SS_\alpha" />
              </h5>
              <p className="card-text small">
                Meria vzdialenosť skupinových priemerov od celkového priemeru.
                Zachytáva <strong>vplyv faktora</strong>. Čím väčšia, tým
                výraznejší je efekt sledovanej kategórie.
              </p>
              <div className="text-center overflow-auto mt-3">
                <BlockMath math="SS_\alpha = n_i \sum_{i=1}^{k} (\bar{x}_{i} - \bar{x})^2" />
              </div>
              <p className="text-muted small mb-0">
                <InlineMath math="\bar{x}_{i}" /> — skupinový priemer,{" "}
                <InlineMath math="\bar{x}" /> — celkový priemer,{" "}
                <InlineMath math="n_i" /> — počet prvkov v skupine
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-success border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-success">
                Variabilita vnútri skupín <InlineMath math="SS_\varepsilon" />
              </h5>
              <p className="card-text small">
                Prirodzená variabilita pozorovaní okolo ich skupinového
                priemeru. <strong>Reziduálna (náhodná)</strong> zložka —
                nezávisí od faktora.
              </p>
              <div className="text-center overflow-auto mt-3">
                <BlockMath math="SS_\varepsilon = \sum_{i=1}^{k}\sum_{j=1}^{n} (x_{ij} - \bar{x}_{i})^2" />
              </div>
              <p className="text-muted small mb-0">
                Suma kvadrátov odchýlok každého pozorovania od príslušného
                skupinového priemeru.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ANOVA TABLE */}
      <h4 className="mt-5 mb-3">Tabuľka ANOVY</h4>
      <p>
        Priemerné sumy štvorcov (MS) vzniknú vydelením SS zodpovedajúcimi
        stupňami voľnosti. Ich podiel tvorí testové kritérium{" "}
        <InlineMath math="F" />:
      </p>
      <div className="table-responsive mt-3 shadow-sm mb-4">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>Zdroj variability</th>
              <th>Suma štvorcov (SS)</th>
              <th>Stupne voľnosti (df)</th>
              <th>Priem. štvorec (MS)</th>
              <th>F-štatistika</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Medzi skupinami</strong>
                <br />
                <span className="text-muted small">(vplyv faktora)</span>
              </td>
              <td>
                <InlineMath math="SS_\alpha" />
              </td>
              <td>
                <InlineMath math="k - 1" />
              </td>
              <td>
                <InlineMath math="MS_\alpha = \dfrac{SS_\alpha}{k-1}" />
              </td>
              <td rowSpan="2" className="align-middle text-center">
                <InlineMath math="F = \dfrac{MS_\alpha}{MS_\varepsilon}" />
              </td>
            </tr>
            <tr>
              <td>
                <strong>Vnútri skupín</strong>
                <br />
                <span className="text-muted small">(reziduálna)</span>
              </td>
              <td>
                <InlineMath math="SS_\varepsilon" />
              </td>
              <td>
                <InlineMath math="n - k" />
              </td>
              <td>
                <InlineMath math="MS_\varepsilon = \dfrac{SS_\varepsilon}{n-k}" />
              </td>
            </tr>
            <tr className="table-secondary">
              <td>
                <strong>Celková</strong>
              </td>
              <td>
                <InlineMath math="SS_T" />
              </td>
              <td>
                <InlineMath math="n - 1" />
              </td>
              <td colSpan="2" className="text-muted small">
                —
              </td>
            </tr>
          </tbody>
        </table>
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
        <BlockMath math="F_{(k-1,\; n-k)} = \frac{SS_\alpha}{SS_\varepsilon} \cdot \frac{n-k}{k-1} = \frac{MS_\alpha}{MS_\varepsilon}" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="F > F_{1-\alpha}" /> → zamietame{" "}
                <InlineMath math="H_0" />
              </h6>
              <p className="small text-muted mb-0">
                Variabilita medzi skupinami je výrazne väčšia ako vnútri skupín.
                Aspoň jeden skupinový priemer sa štatisticky významne líši od
                ostatných.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="F \leq F_{1-\alpha}" /> → nezamietame{" "}
                <InlineMath math="H_0" />
              </h6>
              <p className="small text-muted mb-0">
                Variabilita medzi skupinami je porovnateľná s variabilitou
                vnútri skupín. Pozorované rozdiely priemerov možno pripísať
                náhodným výkyvom.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-warning shadow-sm">
        <strong>
          Pozor na interpretáciu <InlineMath math="H_A" />:
        </strong>{" "}
        Zamietnutie <InlineMath math="H_0" /> hovorí len o tom, že{" "}
        <em>aspoň jedna</em> dvojica skupín sa štatisticky líši — nie ktorá
        konkrétne. Na identifikáciu konkrétnych rozdielov slúžia{" "}
        <strong>post-hoc testy</strong> popísané v nasledujúcej sekcii.
      </div>

      {/* TWO-WAY NOTE */}
      <h4 className="mt-5 mb-3">Viacfaktorová ANOVA</h4>
      <p>
        Pri sledovaní vplyvu <strong>dvoch faktorov</strong>{" "}
        <InlineMath math="A" /> a <InlineMath math="B" /> sa rozklad variability
        rozširuje o ďalšiu zložku a voliteľne aj o interakčný efekt:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="SS_T = SS_\alpha + SS_\beta + SS_{\alpha\beta} + SS_\varepsilon" />
      </div>
      <p className="text-muted small">
        <InlineMath math="SS_\alpha" /> — vplyv faktora A,{" "}
        <InlineMath math="SS_\beta" /> — vplyv faktora B,{" "}
        <InlineMath math="SS_{\alpha\beta}" /> — interakcia A × B (zmena efektu
        jedného faktora v závislosti od úrovne druhého),{" "}
        <InlineMath math="SS_\varepsilon" /> — reziduálna variabilita. Pre každú
        zložku sa zostaví samostatné testové kritérium <InlineMath math="F" /> s
        príslušnými stupňami voľnosti.
      </p>
    </section>
  );
};

export default SingleFactorAnova;
