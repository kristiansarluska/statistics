// src/pages/probabilityDistributions/ContinuousDistributions.jsx
import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import UniformContinuousChart from "../../components/charts/probability-distributions/continuous/UniformContinuousChart";
import ExponentialChart from "../../components/charts/probability-distributions/continuous/ExponentialChart";
import NormalChart from "../../components/charts/probability-distributions/continuous/NormalChart";
import ChiSquareChart from "../../components/charts/probability-distributions/continuous/ChiSquareChart";
import StudentTChart from "../../components/charts/probability-distributions/continuous/StudentTChart";
import FisherFChart from "../../components/charts/probability-distributions/continuous/FisherFChart";

function ContinuousDistributions() {
  return (
    <section id="continuous-distributions">
      <h2 className="mb-4">Spojité rozdelenia</h2>
      <p className="mb-5">
        Spojité pravdepodobnostné rozdelenia opisujú náhodné veličiny, ktoré
        môžu nadobúdať akúkoľvek hodnotu v rámci určitého intervalu. Na rozdiel
        od diskrétnych rozdelení, pravdepodobnosť, že spojitá veličina nadobudne
        konkrétnu hodnotu (napr. presne <InlineMath math="x = 2.0000" />
        ), je vždy nulová. Namiesto toho počítame pravdepodobnosť, že hodnota
        padne do určitého intervalu.
      </p>

      {/* ROVNOMERNÉ SPOJITÉ ROZDELENIE */}
      <h3 id="uniform-continuous" className="mb-3 mt-5">
        Rovnomerné rozdelenie
      </h3>
      <p className="mb-4">
        Spojité rovnomerné rozdelenie definuje náhodnú veličinu, ktorá môže
        nadobudnúť akúkoľvek hodnotu v uzavretom intervale{" "}
        <InlineMath math="[a, b]" />. Hustota pravdepodobnosti je v celom tomto
        intervale konštantná, čo znamená, že všetky podintervaly rovnakej dĺžky
        sú rovnako pravdepodobné.
      </p>

      <div className="mb-4">
        <BlockMath
          math={`f(x) = \\begin{cases} \\frac{1}{b-a} & x \\in \\langle a, b \\rangle \\\\ 0 & x \\notin \\langle a, b \\rangle \\end{cases}`}
        />
        <BlockMath
          math={`F(x) = \\begin{cases} 0 & x \\in (-\\infty, a) \\\\ \\frac{x-a}{b-a} & x \\in \\langle a, b ) \\\\ 1 & x \\in \\langle b, \\infty) \\end{cases}`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">Čakanie na prírodný úkaz</h5>
        <p className="text-muted mb-4 small">
          Predstavte si, že sledujete gejzír, o ktorom je známe, že vybuchuje
          náhodne v intervale od{" "}
          <strong>
            <InlineMath math="a" />
          </strong>{" "}
          do{" "}
          <strong>
            <InlineMath math="b" />
          </strong>{" "}
          minút od poslednej erupcie. Ak nemáme žiadnu ďalšiu informáciu,
          predpokladáme, že pravdepodobnosť výbuchu v 14. minúte je rovnaká ako
          v 18. minúte. Na grafe nižšie vidíte, že hustota pravdepodobnosti
          tvorí obdĺžnik – jeho plocha musí byť vždy rovná 1, preto sa so
          zväčšovaním intervalu výška obdĺžnika znižuje.
        </p>
        <UniformContinuousChart />
      </div>

      {/* EXPONENCIÁLNE ROZDELENIE */}
      <h3 id="exponential" className="mb-3 mt-5">
        Exponenciálne rozdelenie
      </h3>
      <p className="mb-4">
        Exponenciálne rozdelenie sa často používa na modelovanie času medzi
        náhodnými udalosťami v Poissonovom procese. Je to rozdelenie s "krátkou
        pamäťou" – pravdepodobnosť, že udalosť nastane v najbližšom momente,
        nezávisí od toho, ako dlho už čakáme.
      </p>

      <div className="mb-4">
        <BlockMath
          math={`f(x) = \\begin{cases} \\lambda e^{-\\lambda x} & x \\ge 0 \\\\ 0 & x < 0 \\end{cases}`}
        />
        <BlockMath
          math={`F(x) = \\begin{cases} 1 - e^{-\\lambda x} & x \\ge 0 \\\\ 0 & x < 0 \\end{cases}`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">Spoľahlivosť monitorovacej siete</h5>
        <p className="text-muted mb-4 small">
          Predstavte si automatickú meteostanicu v teréne. Exponenciálne
          rozdelenie modeluje <strong>čas medzi dvoma výpadkami</strong>{" "}
          odosielania dát. Parameter{" "}
          <strong>
            <InlineMath math="\lambda" />
          </strong>{" "}
          (lambda) predstavuje intenzitu porúch – čím je vyššia, tým častejšie k
          výpadkom dochádza a tým kratšie sú intervaly medzi nimi. Všimnite si,
          že krivka začína vysoko (krátke intervaly sú najpravdepodobnejšie) a
          smerom doprava k dlhým časom čakania prudko klesá.
        </p>
        <ExponentialChart />
      </div>

      {/* NORMÁLNE ROZDELENIE */}
      <h3 id="normal" className="mb-3 mt-5">
        Normálne rozdelenie
      </h3>
      <p className="mb-4">
        Normálne (Gaussovo) rozdelenie je najdôležitejším rozdelením v
        štatistike. Je symetrické okolo strednej hodnoty{" "}
        <InlineMath math="\mu" /> a jeho tvar "zvonu" je určený smerodajnou
        odchýlkou <InlineMath math="\sigma" />. V prírode a technike sa ním
        riadi väčšina náhodných chýb merania.
      </p>

      <div className="mb-4">
        <BlockMath
          math={`f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\cdot e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}`}
        />
        <BlockMath
          math={`F(x) = \\int_{-\\infty}^{x} \\frac{1}{\\sigma \\sqrt{2\\pi}} \\cdot e^{-\\frac{(t-\\mu)^2}{2\\sigma^2}} \\, dt`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">Kalibrácia a presnosť GNSS prijímača</h5>
        <p className="text-muted mb-4 small">
          Predstavte si meranie polohy stacionárneho bodu pomocou GNSS.
          Parameter{" "}
          <strong>
            <InlineMath math="\mu" /> (stredná hodnota)
          </strong>{" "}
          predstavuje systematickú chybu (napr. ak je prístroj zle kalibrovaný a
          vždy posúva výsledok o 1 meter). Parameter{" "}
          <strong>
            <InlineMath math="\sigma" /> (smerodajná odchýlka)
          </strong>{" "}
          určuje presnosť prístroja — čím je menšia, tým sú merania tesnejšie
          okolo stredu a prístroj je kvalitnejší. Všimnite si, že pri zmenšení{" "}
          <strong>
            <InlineMath math="\sigma" />
          </strong>{" "}
          sa graf zúži a jeho vrchol prudko narastie, pretože celková plocha pod
          krivkou musí ostať rovná 1.
        </p>
        <NormalChart />
      </div>

      {/* CHÍ-KVADRÁT ROZDELENIE */}
      <h3 id="chi-square" className="mb-3 mt-5">
        Chí-kvadrát rozdelenie
      </h3>
      <p className="mb-4">
        Chí-kvadrát rozdelenie (<InlineMath math="\chi^2" />) je asymetrické a
        nadobúda len nezáporné hodnoty. Je definované parametrom{" "}
        <strong>
          <InlineMath math="\nu" /> (stupne voľnosti)
        </strong>
        , kde <InlineMath math="\nu = n-1" />. Hrá kľúčovú úlohu pri testovaní
        hypotéz o rozptyle a pri testoch dobrej zhody.
      </p>

      <div className="mb-4">
        <BlockMath
          math={`f(x) = \\begin{cases} \\frac{1}{\\Gamma\\left(\\frac{\\nu}{2}\\right) 2^{\\frac{\\nu}{2}}} x^{\\frac{\\nu}{2}-1} e^{-\\frac{x}{2}} & x > 0 \\\\ 0 & x \\le 0 \\end{cases}`}
        />
        <BlockMath math={`F(x) = \\int_{0}^{x} f(t) \\, dt`} />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">Kontrola stability presnosti merania</h5>
        <p className="text-muted mb-4 small">
          Predstavte si, že testujete presnosť nového laserového diaľkomera.
          Nevyhodnocujete priemernú dĺžku, ale{" "}
          <strong>variabilitu (rozptyl)</strong>
          opakovaných meraní na známu vzdialenosť. <InlineMath math="\chi^2" />{" "}
          rozdelenie modeluje súčet štvorcov týchto chýb. Parameter{" "}
          <strong>df (stupne voľnosti)</strong> závisí od počtu vykonaných
          meraní (<InlineMath math="n-1" />
          ). Sledujte, ako sa pri nízkom{" "}
          <strong>
            <InlineMath math="\nu" />
          </strong>{" "}
          pravdepodobnosť koncentruje blízko nuly a so zvyšujúcim sa počtom
          meraní sa rozdelenie začína podobať na normálne.
        </p>
        <ChiSquareChart />
      </div>

      {/* STUDENTOVO T-ROZDELENIE */}
      <h3 id="student-t" className="mb-3 mt-5">
        Studentovo t-rozdelenie
      </h3>
      <p className="mb-4">
        Studentovo t-rozdelenie sa používa na odhad strednej hodnoty populácie v
        prípadoch, keď je veľkosť vzorky malá a smerodajná odchýlka populácie
        nie je známa. Je podobné normálnemu rozdeleniu, ale má "ťažšie konce".
        Veľkosť vzorky je zohľadnená parametrom{" "}
        <strong>
          <InlineMath math="n" /> (stupne voľnosti)
        </strong>
        .
      </p>

      <div className="mb-4">
        <BlockMath
          math={`f(x) = \\frac{1}{\\sqrt{n\\pi}} \\cdot \\frac{\\Gamma\\left(\\frac{n+1}{2}\\right)}{\\Gamma\\left(\\frac{n}{2}\\right)} \\cdot \\left(1 + \\frac{x^2}{n}\\right)^{-\\frac{n+1}{2}}`}
        />
        <BlockMath math={`F(x) = \\int_{-\\infty}^{x} f(t) \\, dt`} />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">Overenie presnosti nového meracieho prístroja</h5>
        <p className="text-muted mb-4 small">
          Predstavte si, že testujete presnosť nového laserového skenera, ale
          stihli ste vykonať len 5 kontrolných meraní (malá vzorka). Kvôli
          malému počtu dát máme vyššiu neistotu, čo t-rozdelenie vyjadruje
          širšími koncami krivky. Parameter{" "}
          <strong>df (stupne voľnosti)</strong> priamo súvisí s počtom meraní.
          Všimnite si, že so zvyšujúcim sa{" "}
          <strong>
            <InlineMath math="n" />
          </strong>{" "}
          sa t-rozdelenie postupne približuje k normálnemu rozdeleniu (čierna
          prerušovaná čiara v grafe).
        </p>
        <StudentTChart />
      </div>

      {/* FISHEROVO F-ROZDELENIE */}
      <h3 id="fisher-f" className="mb-3 mt-5">
        Fisherovo F-rozdelenie
      </h3>
      <p className="mb-4">
        Fisherovo rozdelenie popisuje variabilitu dvoch výberových rozptylov
        odvodených z normálneho rozdelenia. Je kľúčové pre analýzu rozptylu
        (ANOVA). Je definované dvoma parametrami stupňov voľnosti:{" "}
        <InlineMath math="v_1" /> (pre čitateľa) a <InlineMath math="v_2" />{" "}
        (pre menovateľa).
      </p>

      <div className="mb-4">
        <BlockMath
          math={`f(x) = \\begin{cases} \\frac{1}{\\mathrm{B}\\left(\\frac{v_1}{2}, \\frac{v_2}{2}\\right)} \\left(\\frac{v_1}{v_2}\\right)^{\\frac{v_1}{2}} x^{\\frac{v_1}{2}-1} \\left(1 + \\frac{v_1}{v_2}x\\right)^{-\\frac{v_1+v_2}{2}} & x > 0 \\\\ 0 & x \\le 0 \\end{cases}`}
        />
        <BlockMath math={`F(x) = \\int_{0}^{x} f(t) \\, dt`} />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Porovnanie kvality ovzdušia v rôznych zónach mesta
        </h5>
        <p className="text-muted mb-4 small">
          Predstavte si, že porovnávate priemerné koncentrácie prachu{" "}
          <InlineMath math="PM_{10}" /> v priemyselnej, rezidenčnej a parkovej
          zóne. F-rozdelenie nám pomáha rozhodnúť, či sú rozdiely medzi týmito
          zónami <strong>štatisticky významné</strong> vzhľadom na prirodzené
          kolísanie hodnôt vnútri každej zóny. Sledujte, ako zmena kombinácie
          stupňov voľnosti{" "}
          <strong>
            <InlineMath math="v_1" />
          </strong>{" "}
          a{" "}
          <strong>
            <InlineMath math="v_2" />
          </strong>{" "}
          mení asymetriu a "špičatosť" rozdelenia.
        </p>
        <FisherFChart />
      </div>
    </section>
  );
}

export default ContinuousDistributions;
