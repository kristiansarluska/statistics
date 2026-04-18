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

      <div className="alert alert-info shadow-sm mb-4">
        <strong>Príklad:</strong> Porovnávame úspešnosť študentov piatich
        stredných škôl v celoplošnom teste. Zaujíma nás, či má{" "}
        <em>typ školy</em> (faktor) štatisticky významný vplyv na dosiahnuté
        skóre — alebo sú rozdiely medzi školami len dôsledkom náhodného
        kolísania.
      </div>

      {/* WHERE ANOVA FITS */}
      <h4 className="mt-4 mb-3">Kam ANOVA patrí?</h4>
      <p>
        Výber správneho testu závisí od{" "}
        <strong>počtu porovnávaných skupín</strong>. ANOVA je prirodzeným
        rozšírením t-testu pre prípad troch a viacerých skupín.
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
                <span className="text-muted">Wilcoxonov test</span>
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
                <span className="text-muted">Mann-Whitneyho test</span>
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
      <h4 className="mt-5 mb-3">Prečo nestačí séria t-testov?</h4>
      <p>
        Zdalo by sa, že pri <InlineMath math="k = 3" /> skupinách možno
        jednoducho vykonať <InlineMath math="\binom{k}{2} = \binom{3}{2} = 3" />{" "}
        nezávislé t-testy. Každý test pracuje s hladinou spoľahlivosti 95 %, no
        celková spoľahlivosť pri viacerých súčasných testoch klesá:
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="0{,}95 \times 0{,}95 \times 0{,}95 = 0{,}857 \quad \Rightarrow \quad \alpha_{\text{celkové}} = 0{,}143" />
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
        Platnosť ANOVY závisí od troch kľúčových predpokladov. Ich overenie
        patrí vždy na začiatok analýzy, ešte pred samotným testom.
      </p>
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2">Nezávislosť meraní</h6>
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
              <h6 className="mb-2">Normalita rozdelenia</h6>
              <p className="small text-muted mb-0">
                Dáta každej skupiny pochádzajú z normálneho rozdelenia{" "}
                <InlineMath math="N(\mu, \sigma^2)" />. Pri väčších výberoch je
                ANOVA voči odchýlkam pomerne robustná.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2">Homoskedasticita</h6>
              <p className="small text-muted mb-0">
                Rozptyly všetkých skupín sú rovnaké — rozptyl nezávisí od
                skupiny. Porušenie zvyšuje riziko chyby I. druhu. Overíme
                Bartlettovým alebo Leveneho testom.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-body-tertiary border rounded-3 p-4 shadow-sm mt-4">
        <h6 className="mb-2">Typy ANOVY</h6>
        <p className="mb-0 small text-muted">
          Podľa počtu sledovaných faktorov rozlišujeme{" "}
          <strong className="text-body">jednofaktorovú ANOVU</strong> (one-way
          ANOVA) — sleduje vplyv jedného faktora, a{" "}
          <strong className="text-body">viacfaktorovú ANOVU</strong> (two-way a
          vyššie) — súčasne sleduje vplyv dvoch a viacerých faktorov vrátane ich
          vzájomných interakcií.
        </p>
      </div>
    </section>
  );
};

export default Introduction;
