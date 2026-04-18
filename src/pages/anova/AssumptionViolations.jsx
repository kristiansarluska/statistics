// src/pages/anova/AssumptionViolations.jsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";

const AssumptionViolations = () => {
  return (
    <section id="violation" className="mb-5">
      <h2 className="mb-4 fw-bold">Predpoklady a ich narušenie</h2>
      <p>
        Pred samotnou ANOVA analýzou je nevyhnutné overiť tri kľúčové
        predpoklady. Ich porušenie môže viesť k chybným záverom — najmä k
        zvýšenému riziku chyby I. druhu.
      </p>

      {/* THREE ASSUMPTIONS */}
      <div className="list-group shadow-sm mb-5">
        <div className="list-group-item py-3">
          <div className="d-flex align-items-center mb-2">
            <span className="badge bg-primary me-2">1</span>
            <h5 className="mb-0">Nezávislosť meraní</h5>
          </div>
          <p className="mb-1 text-muted small">
            Pozorovania musia byť navzájom nezávislé — vnútri skupín aj medzi
            skupinami. Ide o{" "}
            <strong className="text-body">dizajnový predpoklad</strong> závislý
            od spôsobu zberu dát. Testom ho priamo overiť nie je možné —
            zabezpečí sa správnym návrhom výskumu (náhodný výber, absencia
            opakovaných meraní na tých istých jednotkách).
          </p>
        </div>

        <div className="list-group-item py-3">
          <div className="d-flex align-items-center mb-2">
            <span className="badge bg-primary me-2">2</span>
            <h5 className="mb-0">Normalita rozdelenia</h5>
          </div>
          <p className="mb-1 text-muted small">
            Dáta v každej skupine by mali pochádzať z normálneho rozdelenia{" "}
            <InlineMath math="X_1, \ldots, X_k \sim N(\mu, \sigma^2)" />. ANOVA
            je voči miernym odchýlkam od normality pomerne{" "}
            <strong className="text-body">robustná</strong>, najmä pri väčších
            výberoch (<InlineMath math="n > 30" />
            ), kde vplyv normality postupne klesá vďaka centrálnej limitnej
            vete.
          </p>
          <p className="text-muted small mb-0">
            <strong className="text-body">Overenie:</strong> Shapiro-Wilk test,
            Kolmogorov-Smirnov test, Q-Q graf.
          </p>
        </div>

        <div className="list-group-item py-3">
          <div className="d-flex align-items-center mb-2">
            <span className="badge bg-primary me-2">3</span>
            <h5 className="mb-0">Homoskedasticita (zhoda rozptylov)</h5>
          </div>
          <p className="mb-1 text-muted small">
            Rozptyly všetkých skupín musia byť rovnaké:{" "}
            <InlineMath math="\sigma_1^2 = \sigma_2^2 = \cdots = \sigma_k^2" />.
            Ide o <strong className="text-body">silnejší predpoklad</strong> ako
            normalita — jeho porušenie (heteroskedasticita) výrazne zvyšuje
            riziko chyby I. druhu.
          </p>
          <p className="text-muted small mb-0">
            <strong className="text-body">Overenie:</strong> Bartlettov test,
            Leveneho test.
          </p>
        </div>
      </div>

      {/* HOMOGENEITY TESTS */}
      <h4 className="mt-4 mb-3">Testy homogenity rozptylov</h4>
      <p>
        Oba testy skúmajú rovnakú hypotézu o zhode rozptylov, no líšia sa
        citlivosťou na porušenie normality:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="H_0\colon \sigma_1^2 = \sigma_2^2 = \cdots = \sigma_k^2" />
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-info border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-info">Bartlettov test</h5>
              <p className="card-text small">
                Presnejší a silnejší test, no vyžaduje splnený predpoklad
                normality. Ak normalita nebola zamietnutá, uprednostňujeme
                Bartlettov test pred Leveneho.
              </p>
              <p className="card-text small text-muted mb-0">
                Testová štatistika má <InlineMath math="\chi^2" /> rozdelenie s{" "}
                <InlineMath math="k - 1" /> stupňami voľnosti.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-warning border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title">Leveneho test</h5>
              <p className="card-text small">
                Robustnejšia alternatíva — menej citlivý na porušenie normality.
                Vhodný, keď normalita dát nie je istá alebo bola zamietnutá.
              </p>
              <p className="card-text small text-muted mb-0">
                Testová štatistika má F-rozdelenie s <InlineMath math="k - 1" />{" "}
                a <InlineMath math="n - k" /> stupňami voľnosti.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HETEROSKEDASTICITY */}
      <h4 className="mt-4 mb-3">Heteroskedasticita</h4>
      <p>
        Heteroskedasticita nastáva, keď rozptyl nie je konštantný — závisí od
        hodnoty inej premennej. Je to opak homoskedasticity a v reálnych dátach
        je <strong>pomerne bežná</strong> (napr. závislosť variability príjmu od
        veku). Okrem štatistických testov možno heteroskedasticitu odhaliť aj
        graficky — sledovaním reziduálov voči predikovaným hodnotám. Ak rozptyl
        reziduálov systematicky rastie alebo klesá, pravdepodobne ide o
        heteroskedasticitu.
      </p>

      {/* ALTERNATIVES */}
      <h4 className="mt-5 mb-3">Alternatívy pri narušení predpokladov</h4>
      <p>
        Nasledujúce metódy nahrádzajú klasickú ANOVU v situáciách, keď sú
        niektoré predpoklady porušené.
      </p>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                Porušená homoskedasticita
              </h6>
              <h5 className="card-title mb-2">Welchova ANOVA</h5>
              <p className="card-text small text-muted mb-0">
                Modifikácia ANOVY, ktorá{" "}
                <strong className="text-body">
                  nevyžaduje rovnaké rozptyly
                </strong>
                . Znižuje riziko chyby I. druhu pri nehomogénnych rozptyloch.
                Stále predpokladá normalitu a pracuje lepšie pri podobných
                veľkostiach výberov.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                Výrazná odchýlka od normality
              </h6>
              <h5 className="card-title mb-2">Brown-Forsythov test</h5>
              <p className="card-text small text-muted mb-0">
                Riešenie pre výrazné odchýlky od normality.{" "}
                <strong className="text-body">
                  Transformuje vstupné dáta pomocou mediánu
                </strong>{" "}
                (odstraňuje vplyv šikmosti) a následne vykonáva klasickú ANOVU
                na transformovaných dátach.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                Porušená nezávislosť meraní
              </h6>
              <h5 className="card-title mb-2">Friedmannov test</h5>
              <p className="card-text small text-muted mb-0">
                Neparametrická alternatíva pre{" "}
                <strong className="text-body">
                  závislé (opakované) merania
                </strong>
                . Test mediánu pre viac ako dva súbory — na rozdiel od
                Kruskal-Wallisovho testu berie do úvahy závislosť výberov.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                Výrazné porušenie normality
              </h6>
              <h5 className="card-title mb-2">Kruskal-Wallisov test</h5>
              <p className="card-text small text-muted mb-0">
                <strong className="text-body">
                  Neparametrická náhrada ANOVY
                </strong>{" "}
                — zovšeobecnenie Mann-Whitneyho testu pre viac skupín. Namiesto
                stredných hodnôt testuje zhodu distribučných funkcií. Pozor —
                pre heterogénne rozptyly nefunguje dobre ani on.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KRUSKAL-WALLIS DETAIL */}
      <h4 className="mt-5 mb-3">Kruskal-Wallisov test — podrobnejšie</h4>
      <p>
        Test netestuje zhodu stredných hodnôt, ale zhodu výberových
        distribučných funkcií:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="H_0\colon F_1(x) = F_2(x) = \cdots = F_k(x)" />
      </div>
      <p>
        Všetky pozorovania sa zoradia podľa veľkosti a priradia sa im poradové
        čísla <InlineMath math="R_{ij}" />. Testové kritérium{" "}
        <InlineMath math="Q" /> má za platnosti <InlineMath math="H_0" />{" "}
        rozdelenie <InlineMath math="\chi^2" /> s <InlineMath math="k - 1" />{" "}
        stupňami voľnosti:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="Q = \frac{12}{n(n+1)} \sum_{i=1}^{k} \frac{T_i^2}{n_i} - 3(n+1)" />
      </div>
      <p className="text-muted small">
        kde <InlineMath math="T_i = \sum_{j=1}^{n_i} R_{ij}" /> je súčet poradí
        v i-tej skupine, <InlineMath math="n_i" /> je počet pozorovaní v i-tej
        skupine a <InlineMath math="n" /> celkový počet pozorovaní. Pre post-hoc
        analýzu po zamietnutí <InlineMath math="H_0" /> sa používa{" "}
        <strong>Dunnov test</strong> alebo adjustovaný Mann-Whitneyho test.
      </p>

      {/* DECISION GUIDE */}
      <div className="bg-body-tertiary border rounded-3 p-4 shadow-sm mt-4">
        <h6 className="mb-3">Ako vybrať správny postup?</h6>
        <div className="table-responsive">
          <table className="table table-sm table-borderless mb-0 small">
            <thead className="text-muted">
              <tr>
                <th>Situácia</th>
                <th>Odporúčaný test</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Splnené všetky predpoklady</td>
                <td>
                  <strong>Klasická ANOVA</strong>
                </td>
              </tr>
              <tr>
                <td>Porušená len homoskedasticita</td>
                <td>
                  <strong>Welchova ANOVA</strong>
                </td>
              </tr>
              <tr>
                <td>Výrazná odchýlka od normality, homogénne rozptyly</td>
                <td>
                  <strong>Kruskal-Wallisov test</strong>
                </td>
              </tr>
              <tr>
                <td>Závislé (opakované) merania</td>
                <td>
                  <strong>Friedmannov test</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AssumptionViolations;
