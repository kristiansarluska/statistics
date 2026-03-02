// src/pages/randomVariable/Characteristics.jsx
import React from "react";
import ArithmeticMeanCalc from "../../components/content/characteristics/ArithmeticMeanCalc";
import HarmonicMeanCalc from "../../components/content/characteristics/HarmonicMeanCalc";
import GeometricMeanCalc from "../../components/content/characteristics/GeometricMeanCalc";
import WeightedMeanCalc from "../../components/content/characteristics/WeightedMeanCalc";
import ModeCalc from "../../components/content/characteristics/ModeCalc";
import MedianCalc from "../../components/content/characteristics/MedianCalc";

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
        <h3 className="mb-3">Charakteristiky variability</h3>

        <h4 className="mt-4">Variačné rozpätie</h4>
        <p>{/* Content... */}</p>

        <h4 className="mt-4">Priemerná odchýlka</h4>
        <p>{/* Content... */}</p>

        <h4 className="mt-4">Stredná diferencia</h4>
        <p>{/* Content... */}</p>

        <h4 className="mt-4">Rozptyl</h4>
        <p>{/* Content... */}</p>

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
