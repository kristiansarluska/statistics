import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

function GeneralProcedure() {
  return (
    <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
      <section id="procedure" className="scroll-mt-4">
        <h2 className="mb-4">Všeobecný postup testovania</h2>
        <p>
          Testovanie hypotéz vždy prebieha v niekoľkých štandardizovaných
          krokoch. Na demonštráciu využijeme dáta obcí Olomouckého kraja (zdroj:
          ArcČR 4.3). Budeme testovať, či je hustota zaľudnenia v týchto obciach
          porovnateľná s celorepublikovým priemerom.
        </p>

        {/* Step 1: Formulation */}
        <div className="mt-5">
          <h4>1. Formulácia hypotéz</h4>
          <p>
            Základom je stanovenie nulovej hypotézy (<InlineMath math="H_0" />
            ), ktorá zvyčajne vyjadruje očakávaný stav, neexistenciu rozdielu
            alebo rovnosť parametrov. Oproti nej stoji alternatívna hypotéza (
            <InlineMath math="H_A" />
            ), ktorá predstavuje logický opak a potvrdzuje existenciu
            štatisticky významného rozdielu. V dátach vždy hľadáme dôkazy pre
            zamietnutie <InlineMath math="H_0" />.
          </p>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Aplikácia na dáta
              </h6>
              <p className="card-text">
                Hustotu zaľudnenia počítame z atribútov{" "}
                <code>Poc_obyv_SLDB_2021</code> a <code>shape_Area</code>{" "}
                (plocha). Predpokladajme, že priemerná hustota zaľudnenia obcí v
                ČR je 136 obyv./km².
              </p>
              <ul>
                <li>
                  <strong>
                    <InlineMath math="H_0: \mu = 136" />
                  </strong>{" "}
                  (Priemerná hustota obcí kraja sa štatisticky nelíši od
                  priemeru ČR)
                </li>
                <li>
                  <strong>
                    <InlineMath math="H_A: \mu \neq 136" />
                  </strong>{" "}
                  (Priemerná hustota obcí kraja sa líši - obojstranná hypotéza)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 2: Significance Level */}
        <div className="mt-5">
          <h4>
            2. Voľba hladiny významnosti (<InlineMath math="\alpha" />)
          </h4>
          <p>
            Hladina významnosti predstavuje maximálne prijateľné riziko, že
            nesprávne zamietneme nulovú hypotézu, hoci v skutočnosti platí (tzv.
            chyba I. druhu). Najčastejšie sa v štatistike volí hodnota 0,05, čo
            zodpovedá 5 % pravdepodobnosti omylu.
          </p>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Aplikácia na dáta
              </h6>
              <p className="card-text mb-0">
                Pre náš test zvolíme štandardnú hladinu{" "}
                <strong>
                  <InlineMath math="\alpha = 0,05" />
                </strong>
                . Ak výsledná pravdepodobnosť (p-value) klesne pod túto hranicu,
                rozdiel v hustote zaľudnenia budeme považovať za štatisticky
                významný a <InlineMath math="H_0" /> zamietneme.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Test Statistic */}
        <div className="mt-5">
          <h4>3. Výpočet testovacieho kritéria</h4>
          <p>
            Testovacie kritérium je vzorec, pomocou ktorého z výberových dát
            získame konkrétnu číselnú hodnotu (testovú štatistiku). Táto
            štatistika sa riadi známym rozdelením pravdepodobnosti (napr.
            t-rozdelenie), s ktorým ju následne porovnávame, aby sme určili, či
            padne do kritického oboru.
          </p>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Aplikácia na dáta
              </h6>
              <p className="card-text">
                Keďže porovnávame priemer jedného výberu (obce kraja) so známou
                konštantou (136 obyv./km²), použijeme{" "}
                <strong>Jednovýberový Studentov t-test</strong>. Vzorec pre
                testovú štatistiku je:
              </p>
              <div className="text-center overflow-auto py-3">
                <BlockMath math="t = \frac{\bar{x} - \mu_0}{\frac{s}{\sqrt{n}}}" />
              </div>
              <p className="card-text small text-muted mt-2 mb-0">
                Kde <InlineMath math="\bar{x}" /> je výberový priemer (hustota v
                okrese), <InlineMath math="\mu_0" /> je referenčná hodnota
                (136), <InlineMath math="s" /> je smerodajná odchýlka výberu a{" "}
                <InlineMath math="n" /> je počet obcí.
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Evaluation */}
        <div className="mt-5">
          <h4>4. Vyhodnotenie hypotézy a P-hodnota</h4>
          <p>
            Na základe hodnoty testovacieho kritéria získame{" "}
            <strong>p-hodnotu (p-value)</strong>. Predstavuje najmenšiu hladinu
            významnosti, na ktorej môžeme <InlineMath math="H_0" /> zamietnuť.
            Ak je p-hodnota menšia ako <InlineMath math="\alpha" />, nulovú
            hypotézu zamietame. Pri každom rozhodnutí však hrozí riziko
            štatistickej chyby.
          </p>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Aplikácia na dáta (Možné závery)
              </h6>

              <div className="table-responsive mt-3">
                <table className="table table-bordered text-center align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th rowSpan="2" className="align-middle">
                        Skutočnosť v populácii
                      </th>
                      <th colSpan="2">Rozhodnutie testu (výsledok z dát)</th>
                    </tr>
                    <tr>
                      <th>
                        Nezamietame <InlineMath math="H_0" />
                      </th>
                      <th>
                        Zamietame <InlineMath math="H_0" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="text-start text-wrap">
                        Platí <InlineMath math="H_0" /> <br />
                        <small className="fw-normal">
                          Hustota sa reálne nelíši
                        </small>
                      </th>
                      <td>
                        Správne rozhodnutie <br />{" "}
                        <InlineMath math="(1 - \alpha)" />
                      </td>
                      <td className="text-danger">
                        <strong>
                          Chyba I. druhu (<InlineMath math="\alpha" />)
                        </strong>
                        <br />
                        <small>
                          Tvrdíme, že sa líši, hoci to nie je pravda
                        </small>
                      </td>
                    </tr>
                    <tr>
                      <th className="text-start text-wrap">
                        Platí <InlineMath math="H_A" /> <br />
                        <small className="fw-normal">
                          Hustota sa reálne líši
                        </small>
                      </th>
                      <td className="text-warning">
                        <strong>
                          Chyba II. druhu (<InlineMath math="\beta" />)
                        </strong>
                        <br />
                        <small>Prehliadli sme skutočný rozdiel</small>
                      </td>
                      <td>
                        Správne rozhodnutie <br /> (Sila testu{" "}
                        <InlineMath math="1 - \beta" />)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GeneralProcedure;
