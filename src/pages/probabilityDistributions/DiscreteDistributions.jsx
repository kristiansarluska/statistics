import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import BernoulliChart from "../../components/charts/probability-distributions/discrete/BernoulliChart";
import UniformDiscreteChart from "../../components/charts/probability-distributions/discrete/UniformDiscreteChart";
import BinomialChart from "../../components/charts/probability-distributions/discrete/BinomialChart";
import PoissonChart from "../../components/charts/probability-distributions/discrete/PoissonChart";

function DiscreteDistributions() {
  return (
    <>
      <h2 id="discrete-distributions" className="mb-4">
        Diskrétne rozdelenia
      </h2>
      <p className="mb-5">
        Diskrétne pravdepodobnostné rozdelenia opisujú náhodné veličiny, ktoré
        môžu nadobúdať len spočítateľné množstvo hodnôt (napríklad celé čísla).
      </p>

      {/* ALTERNATÍVNE ROZDELENIE */}
      <h3 id="bernoulli" className="mb-3">
        Alternatívne (Bernoulliho) rozdelenie
      </h3>
      <p className="mb-3">
        Je to najjednoduchšie diskrétne rozdelenie pre experimenty, ktoré majú
        iba dva vzájomne sa vylučujúce výsledky: "úspech" (hodnota 1) a
        "neúspech" (hodnota 0). Množina možných výsledkov je{" "}
        <InlineMath math="\Omega = \{0, 1\}" />. Pravdepodobnosť úspechu
        označujeme ako <InlineMath math="p" /> (kde{" "}
        <InlineMath math="p \in \langle 0, 1 \rangle" />
        ), teda <InlineMath math="P(X=1) = p" />. Pravdepodobnosť neúspechu je
        doplnkom do 1, teda <InlineMath math="P(X=0) = 1 - p" />.
      </p>

      <div className="mb-4">
        <BlockMath
          math={`p(x) = P(X=x) = \\begin{cases} 1-p & \\text x = 0 \\\\ p & \\text x = 1 \\\\ 0 & \\text{inak} \\end{cases}`}
        />
        <BlockMath
          math={`F(x) = \\begin{cases} 0 & \\text x < 0 \\\\ 1-p & \\text 0 \\le x < 1 \\\\ 1 & \\text x \\ge 1 \\end{cases}`}
        />
      </div>

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Klasifikácia satelitnej snímky
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavme si, že analyzujeme satelitnú snímku územia, kde 25 %
          rozlohy tvorí vodná plocha. Náhodne vyberieme jeden pixel na snímke.
          Náhodná veličina X nadobúda hodnotu 1 (úspech), ak pixel reprezentuje
          vodu, a 0 (neúspech), ak ide o pevninu. V grafe nižšie môžete meniť
          parameter <strong>p</strong> (podiel vodnej plochy v území) a sledovať
          zmenu pravdepodobnostnej funkcie.
        </p>

        <div className="mb-5">
          <BernoulliChart />
        </div>
      </div>

      {/* ROVNOMERNÉ ROZDELENIE */}
      <h3 id="uniform-discrete" className="mb-3 mt-5">
        Rovnomerné rozdelenie
      </h3>
      <p className="mb-4">
        Diskrétne rovnomerné rozdelenie opisuje náhodnú veličinu, pri ktorej má
        každý z konečného počtu <InlineMath math="n" /> možných výsledkov
        rovnakú pravdepodobnosť výskytu. Pravdepodobnostná funkcia je
        konštantná: <InlineMath math="P(X=x) = \frac{1}{n}" /> pre všetky možné
        hodnoty.
      </p>

      <div className="mb-4">
        <BlockMath
          math={`p(x_i) = p(x) = \\frac{1}{n} \\quad \\text x \\in \\{1, 2, \\dots, n\\}`}
        />
        <BlockMath
          math={`F(x) = \\frac{\\lfloor x \\rfloor}{n} \\quad \\text 1 \\le x \\le n`}
        />
      </div>

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Náhodný výber administratívnej jednotky
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavte si, že chcete vykonať náhodnú kontrolu kvality ovzdušia v
          jednom vybranom okrese určitého kraja. Parameter <strong>n</strong> tu
          predstavuje celkový počet okresov v danom kraji. Ak je výber úplne
          náhodný, každý okres má rovnakú šancu na kontrolu. Zmenou parametra{" "}
          <strong>n</strong> na posuvníku simulujete prechod do iného kraja s
          iným počtom okresov (napr. Bratislavský kraj má{" "}
          <InlineMath math="n=8" />, Trnavský <InlineMath math="n=7" />
          ). Všimnite si, že čím viac je okresov, tým nižšia je pravdepodobnosť
          výberu konkrétneho z nich.
        </p>

        <div className="mb-5">
          <UniformDiscreteChart />
        </div>
      </div>

      {/* BINOMICKÉ ROZDELENIE (Zatiaľ len placeholder na ďalší krok) */}
      <h3 id="binomial" className="mb-3 mt-5">
        Binomické rozdelenie
      </h3>
      <p className="mb-4">
        Binomické rozdelenie určuje počet úspechov v <InlineMath math="n" />{" "}
        nezávislých pokusoch. Veličina s binomickým rozdelením je súčtom
        nezávislých veličín s alternatívnym rozdelením, parametre tohto
        rozdelenia sú <InlineMath math="p" /> (pravdepodobnosť úspechu javu) a
        počet pokusov <InlineMath math="n" />.
      </p>

      <div className="mb-4">
        <BlockMath
          math={`P(X=x) = \\binom{n}{x} p^x (1-p)^{n-x} \\quad \\text x \\in \\{0, 1, \\dots, n\\}`}
        />
        <BlockMath
          math={`F(x) = \\sum_{i=0}^{\\lfloor x \\rfloor} \\binom{n}{i} p^i (1-p)^{n-i}`}
        />
      </div>

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Automatická extrakcia objektov (AI detekcia)
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Pri analýze satelitných snímok používame algoritmus na detekciu budov.
          Parameter <strong>p</strong> predstavuje pravdepodobnosť, že
          algoritmus správne rozpozná budovu (úspech), a <strong>n</strong> je
          celkový počet budov na snímke, ktoré má spracovať. Všimnite si, že ak
          je presnosť algoritmu vysoká (napr. <InlineMath math="p = 0.9" />
          ), najvyššia pravdepodobnosť sa kumuluje pri hodnote blízkej celkovému
          počtu budov <strong>n</strong>.
        </p>

        <div className="mb-5">
          <BinomialChart />
        </div>
      </div>

      {/* POISSONOVO ROZDELENIE */}
      <h3 id="poisson" className="mb-3 mt-5">
        Poissonovo rozdelenie
      </h3>
      <p className="mb-4">
        Poissonovo rozdelenie opisuje pravdepodobnosť výskytu určitého počtu
        náhodných udalostí v pevne stanovenom časovom alebo priestorovom
        intervale. Kľúčovým parametrom je <InlineMath math="\lambda" />{" "}
        (lambda), ktorý predstavuje priemerný počet týchto udalostí na danú
        jednotku.
      </p>

      <div className="mb-4">
        <BlockMath
          math={`P(X=x) = \\frac{\\lambda^x}{x!} e^{-\\lambda} \\quad \\text x \\in \\{0, 1, 2, \\dots\\}`}
        />
        <BlockMath
          math={`F(x) = e^{-\\lambda} \\sum_{i=0}^{\\lfloor x \\rfloor} \\frac{\\lambda^i}{i!}`}
        />
      </div>

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Kontrola kvality digitálneho modelu reliéfu (DMR)
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Pri spracovaní dát z leteckého laserového skenovania môžu vznikať v
          modeli chybné body (tzv. artefakty). Predpokladajme, že pri
          štandardnej kvalite spracovania sa v priemere vyskytuje{" "}
          <strong>&lambda;</strong> chýb na 100 hektárov plochy. Poissonovo
          rozdelenie nám povie, aká je pravdepodobnosť, že na nasledujúcej
          kontrolovanej ploche nenájdeme žiadnu chybu, alebo ich tam bude naopak
          neprirodzene veľa. Sledujte, ako sa pri zvyšovaní priemerného počtu
          chýb (<strong>&lambda;</strong>) rozdelenie "rozťahuje" a vrchol sa
          posúva doprava.
        </p>

        <div className="mb-5">
          <PoissonChart />
        </div>
      </div>
    </>
  );
}

export default DiscreteDistributions;
