import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BlockMath, InlineMath } from "react-katex";
import useDebouncedValue from "../hooks/useDebouncedValue";
import LinkedPDFCDF from "../components/charts/LinkedPDFCDF";
import DiscreteDistributionChart from "../components/charts/DiscreteDistributionChart";
import NormalDistributionChart from "../components/charts/NormalDistributionChart";
import NormalCDFChart from "../components/charts/NormalCDFChart";
import CSVDistributions from "../components/charts/CSVDistributions";
import PracticalExample from "../components/content/PracticalExample";
import BernoulliChart from "../components/charts/BernoulliChart";
import ChiSquareChart from "../components/charts/ChiSquareChart";
import "../styles/charts.css";

function ProbabilityDistributions() {
  const { t } = useTranslation();
  const location = useLocation();

  const [meanInput, mean, setMeanValue] = useDebouncedValue(0, 1000);
  const validateMean = (value) => !isNaN(parseFloat(value)); // Jednoduchý validátor

  // --- Použitie useDebouncedValue pre sd ---
  const [sdInput, sd, setSdValue] = useDebouncedValue(1, 1000);
  // Validátor pre smerodajnú odchýlku (musí byť kladná)
  const validateSd = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  // hover hodnota pre oba grafy
  const [hoverX, setHoverX] = useState(null);

  const sampleDiscreteData = [
    { x: 0, p: 0.03125 },
    { x: 1, p: 0.15625 },
    { x: 2, p: 0.3125 },
    { x: 3, p: 0.3125 },
    { x: 4, p: 0.15625 },
    { x: 5, p: 0.03125 },
  ];

  // --- scroll na hash po navigácii ---
  useEffect(() => {
    if (!location.pathname.startsWith("/probability-distributions")) return;

    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <h1 id="page-title">{t("topics.probabilityDistributions")}</h1>

      {/* --- MOTIVÁCIA --- */}
      <h2 id="motivation">Motivácia</h2>
      <p>
        V geoinformatike často pracujeme s údajmi, ktoré majú náhodný charakter
        — napríklad chybou merania, odchýlkami v polohách bodov alebo
        variabilitou v dátach získaných z terénu. Aby sme tieto javy vedeli
        modelovať, používame <strong>pravdepodobnostné rozdelenia</strong>.
      </p>
      <p>
        Ich cieľom je matematicky opísať, s akou pravdepodobnosťou sa jednotlivé
        hodnoty náhodnej veličiny vyskytujú. Na základe takého popisu môžeme
        nielen analyzovať minulé dáta, ale aj predpovedať správanie systému do
        budúcnosti.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed nisl
        dapibus, suscipit nulla et, bibendum mi. Nullam sit amet erat euismod,
        pulvinar risus nec, facilisis lectus. Vestibulum ante ipsum primis in
        faucibus orci luctus et ultrices posuere cubilia curae.
      </p>

      {/* --- PDF A CDF --- */}
      <h2 id="pdf-cdf">Pravdepodobnostná a distribučná funkcia</h2>
      <p>
        Pravdepodobnostné rozdelenie môžeme opísať dvoma príbuznými funkciami:
        <strong> funkciou hustoty pravdepodobnosti (PDF)</strong> a{" "}
        <strong>distribučnou funkciou (CDF)</strong>. Tieto dve zložky spolu
        úzko súvisia — CDF je integrálom PDF.
      </p>

      <p>
        <strong>Funkcia hustoty pravdepodobnosti (PDF)</strong> – označovaná ako{" "}
        <InlineMath math="f(x)" /> – udáva, ako sú hodnoty náhodnej veličiny
        rozložené. Nie je to samotná pravdepodobnosť, ale platí:
      </p>
      <BlockMath math="P(a \leq X \leq b) = \int_a^b f(x)\,dx" />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar
        pharetra enim, sit amet cursus mi ultrices ut. Suspendisse sed leo
        porttitor, bibendum eros ut, vehicula nulla.
      </p>

      <p>
        <strong>Distribučná funkcia (CDF)</strong> – označovaná ako{" "}
        <InlineMath math="F(x)" /> – vyjadruje, aká je pravdepodobnosť, že
        náhodná veličina nadobudne hodnotu menšiu alebo rovnakú ako{" "}
        <InlineMath math="x" />:
      </p>
      <BlockMath math="F(x) = P(X \leq x) = \int_{-\infty}^{x} f(t)\,dt" />
      <p>
        Táto funkcia má tvar postupne rastúcej (sigmoidnej) krivky, ktorá sa
        asymptoticky približuje k 1. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Pellentesque habitant morbi tristique senectus et netus
        et malesuada fames ac turpis egestas.
      </p>

      <div id="pdf-cdf-example">
        <LinkedPDFCDF mean={mean} sd={sd} />
      </div>

      <div id="pdf-cdf-example-discrete">
        {/* Posielame dáta ako prop */}
        <DiscreteDistributionChart data={sampleDiscreteData} />
      </div>

      {/*
      <h2 id="discrete-vs-continuous">Diskrétna a spojitá veličina</h2>
      <p>
        Placeholder text pre rozdiel medzi diskrétnou a spojitou náhodnou
        veličinou.
      </p>
      */}

      <h2 id="discrete-distributions">Diskrétne rozdelenia</h2>
      <p>Placeholder text o diskrétnych pravdepodobnostných rozdeleniach.</p>

      <h3 id="bernoulli">Alternatívne rozdelenie</h3>
      <p>
        Alternatívne (alebo Bernoulliho) rozdelenie je najjednoduchšie diskrétne
        rozdelenie. Používa sa pre náhodné veličiny, ktoré môžu mať iba dva
        možné, vzájomne sa vylučujúce výsledky. Tieto výsledky sa často označujú
        ako "úspech" (hodnota 1) a "neúspech" (hodnota 0). Množina možných
        výsledkov je teda <InlineMath math="\Omega = \{0, 1\}" />.
      </p>
      <p>
        Pravdepodobnosť úspechu označíme ako <InlineMath math="p" />, teda{" "}
        <InlineMath math="P(X=1) = p" />. Keďže sú len dva možné výsledky,
        pravdepodobnosť neúspechu musí byť <InlineMath math="P(X=0) = 1 - p" />.
        Parameter <InlineMath math="p" /> musí byť v intervale{" "}
        <InlineMath math="\langle 0, 1 \rangle" />.
      </p>
      <p>Pravdepodobnostná funkcia p(x) je definovaná ako:</p>
      <BlockMath
        math={`p(x) = P(X=x) = \\begin{cases} 1-p & \\text{pre } x = 0 \\\\ p & \\text{pre } x = 1 \\\\ 0 & \\text{inak} \\end{cases}`}
      />

      {/* --- Graf (Placeholder) --- */}
      <p>
        [Placeholder pre graf alternatívneho rozdelenia - napr. BarChart s dvoma
        stĺpcami pre p a 1-p]
      </p>

      {/* --- Graf Alternatívneho rozdelenia --- */}
      {/* Voláme komponent bez prop 'p' */}
      <div className="charts-wrapper justify-content-center">
        <BernoulliChart />
      </div>

      {/* --- Praktický Príklad --- */}
      <PracticalExample title="Losovanie guličky">
        {" "}
        {/* Použitie komponentu */}
        <p>
          Losujeme jednu guličku z vrecka, kde je 1 biela a 3 čierne guličky.
          Náhodná veličina X predstavuje výsledok ťahu, kde X=1, ak vytiahneme
          bielu guličku (úspech) a X=0, ak vytiahneme čiernu (neúspech).
        </p>
        <p>
          Pravdepodobnosť vytiahnutia bielej guličky (úspechu) je{" "}
          <InlineMath math="p = P(X=1) = \frac{1}{1+3} = 0.25" />.
        </p>
        <p>
          Pravdepodobnosť vytiahnutia čiernej guličky (neúspechu) je{" "}
          <InlineMath math="1-p = P(X=0) = \frac{3}{1+3} = 0.75" />.
        </p>
      </PracticalExample>
      <h3 id="uniform-discrete">Rovnomerné rozdelenie</h3>
      <p>Placeholder text pre diskrétne rovnomerné rozdelenie.</p>

      <h3 id="binomial">Binomické rozdelenie</h3>
      <p>Placeholder text pre binomické rozdelenie.</p>

      <h3 id="poisson">Poissonovo rozdelenie</h3>
      <p>Placeholder text pre Poissonovo rozdelenie.</p>

      <h2 id="continuous-distributions">Spojité rozdelenia</h2>
      <p>Placeholder text o spojitých pravdepodobnostných rozdeleniach.</p>

      <h3 id="exponential">Exponenciálne rozdelenie</h3>
      <p>Placeholder text pre exponenciálne rozdelenie.</p>

      <h3 id="normal">Normálne rozdelenie</h3>
      <p>
        Placeholder text pre normálne rozdelenie. Uvedený tvar hustoty
        pravdepodobnosti je:
      </p>
      <BlockMath math="f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{ -\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2 }" />
      <p>
        kde <InlineMath math="\mu" /> je stredná hodnota a{" "}
        <InlineMath math="\sigma" /> smerodajná odchýlka.
      </p>

      <div className="controls">
        <label>
          μ (stred):
          <input
            type="number"
            value={meanInput} // Použi inputValue z hooku
            step="0.5"
            // Použi setValue z hooku s validátorom
            onChange={(e) => setMeanValue(e.target.value, validateMean)}
          />
        </label>
        <label>
          σ (smerodajná odchýlka):
          <input
            type="number"
            value={sdInput} // Použi inputValue z hooku
            step="0.1"
            min="0.1" // Min atribút zostáva pre UX
            // Použi setValue z hooku s validátorom
            onChange={(e) => setSdValue(e.target.value, validateSd)}
          />
        </label>
      </div>

      <div className="charts-wrapper">
        <NormalDistributionChart
          mean={mean}
          sd={sd}
          hoverX={hoverX}
          setHoverX={setHoverX}
        />
        <NormalCDFChart
          mean={mean}
          sd={sd}
          hoverX={hoverX}
          setHoverX={setHoverX}
        />
      </div>

      <CSVDistributions />

      <h4 id="chi-square">Chí kvadrát rozdelenie</h4>
      <p>
        Chí kvadrát rozdelenie s k stupňami voľnosti vzniká ako súčet štvorcov k
        nezávislých náhodných veličín, ktoré majú štandardizované normálne
        rozdelenie N(0, 1). Používa sa napríklad pri teste dobrej zhody, teste
        nezávislosti v kontingenčných tabuľkách alebo pri odhade rozptylu
        normálneho rozdelenia.
      </p>
      <p>Hustota pravdepodobnosti ($\chi^2(k)$) je daná vzorcom:</p>
      <BlockMath math="f(x; k) = \frac{1}{2^{k/2} \Gamma(k/2)} x^{k/2 - 1} e^{-x/2}, \quad x > 0" />
      <p>
        kde k je počet stupňov voľnosti a Gamma$ je Gamma funkcia. Tvar
        rozdelenia závisí od počtu stupňov voľnosti k. Pre malé k je rozdelenie
        výrazne pravostranne zošikmené, s rastúcim k sa približuje k normálnemu
        rozdeleniu.
      </p>

      {/* Vloženie grafu */}
      <div className="charts-wrapper justify-content-center">
        <ChiSquareChart />
      </div>
      <h4 id="student-t">Studentovo t rozdelenie</h4>
      <p>Placeholder text pre Studentovo t rozdelenie.</p>

      <h4 id="fisher-f">Fisherovo F rozdelenie</h4>
      <p>Placeholder text pre Fisherovo F rozdelenie.</p>
    </>
  );
}

export default ProbabilityDistributions;
