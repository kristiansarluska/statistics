// src/pages/randomVariable/Characteristics.jsx
import React from "react";
import ArithmeticMeanCalc from "../../components/content/characteristics/ArithmeticMeanCalc";
import HarmonicMeanCalc from "../../components/content/characteristics/HarmonicMeanCalc";
import GeometricMeanCalc from "../../components/content/characteristics/GeometricMeanCalc";
import WeightedMeanCalc from "../../components/content/characteristics/WeightedMeanCalc";
import ModeCalc from "../../components/content/characteristics/ModeCalc";
import MedianCalc from "../../components/content/characteristics/MedianCalc";
import RangeCalc from "../../components/content/characteristics/RangeCalc";
import MeanDeviationCalc from "../../components/content/characteristics/MeanDeviationCalc";
import MeanDifferenceCalc from "../../components/content/characteristics/MeanDifferenceCalc";
import VarianceCalc from "../../components/content/characteristics/VarianceCalc";

const Characteristics = () => {
  return (
    <section id="characteristics">
      <h2 className="mb-4">Charakteristiky náhodnej veličiny</h2>

      <div id="location" className="mb-5">
        <h3 className="mb-3">Charakteristiky polohy</h3>

        <h4 className="mt-4">Aritmetický priemer</h4>
        <p>
          Aritmetický priemer je najpoužívanejšou mierou polohy. Predstavuje
          ťažisko hodnôt náhodnej veličiny. V geoinformatike sa využíva
          napríklad na určenie najpravdepodobnejšej hodnoty pri opakovaných
          meraniach toho istého bodu.
        </p>
        <div className="my-4">
          <ArithmeticMeanCalc />
        </div>

        <h4 className="mt-4">Harmonický priemer</h4>
        <p>
          Harmonický priemer sa v geoinformatike využíva najmä pri výpočte
          priemerných rýchlostí (napríklad rýchlosť vozidla alebo bezpilotného
          lietadla), ak sa vzťahujú na rovnako dlhé úseky dráhy.
        </p>
        <div className="my-4">
          <HarmonicMeanCalc />
        </div>

        <h4 className="mt-4">Geometrický priemer</h4>
        <p>
          Geometrický priemer je vhodný na výpočet priemerného tempa rastu.
          Používa sa napríklad pri analýze časových radov v GIS, ako je
          priemerné ročné tempo expanzie mestskej zástavby alebo zmeny rozlohy
          lesov.
        </p>
        <div className="my-4">
          <GeometricMeanCalc />
        </div>

        <h4 className="mt-4">Vážený priemer</h4>
        <p>
          Vážený priemer sa používa v situáciách, kedy jednotlivé merania nemajú
          rovnakú dôležitosť (váhu). V geoinformatike ho môžeme aplikovať
          napríklad pri zlučovaní súradníc z viacerých prístrojov, kde váhou je
          presnosť daného merania (napríklad prevrátená hodnota rozptylu
          prístroja).
        </p>
        <div className="my-4">
          <WeightedMeanCalc />
        </div>

        <h3 className="mb-3">Modus</h3>
        <p className="mb-4">
          Modus je hodnota, ktorá sa v štatistickom súbore vyskytuje
          najčastejšie. Pri spojitých dátach (napríklad presné GNSS merania) sa
          určuje ťažšie a hľadáme skôr interval s najväčšou hustotou. Pre
          diskrétne dáta je to však priama, konkrétna hodnota.
        </p>

        <h5 className="mb-3">
          Empirický modus: Počet poschodí v mestskej zástavbe
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          V nasledovnom príklade analyzujeme podlažnosť budov vo vybranej
          mestskej štvrti. Modusom bude typ budovy, ktorý sa v danej oblasti
          vyskytuje najviac (napr. dvojposchodové rodinné domy). Na grafe si
          môžete všimnúť aj sekundárny lokálny vrchol (tzv. lokálny modus)
          reprezentujúci napríklad zhluk sedemposchodových panelákov. Pridávaním
          alebo odoberaním budov môžete sledovať, ako sa mení najčastejšie sa
          vyskytujúca hodnota.
        </p>

        <div className="mb-5">
          <ModeCalc />
        </div>

        <h3 className="mb-3">Medián</h3>
        <p className="mb-4">
          Medián rozdeľuje štatistický súbor na dve rovnako veľké polovice.
          Polovina hodnôt je menšia alebo rovná mediánu a druhá polovina je
          väčšia alebo rovná mediánu.
        </p>

        <h5 className="mb-3">
          Empirický medián: Výška budov a rezistencia voči extrémom
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Hlavnou výhodou mediánu oproti aritmetickému priemeru je jeho{" "}
          <strong>odolnosť (rezistentnosť) voči odľahlým hodnotám</strong>.
          Predstavme si, že analyzujeme výšky budov v bežnej zástavbe.
          Vyskúšajte si do dát pridať extrémnu hodnotu – napríklad nový{" "}
          <strong>150-metrový mrakodrap</strong>. Všimnite si, že kým
          aritmetický priemer by táto stavba radikálne skreslila (vystrelil by
          na takmer dvojnásobok), medián sa posunie len minimálne, pretože
          zohľadňuje výhradne fyzický stred zoradeného radu.
        </p>

        <div className="mb-5">
          <MedianCalc />
        </div>
      </div>

      <div id="variability" className="mb-5">
        <h3 className="mb-3">Charakteristiky variability (rozptýlenosti)</h3>
        <p className="mb-4">
          Kým miery polohy nám hovoria, kde sa dáta sústreďujú, miery
          variability nám prezrádzajú, ako veľmi sú od seba rozptýlené.
          Najjednoduchšou mierou je variačné rozpätie.
        </p>

        <h4 className="mb-3">Variačné rozpätie (Range)</h4>
        <p className="mb-4">
          Variačné rozpätie ($R$) je rozdiel medzi maximálnou a minimálnou
          hodnotou v štatistickom súbore. Je to rýchly ukazovateľ šírky
          intervalu, v ktorom sa dáta nachádzajú, no pre svoju podstatu je
          extrémne citlivý na odľahlé (extrémne) hodnoty.
        </p>

        <h5 className="mb-3">
          Empirické variačné rozpätie: Prevýšenie lyžiarskeho svahu
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Predstavte si, že analyzujeme výškový profil lyžiarskeho svahu na
          Malej Morávke. Získali sme niekoľko výškových bodov (v metroch nad
          morom). Variačné rozpätie nám v tomto prípade udáva celkové prevýšenie
          zjazdovky. Pridajte do výpočtu extrémnu hodnotu (napríklad blízky
          vrchol Praděd s výškou 1492 m n. m.) a sledujte, ako sa variačné
          rozpätie okamžite skreslí.
        </p>

        <div className="mb-5">
          <RangeCalc />
        </div>

        <h4 className="mb-3">Priemerná odchýlka (Mean Absolute Deviation)</h4>
        <p className="mb-4">
          Priemerná odchýlka vyjadruje, o koľko sa v priemere jednotlivé hodnoty
          štatistického súboru odchyľujú od ich aritmetického priemeru. Počíta
          sa ako aritmetický priemer absolútnych hodnôt odchýlok od strednej
          hodnoty. Oproti variačnému rozpätiu využíva informácie zo všetkých
          meraní, nielen z extrémov.
        </p>

        <h5 className="mb-3">
          Empirická priemerná odchýlka: Opakované meranie dĺžky
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          V geodézii nikdy nezmeriame rovnakú vzdialenosť dvakrát s absolútne
          identickým výsledkom. Nasledujúce dáta predstavujú päť nezávislých
          meraní dĺžky hranice parcely v metroch. Priemerná odchýlka nám v tomto
          prípade udáva priemernú absolútnu chybu jednotlivého merania voči
          strednej hodnote. Vyskúšajte pridať meranie so zjavnou hrubou chybou
          (napr. 51.5) a sledujte zmenu odchýlky.
        </p>

        <div className="mb-5">
          <MeanDeviationCalc />
        </div>

        <h4 className="mb-3">Stredná diferencia (Mean Absolute Difference)</h4>
        <p className="mb-4">
          Stredná diferencia ($\Delta$) nevyjadruje odchýlku hodnôt od ich
          priemeru, ale priemerný absolútny rozdiel medzi{" "}
          <strong>akýmikolvek dvoma hodnotami</strong> navzájom. Počíta sa ako
          súčet absolútnych rozdielov všetkých možných dvojíc vydelený počtom
          týchto dvojíc.
        </p>

        <h5 className="mb-3">
          Empirická stredná diferencia: Heterogenita znečistenia ovzdušia
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          V geoinformatike často pracujeme so senzorovými sieťami. Predstavme si
          meracie stanice, ktoré sledujú koncentráciu prachových častíc PM10 (v
          µg/m³) vo veľkomeste. Stredná diferencia nám priamo povie, aký
          priemerný rozdiel v znečistení môžeme očakávať, ak sa presunieme z
          okolia jednej ľubovoľnej stanice k inej. Vyskúšajte do siete pridať
          stanicu ležiacu pri rušnej križovatke (napríklad s hodnotou 85.0) a
          sledujte, ako vzrastie priemerný rozdiel v sieti.
        </p>

        <div className="mb-5">
          <MeanDifferenceCalc />
        </div>

        <h4 className="mb-3">Rozptyl (Variance)</h4>
        <p className="mb-4">
          Rozptyl ($s^2$ pre výberový súbor, $\sigma^2$ pre základný súbor) je
          priemerná štvorcová odchýlka hodnôt od ich strednej hodnoty. Tým, že
          sa odchýlky umocňujú na druhú, rozptyl
          <strong> výrazne penalizuje veľké extrémy</strong>. Nevýhodou je, že
          výsledok vychádza v štvorcových jednotkách (napr. metre štvorcové,
          stupne Celzia na druhú), čo je ťažšie na priamu interpretáciu.
        </p>

        <h5 className="mb-3">
          Empirický rozptyl: Heterogenita mračna bodov (LiDAR)
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Pri leteckom laserovom skenovaní lesa nás zaujíma nielen priemerná
          hustota bodov, ale aj jej variabilita. Nasledujúce dáta reprezentujú
          počet odrazov (bodov) na meter štvorcový vo vybraných testovacích
          plochách. Vyskúšajte pridať plochu s extrémne hustým pokrytím (napr.
          50 bodov/m²) a všimnite si, ako hodnota rozptylu kvôli umocňovaniu
          rapídne narastie.
        </p>

        <div className="mb-5">
          <VarianceCalc />
        </div>

        <h4 className="mt-4">Smerodajná odchýlka</h4>
        <p>{/* Content... */}</p>

        <h4 className="mt-4">Variačný koeficient</h4>
        <p>{/* Content... */}</p>

        <h4 className="mt-4">Medzikvartilová odchýlka</h4>
        <p>{/* Content... */}</p>
      </div>

      <div id="other-measures" className="mb-5">
        <h3 className="mb-3">Iné číselné miery</h3>

        <h4 className="mt-4">Koeficient šikmosti</h4>
        <p>{/* Content... */}</p>

        <h4 className="mt-4">Koeficient špicatosti</h4>
        <p>{/* Content... */}</p>
      </div>

      <div id="five-number" className="mb-4">
        <h3 className="mb-3">Päťčíselná charakteristika</h3>
        <p>{/* Content... */}</p>
      </div>
    </section>
  );
};

export default Characteristics;
