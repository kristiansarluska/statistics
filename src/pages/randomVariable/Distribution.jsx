// src/pages/randomVariable/Distribution.jsx
import React from "react";
import { InlineMath } from "react-katex";
import DiscreteDistributionChart from "../../components/charts/random-variable/distribution/DiscreteDistributionChart";
import SimulatedPMFChart from "../../components/charts/random-variable/distribution/SimulatedPMFChart";
import SimulatedPDFChart from "../../components/charts/random-variable/distribution/SimulatedPDFChart";
import QuantileFunctionSlider from "../../components/charts/random-variable/distribution/QuantileFunctionSlider";
import QuantileFunctionInput from "../../components/charts/random-variable/distribution/QuantileFunctionInput";
import NormalChart from "../../components/charts/probability-distributions/continuous/NormalChart";

const Distribution = () => {
  return (
    <section id="distribution">
      <h2 className="mb-4">Rozdelenie náhodnej veličiny</h2>

      {/* Úvod k funkciám popisujúcim rozdelenie */}
      <p className="mb-5">
        Rozdelenie pravdepodobnosti nám hovorí, ako sú pravdepodobnosti
        "rozdelené" medzi jednotlivé možné hodnoty náhodnej veličiny. Na jeho
        komplexný matematický a vizuálny popis využívame tri základné funkcie:
        pravdepodobnostnú (pre spojité veličiny hustotu), distribučnú a
        kvantilovú funkciu.
      </p>

      <div id="pmf-pdf" className="mb-5">
        <h3 className="mb-3">Pravdepodobnostná funkcia a hustota</h3>
        <p className="mb-4">
          Pri diskrétnych veličinách používame{" "}
          <strong>pravdepodobnostnú funkciu (PMF)</strong>, ktorá priraďuje
          priamu pravdepodobnosť výskytu konkrétnej hodnote (
          <InlineMath math="P(X=x)" />
          ).
          <br />
          <br />
          Pri spojitých veličinách definujeme{" "}
          <strong>hustoty pravdepodobnosti (PDF)</strong>. Keďže spojitá
          veličina má nekonečne veľa hodnôt, pravdepodobnosť jedného konkrétneho
          bodu je nulová. Namiesto toho určujeme pravdepodobnosť, že hodnota
          padne do určitého intervalu — táto pravdepodobnosť je reprezentovaná{" "}
          <strong>plochou pod krivkou hustoty</strong> na danom úseku.
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            Príklad: Počet viditeľných GNSS satelitov (PMF)
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            V mestskom prostredí (tzv. "urban canyons") je počet viditeľných
            satelitov náhodná premenná. Všimnite si, že graf nižšie netvorí
            spojitú čiaru, ale <strong>jednotlivé body (stĺpce)</strong>. Je to
            preto, že nemôžeme vidieť "polovicu" satelitu. Súčet
            pravdepodobností všetkých možných stĺpcov (napr. od 0 po 12
            satelitov) sa musí vždy rovnať presne 1 (100 %).
          </p>
          <SimulatedPMFChart />
        </div>

        <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            Simulácia odchýlky GNSS merania (Hustota pravdepodobnosti)
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Generovanie náhodných chýb GPS prijímača. Teoretické rozdelenie
            (modrá krivka) má strednú hodnotu <strong>0 m</strong> a smerodajnú
            odchýlku <strong>2.5 m</strong>. Sledujte, ako sa empirický
            histogram (sivá plocha) s rastúcim počtom meraní postupne približuje
            k dokonalým teoretickým krivkám.
          </p>
          <div className="mb-4">
            <SimulatedPDFChart />
          </div>
        </div>
      </div>

      <div id="cdf" className="mb-5">
        <h3 className="mb-3">Distribučná funkcia</h3>
        <p className="mb-4">
          Distribučná funkcia (<InlineMath math="F(x)" />) plní kumulatívnu
          úlohu. Udáva celkovú pravdepodobnosť, že náhodná veličina nadobudne
          hodnotu menšiu alebo rovnú konkrétnemu číslu <InlineMath math="x" /> (
          <InlineMath math="F(x) = P(X \le x)" />
          ). Je to neklesajúca funkcia, ktorá začína v nule (0 %) a postupne
          rastie alebo skokovito stúpa k hodnote 1 (100 %). Zatiaľ čo hustota
          ukazuje okamžitý stav, distribučná funkcia ponúka súhrnný obraz.
        </p>

        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">Diskrétny prípad: Dostupnosť družicových dát</h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Predstavte si, že mesačne očakávate max. 5 preletov družice. Náhodná
            veličina <strong>X</strong> predstavuje počet snímok, ktoré sú
            reálne použiteľné (bez oblačnosti).
            <br />
            <br />
            Hodnoty v políčkach nižšie nepredstavujú fixné percentá, ale{" "}
            <strong>
              početnosť výskytu (napr. počet mesiacov z historických záznamov)
            </strong>
            , kedy nastal daný scenár. Graf všetky hodnoty sčíta a automaticky
            ich premení na pravdepodobnosť (súčet vždy 100 %).
            <br />
            <br />
            <strong>Vyskúšajte si to:</strong> Do políčka pre{" "}
            <strong>x = 0</strong> zadajte vysoké číslo (napr. 80). Nasimulujete
            tak oblasť s častou oblačnosťou. Všimnite si, ako distribučná
            funkcia (schodíky) okamžite strmo narastie, čo znamená vysoké riziko
            nedostatku dát.
          </p>
          <DiscreteDistributionChart />
        </div>

        <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            Spojitý prípad: Distribúcia chýb GNSS merania
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Na rozdiel od diskrétnych veličín je distribučná funkcia spojitej
            premennej reprezentovaná <strong>hladkou krivkou</strong> bez
            skokov. Tento model je kľúčový pri analýze presnosti meracích
            prístrojov v teréne.
            <br />
            <br />
            Tvar tejto krivky určujú v prípade normálneho rozdelenia dva typy
            chýb: <strong>systematická chyba (parameter &mu;)</strong>, ktorá
            predstavuje konštantný posun merania (napr. o 1 meter kvôli zlej
            kalibrácii), a <strong>náhodná chyba (parameter &sigma;)</strong>,
            ktorá vyjadruje samotnú presnosť prístroja.
            <br />
            <br />
            Distribučná funkcia v každom bode udáva pravdepodobnosť, že chyba
            merania neprekročí zvolenú hodnotu. Všimnite si, že v bode{" "}
            <strong>&mu;</strong> (stred rozdelenia) nadobúda funkcia vždy
            hodnotu <strong>0.5</strong>. To znamená, že je presne 50 % šanca,
            že nameraná odchýlka bude menšia alebo rovná systémovému posunu
            prístroja.
          </p>
          <NormalChart />
        </div>
      </div>

      <div id="quantile" className="mb-5">
        <h3 className="mb-3">Kvantilová funkcia</h3>
        <p className="mb-4">
          Kvantilová funkcia je inverznou (opačnou) k distribučnej funkcii.
          Namiesto otázky "Aká je pravdepodobnosť, že nameriame hodnotu pod{" "}
          <InlineMath math="x" />
          ?" ju otáčame: "Aká je hraničná hodnota (<InlineMath math="x_p" />
          ), pod ktorou sa nachádza presne určené percento dát (
          <InlineMath math="p" />
          )?" Najznámejším kvantilom je <strong>medián</strong> (
          <InlineMath math="p = 0.5" />
          ), ďalšími dôležitými míľnikmi sú kvartily a decily.
        </p>

        {/* KVANTILOVÁ FUNKCIA Z REÁLNYCH DÁT */}
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            Príklad z praxe: Podiel obyvateľstva v hlavnom meste
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            V nasledujúcom grafe vidíte empirickú kvantilovú funkciu vytvorenú z
            reálnych dát o tom, koľko percent obyvateľstva jednotlivých
            európskych krajín žije v ich hlavnom meste (rok 2024). Na osi{" "}
            <strong>x</strong> volíme percentil (<InlineMath math="p" /> v %) a
            na osi
            <strong>y</strong> odčítavame príslušný kvantil{" "}
            <InlineMath math="x_p" /> (samotný podiel obyvateľstva v %).
            <br />
            <br />
            <strong>Ako to čítať?</strong> Posuňte slider na pravdepodobnosť{" "}
            <strong>50 % (medián)</strong>. Kvantil, ktorý získate, predstavuje
            hraničnú hodnotu — presne polovica európskych krajín má podiel
            obyvateľov hlavného mesta menší (alebo rovný) tomuto číslu. Prípadne
            do poľa zadajte konkrétny podiel (napr. 25 %) a zistite, koľko
            percent krajín sa pod túto hranicu zmestí.
          </p>
          <div className="mb-4">
            <QuantileFunctionSlider />
          </div>
        </div>

        <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            Empirická kvantilová funkcia: Výška stromov v rezervácii
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Predvolené dáta reprezentujú zoradené výšky stromov (v metroch)
            namerané v malej prírodnej rezervácii (napr. z dát leteckého
            laserového skenovania - LiDAR). Vyskúšajte si zobraziť{" "}
            <strong>medián</strong> (50 % stromov je nižších alebo rovnako
            vysokých) alebo <strong>decily</strong> (napr. 9. decil ukáže
            hraničnú výšku, pod ktorou sa nachádza 90 % všetkých stromov). Dáta
            môžete interaktívne mazať a dopĺňať vlastnými hodnotami.
          </p>
        </div>

        <div>
          <QuantileFunctionInput />
        </div>
      </div>
    </section>
  );
};

export default Distribution;
