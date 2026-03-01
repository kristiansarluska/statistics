// src/pages/randomVariable/Characteristics.jsx
import React from "react";
import ArithmeticMeanCalc from "../../components/content/characteristics/ArithmeticMeanCalc";
import HarmonicMeanCalc from "../../components/content/characteristics/HarmonicMeanCalc";
import GeometricMeanCalc from "../../components/content/characteristics/GeometricMeanCalc";

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
        <p>{/* Content... */}</p>

        <h4 className="mt-4">Modus</h4>
        <p>{/* Content... */}</p>

        <h4 className="mt-4">Medián</h4>
        <p>{/* Content... */}</p>
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
