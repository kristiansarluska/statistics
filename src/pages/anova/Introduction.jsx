// src/pages/anova/Introduction.jsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";

const Introduction = () => {
  return (
    <section id="introduction" className="mb-5">
      <p className="fst-italic lead">
        ANOVA (<em>Analysis of Variance</em>) je štatistická metóda na súčasné
        testovanie rozdielov stredných hodnôt <strong>troch a viacerých</strong>{" "}
        výberových súborov. Zisťuje, či pozorované rozdiely medzi skupinami
        možno pripísať sledovanému faktoru, alebo ide len o náhodné kolísanie.
      </p>

      <p>
        {" "}
        <strong>Príkladom môže byť</strong> porovnávanie úspešnosti skupín v
        riešení úloh na mape pri eye-tracking experimente. Zaujíma nás, či má
        dosiahnuté vzdelanie (faktor) štatisticky významný vplyv na dosiahnutú
        úspešnosť — alebo sú rozdiely medzi príslušníkmi skupín len dôsledkom
        náhodného kolísania.
      </p>
      {/* ANOVA USAGE */}
      <h4 className="mt-4 mb-3">Použitie ANOVY</h4>
      <p>
        Výber správneho testu závisí od{" "}
        <strong>počtu porovnávaných skupín</strong>. Nižšie sa nachádza prehľad
        testov podľa počtu skupín, vždy s uvedením neparametrickej alternatívy:
      </p>
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-secondary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-muted text-uppercase small mb-2">
                Jeden výber
              </h6>
              <p className="small mb-0">
                Jednovýberový t-test
                <br />
                <span className="text-muted">
                  Jednovýberový Wilcoxonov test
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-secondary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-muted text-uppercase small mb-2">
                Dva výbery
              </h6>
              <p className="small mb-0">
                Párový / dvojvýberový t-test
                <br />
                <span className="text-muted">
                  Wilcoxonov / Mann-Whitneyho test
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-primary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-primary text-uppercase small mb-2">
                Tri a viac výberov
              </h6>
              <p className="small mb-0">
                <strong>ANOVA</strong>
                <br />
                <span className="text-muted">Kruskal-Wallisov test</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WHY NOT MULTIPLE T-TESTS */}
      <p>
        Mohlo by sa zdať, že pri <InlineMath math="k = 3" /> skupinách možno
        jednoducho vykonať <InlineMath math="\binom{k}{2} = \binom{3}{2} = 3" />{" "}
        nezávislé t-testy. Každý test pracuje s hladinou spoľahlivosti 95 %, no
        celková spoľahlivosť pri viacerých súčasných testoch klesá:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math=" 0{,}95^3 = 0{,}857 \quad \Rightarrow \quad \alpha = 0{,}143" />
      </div>
      <p>
        Reálna chyba I. druhu tým narastie na <strong>14,3 %</strong> — takmer
        trojnásobne oproti stanovenej hodnote{" "}
        <InlineMath math="\alpha = 0{,}05" />. S rastúcim počtom skupín sa tento
        problém ďalej zhoršuje. ANOVA rieši celé porovnanie jedným testom, ktorý
        zohľadňuje vzájomné väzby a násobné porovnávanie.
      </p>

      {/* PREREQUISITES */}
      <h4 className="mt-5 mb-3">Predpoklady ANOVY</h4>
      <p>
        Spoľahlivosť ANOVY závisí od troch základných predpokladov. K ich
        overeniudochádza na začiatku analýzy, ešte pred vykonaním samotnej
        ANOVY.
      </p>
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2 text-primary">Nezávislosť meraní</h6>
              <p className="small text-muted mb-0">
                Pozorovania sú navzájom nezávislé — vnútri skupín aj medzi
                skupinami. Ide o dizajnový predpoklad závislý od spôsobu zberu
                dát.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2 text-primary">Normalita rozdelenia</h6>
              <p className="small text-muted mb-0">
                Dáta každej skupiny pochádzajú z normálneho rozdelenia. Pri
                väčších výberoch je ANOVA voči odchýlkam pomerne robustná.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2 text-primary">Homoskedasticita</h6>
              <p className="small text-muted mb-0">
                Rozptyly všetkých skupín sú rovnaké – rozptyl nezávisí od
                skupiny. Silnejší predpoklad než normalita. Overenie
                Bartlettovým alebo Leveneho testom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HOMOGENEITY TESTS */}
      <h5 className="mt-4 mb-3">Testy homogenity rozptylov</h5>
      <p>
        Tieto testy skúmajú rovnakú hypotézu o zhode rozptylov a líšia sa
        citlivosťou na porušenie normality:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="H_0\colon \sigma_1^2 = \sigma_2^2 = \cdots = \sigma_k^2" />
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-info border-2 ">
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
          <div className="card h-100 shadow-sm border-success border-2">
            <div className="card-body">
              <h5 className="card-title text-success">Leveneho test</h5>
              <p className="card-text small">
                Robustnejšia alternatíva — menej citlivý na porušenie normality.
                Vhodný, keď normalita dát nie je istá alebo bola zamietnutá.
              </p>
              <p className="card-text small text-muted mb-0">
                Testová štatistika má F-rozdelenie so stupňami voľnosti{" "}
                <InlineMath math="k - 1" /> v čitateli a{" "}
                <InlineMath math="n - k" /> v menovateli.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
