import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import BernoulliChart from "../../components/charts/BernoulliChart";
import PracticalExample from "../../components/content/PracticalExample";

function DiscreteDistributions() {
  return (
    <>
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

      {/* Graf Alternatívneho rozdelenia */}
      <div className="charts-wrapper justify-content-center">
        <BernoulliChart />
      </div>

      {/* Praktický Príklad */}
      <PracticalExample title="Losovanie guličky">
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
    </>
  );
}

export default DiscreteDistributions;
