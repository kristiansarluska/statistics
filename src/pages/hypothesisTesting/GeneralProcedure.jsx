// src/pages/hypothesisTesting/GeneralProcedure.jsx
import React, { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import DataPreviewTable from "../../components/charts/helpers/DataPreviewTable";

function GeneralProcedure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch JSON data instead of CSV
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/MS_kraj.json`,
        );
        if (!response.ok) throw new Error("Failed to load MS_kraj.json");
        const geojsonData = await response.json();

        const parsedData = geojsonData.features
          .filter((feature) => feature.properties.kod)
          .map((feature) => {
            const props = feature.properties;
            const pocet = props.Poc_obyv_SLDB_2021 || 0;
            const nad65 = props.poc_obyv_nad_65 || 0;
            const podiel = pocet > 0 ? (nad65 / pocet) * 100 : null;

            return {
              kod: props.kod,
              nazev: props.nazev,
              okres: props.okres,
              Poc_obyv_SLDB_2021: pocet,
              poc_obyv_nad_65: nad65,
              podiel_nad65: podiel,
            };
          });

        setData(parsedData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Nepodarilo sa stiahnuť alebo spracovať JSON súbor.");
        setLoading(false);
      }
    };

    fetchGeoJSON();
  }, []);

  const tableColumns = [
    { key: "kod", label: "Kód obce" },
    { key: "nazev", label: "Názov obce" },
    { key: "okres", label: "Okres" },
    {
      key: "Poc_obyv_SLDB_2021",
      label: "Počet obyvateľov",
      render: (val) => val.toLocaleString("sk-SK"),
    },
    {
      key: "poc_obyv_nad_65",
      label: "Obyv. nad 65 r.",
      render: (val) => val.toLocaleString("sk-SK"),
    },
    {
      key: "podiel_nad65",
      label: "Podiel nad 65 (%)",
      render: (val) =>
        val != null
          ? val.toLocaleString("sk-SK", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "—",
    },
  ];

  return (
    <section id="procedure" className="mb-5">
      <h2 className="mb-4">Všeobecný postup testovania</h2>
      <p>
        Testovanie hypotéz vždy prebieha v niekoľkých štandardizovaných krokoch.
        Na demonštráciu využijeme dáta obcí Moravskosliezskeho kraja (zdroj:
        ArcČR 4.3). Budeme testovať, či je podiel obyvateľov nad 65 rokov v
        týchto obciach porovnateľný s celorepublikovým priemerom.
      </p>

      {/* Data Preview Section */}
      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h6 className="card-subtitle mb-3 text-muted">
              Vstupné dáta pre náš príklad
            </h6>
            <p className="card-text mb-3">
              Náhľad načítaných dát z Moravskosliezskeho kraja. Podiel
              obyvateľov nad 65 rokov sme vypočítali z atribútov{" "}
              <code>Poc_obyv_SLDB_2021</code> a <code>poc_obyv_nad_65</code>.
            </p>
            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : error ? (
              <div className="alert alert-danger mb-0">{error}</div>
            ) : (
              <DataPreviewTable
                data={data}
                columns={tableColumns}
                previewRows={4}
                title="Obce Moravskosliezskeho kraja"
              />
            )}
          </div>
        </div>
      </div>

      {/* Step 1: Formulation */}
      <div className="mt-5">
        <h4>1. Formulácia hypotéz</h4>
        <p>
          Základom je stanovenie nulovej hypotézy (<InlineMath math="H_0" />
          ), ktorá zvyčajne vyjadruje očakávaný stav, neexistenciu rozdielu
          alebo rovnosť parametrov. Oproti nej stoji alternatívna hypotéza (
          <InlineMath math="H_A" />
          ), ktorá predstavuje logický opak a potvrdzuje existenciu štatisticky
          významného rozdielu. V dátach vždy hľadáme dôkazy pre zamietnutie{" "}
          <InlineMath math="H_0" />.
        </p>
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Aplikácia na dáta
              </h6>
              <p className="card-text">
                Priemerný podiel obyvateľov nad 65 rokov v obciach ČR je 20,56
                %. Stanovíme si hypotézy pre náš vybraný okres:
              </p>
              <ul>
                <li>
                  <strong>
                    <InlineMath math="H_0: \mu = 20{,}56" />
                  </strong>{" "}
                  (Priemerný podiel seniorov v obciach okresu sa štatisticky
                  nelíši od priemeru ČR)
                </li>
                <li>
                  <strong>
                    <InlineMath math="H_A: \mu \neq 20{,}56" />
                  </strong>{" "}
                  (Priemerný podiel seniorov sa líši - obojstranná hypotéza)
                </li>
              </ul>
            </div>
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
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Aplikácia na dáta
              </h6>
              <p className="card-text mb-0">
                Pre náš test zvolíme štandardnú hladinu{" "}
                <strong>
                  <InlineMath math="\alpha = 0{,}05" />
                </strong>
                . Ak výsledná pravdepodobnosť (p-value) klesne pod túto hranicu,
                rozdiel v podiele seniorov budeme považovať za štatisticky
                významný a <InlineMath math="H_0" /> zamietneme.
              </p>
            </div>
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
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Aplikácia na dáta
              </h6>
              <p className="card-text">
                Keďže porovnávame priemer jedného výberu (obce v okrese) so
                známou konštantou (20,56 %), použijeme{" "}
                <strong>Jednovýberový Studentov t-test</strong>. Vzorec pre
                testovú štatistiku je:
              </p>
              <div className="text-center overflow-auto py-3">
                <BlockMath math="t = \frac{\bar{x} - \mu_0}{\frac{s}{\sqrt{n}}}" />
              </div>
              <p className="card-text small text-muted mt-2 mb-0">
                Kde <InlineMath math="\bar{x}" /> je výberový priemer (podiel v
                okrese), <InlineMath math="\mu_0" /> je referenčná hodnota
                (20,56), <InlineMath math="s" /> je smerodajná odchýlka výberu a{" "}
                <InlineMath math="n" /> je počet obcí.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Evaluation */}
      <div className="mt-5">
        <h4>4. Vyhodnotenie hypotézy a P-hodnota</h4>
        <p>
          Na základe hodnoty testovacieho kritéria získame{" "}
          <strong>p-hodnotu (p-value)</strong>. Predstavuje najmenšiu hladinu
          významnosti, na ktorej môžeme <InlineMath math="H_0" /> zamietnuť. Ak
          je p-hodnota menšia ako <InlineMath math="\alpha" />, nulovú hypotézu
          zamietame. Pri každom rozhodnutí však hrozí riziko štatistickej chyby.
        </p>
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                Aplikácia na dáta (Možné závery)
              </h6>

              <div className="table-responsive mt-3">
                <table className="table table-bordered text-center align-middle mb-0">
                  <thead className="table-active">
                    <tr>
                      <th
                        rowSpan="2"
                        className="align-middle"
                        style={{ width: "30%" }}
                      >
                        Skutočnosť v populácii
                      </th>
                      <th colSpan="2">Rozhodnutie testu (výsledok z dát)</th>
                    </tr>
                    <tr>
                      <th style={{ width: "35%" }}>
                        Nezamietame <InlineMath math="H_0" />
                      </th>
                      <th style={{ width: "35%" }}>
                        Zamietame <InlineMath math="H_0" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="text-start text-wrap">
                        Platí <InlineMath math="H_0" /> <br />
                        <small className="fw-normal text-muted">
                          Podiel seniorov sa reálne nelíši od priemeru ČR.
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
                          Falošný poplach. My nesprávne tvrdíme, že okres má
                          významne odlišný podiel seniorov, hoci v skutočnosti
                          je rovnaký ako celorepublikový priemer (rozdiel v
                          dátach bol len náhodný).
                        </small>
                      </td>
                    </tr>
                    <tr>
                      <th className="text-start text-wrap">
                        Platí <InlineMath math="H_A" /> <br />
                        <small className="fw-normal text-muted">
                          Podiel seniorov sa reálne líši od priemeru ČR.
                        </small>
                      </th>
                      <td className="text-warning-emphasis">
                        <strong>
                          Chyba II. druhu (<InlineMath math="\beta" />)
                        </strong>
                        <br />
                        <small>
                          Prehliadnutie rozdielu. Z výberu dát sa nám nepodarilo
                          dokázať rozdiel, a preto nesprávne tvrdíme, že okres
                          má priemerný podiel seniorov, hoci sa v skutočnosti
                          významne líši.
                        </small>
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
      </div>
    </section>
  );
}

export default GeneralProcedure;
