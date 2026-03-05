// src/pages/probabilityDistributions/ContinuousDistributions.jsx
import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import UniformContinuousChart from "../../components/charts/probability-distributions/continuous/UniformContinuousChart";
import ExponentialChart from "../../components/charts/probability-distributions/continuous/ExponentialChart";
import NormalChart from "../../components/charts/probability-distributions/continuous/NormalChart";
import CSVDistributions from "../../components/charts/probability-distributions/continuous/CSVDistributions";
import ChiSquareChart from "../../components/charts/probability-distributions/continuous/ChiSquareChart";
import StudentTChart from "../../components/charts/probability-distributions/continuous/StudentTChart";
import FisherFChart from "../../components/charts/probability-distributions/continuous/FisherFChart";

function ContinuousDistributions() {
  return (
    <>
      <h2 id="continuous-distributions">Spojité rozdelenia</h2>
      <p>
        Spojité pravdepodobnostné rozdelenia opisujú náhodné veličiny, ktoré
        môžu nadobúdať akúkoľvek hodnotu v rámci určitého intervalu. Na rozdiel
        od diskrétnych rozdelení, pravdepodobnosť, že spojitá veličina nadobudne
        konkrétnu hodnotu (napr. presne $x = 2.0000$), je vždy nulová. Namiesto
        toho počítame pravdepodobnosť, že hodnota padne do určitého intervalu.
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

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Čakanie na prírodný úkaz (Gejzír)
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavte si, že sledujete gejzír, o ktorom je známe, že vybuchuje
          náhodne v intervale od <strong>a</strong> do <strong>b</strong> minút
          od poslednej erupcie. Ak nemáme žiadnu ďalšiu informáciu,
          predpokladáme, že pravdepodobnosť výbuchu v 14. minúte je rovnaká ako
          v 18. minúte. Na grafe nižšie vidíte, že hustota pravdepodobnosti
          tvorí obdĺžnik – jeho plocha musí byť vždy rovná 1, preto sa so
          zväčšovaním intervalu výška obdĺžnika znižuje.
        </p>

        <div className="mb-5">
          <UniformContinuousChart />
        </div>
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

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Spoľahlivosť monitorovacej siete
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavte si automatickú meteostanicu v teréne. Exponenciálne
          rozdelenie modeluje <strong>čas medzi dvoma výpadkami</strong>{" "}
          odosielania dát. Parameter <strong>&lambda;</strong> (lambda)
          predstavuje intenzitu porúch – čím je vyššia, tým častejšie k výpadkom
          dochádza a tým kratšie sú intervaly medzi nimi. Všimnite si, že krivka
          začína vysoko (krátke intervaly sú najpravdepodobnejšie) a smerom
          doprava k dlhým časom čakania prudko klesá.
        </p>

        <div className="mb-5">
          <ExponentialChart />
        </div>
      </div>

      {/* NORMÁLNE ROZDELENIE */}
      <h3 id="normal" className="mb-3 mt-5">
        Normálne (Gaussovo) rozdelenie
      </h3>
      <p className="mb-4">
        Normálne rozdelenie je najdôležitejším rozdelením v štatistike. Je
        symetrické okolo strednej hodnoty <InlineMath math="\mu" /> a jeho tvar
        "zvonu" je určený smerodajnou odchýlkou <InlineMath math="\sigma" />. V
        prírode a technike sa ním riadi väčšina náhodných chýb merania.
      </p>

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Kalibrácia a presnosť GNSS prijímača
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavte si meranie polohy stacionárneho bodu pomocou GNSS.
          Parameter <strong>&mu; (stredná hodnota)</strong> predstavuje
          systematickú chybu (napr. ak je prístroj zle kalibrovaný a vždy posúva
          výsledok o 1 meter). Parameter{" "}
          <strong>&sigma; (smerodajná odchýlka)</strong> určuje presnosť
          prístroja — čím je menšia, tým sú merania tesnejšie okolo stredu a
          prístroj je kvalitnejší. Všimnite si, že pri zmenšení{" "}
          <strong>&sigma;</strong> sa graf zúži a jeho vrchol prudko narastie,
          pretože celková plocha pod krivkou musí ostať rovná 1.
        </p>

        <div className="mb-5">
          <NormalChart />
        </div>
      </div>

      {/* <CSVDistributions /> zatial necham tak*/}

      {/* CHÍ-KVADRÁT ROZDELENIE */}
      <h3 id="chi-square" className="mb-3 mt-5">
        Chí-kvadrát rozdelenie (<InlineMath math="\chi^2" />)
      </h3>
      <p className="mb-4">
        Chí-kvadrát rozdelenie je asymetrické a nadobúda len nezáporné hodnoty.
        Je definované parametrom <strong>df (stupne voľnosti)</strong>. Hrá
        kľúčovú úlohu pri testovaní hypotéz o rozptyle a pri testoch dobrej
        zhody.
      </p>

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Kontrola stability presnosti merania
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavte si, že testujete presnosť nového laserového diaľkomera.
          Nevyhodnocujete priemernú dĺžku, ale{" "}
          <strong>variabilitu (rozptyl)</strong>
          opakovaných meraní na známu vzdialenosť. <InlineMath math="\chi^2" />{" "}
          rozdelenie modeluje súčet štvorcov týchto chýb. Parameter{" "}
          <strong>df (stupne voľnosti)</strong>
          závisí od počtu vykonaných meraní (n-1). Sledujte, ako sa pri nízkom{" "}
          <strong>df</strong>
          pravdepodobnosť koncentruje blízko nuly a so zvyšujúcim sa počtom
          meraní sa rozdelenie začína podobať na normálne.
        </p>

        <div className="mb-5">
          <ChiSquareChart />
        </div>
      </div>

      {/* STUDENTOVO T-ROZDELENIE */}
      <h3 id="student-t" className="mb-3 mt-5">
        Studentovo t-rozdelenie
      </h3>
      <p className="mb-4">
        Studentovo t-rozdelenie sa používa na odhad strednej hodnoty populácie v
        prípadoch, keď je veľkosť vzorky malá a smerodajná odchýlka populácie
        nie je známa. Je podobné normálnemu rozdeleniu, ale má "ťažšie konce"
        (vyššiu pravdepodobnosť extrémnych hodnôt).
      </p>

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Overenie presnosti nového meracieho prístroja
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavte si, že testujete presnosť nového laserového skenera, ale
          stihli ste vykonať len 5 kontrolných meraní (malá vzorka). Kvôli
          malému počtu dát máme vyššiu neistotu, čo t-rozdelenie vyjadruje
          širšími koncami krivky. Parameter{" "}
          <strong>df (stupne voľnosti)</strong> priamo súvisí s počtom meraní.
          Všimnite si, že so zvyšujúcim sa <strong>df</strong> sa t-rozdelenie
          postupne približuje k normálnemu rozdeleniu (čierna prerušovaná čiara
          v grafe).
        </p>

        <div className="mb-5">
          <StudentTChart />
        </div>
      </div>

      {/* FISHEROVO F-ROZDELENIE */}
      <h3 id="fisher-f" className="mb-3 mt-5">
        Fisherovo F-rozdelenie
      </h3>
      <p className="mb-4">
        Fisherovo-Snedecorovo rozdelenie je kľúčové pre analýzu rozptylu (ANOVA)
        a testovanie významnosti regresných modelov. Je definované dvoma
        parametrami stupňov voľnosti:
        <InlineMath math="df_1" /> (pre čitateľa) a <InlineMath math="df_2" />{" "}
        (pre menovateľa).
      </p>

      <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          Príklad z praxe: Porovnanie kvality ovzdušia v rôznych zónach mesta
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavte si, že porovnávate priemerné koncentrácie prachu{" "}
          <InlineMath math="PM_{10}" /> v priemyselnej, rezidenčnej a parkovej
          zóne. F-rozdelenie nám pomáha rozhodnúť, či sú rozdiely medzi týmito
          zónami <strong>štatisticky významné</strong> vzhľadom na prirodzené
          kolísanie hodnôt vnútri každej zóny. Sledujte, ako zmena kombinácie
          stupňov voľnosti <strong>df1</strong> a <strong>df2</strong> mení
          asymetriu a "špičatosť" rozdelenia.
        </p>

        <div className="mb-5">
          <FisherFChart />
        </div>
      </div>
    </>
  );
}

export default ContinuousDistributions;
