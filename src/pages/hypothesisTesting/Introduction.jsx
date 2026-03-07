// src/pages/hypothesisTesting/Introduction.jsx
import React from "react";

function Introduction() {
  return (
    <section id="introduction" className="scroll-mt-4">
      <p className="lead">
        Testovanie hypotéz je základná metóda induktívnej štatistiky, ktorá
        umožňuje rozhodovať o vlastnostiach základného súboru na základe dát
        získaných z výberového súboru. V praxi často potrebujeme zistiť, či
        pozorovaný rozdiel v dátach predstavuje skutočný jav, alebo je len
        dôsledkom náhodnej variability výberu.
      </p>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">Základné hypotézy</h5>
          <ul className="mb-0">
            <li>
              <strong>
                Nulová hypotéza (H<sub>0</sub>):
              </strong>{" "}
              Očakávaný stav, ktorý predpokladáme, že platí. Zvyčajne vyjadruje
              "nulový efekt" (napr. neexistuje rozdiel, stredná hodnota sa rovná
              očakávanej).
            </li>
            <li className="mt-2">
              <strong>
                Alternatívna hypotéza (H<sub>A</sub>):
              </strong>{" "}
              Logický opak H<sub>0</sub>. Tvrdí, že existuje rozdiel, závislosť
              alebo zmena. V dátach hľadáme dôkaz práve pre zamietnutie H
              <sub>0</sub> a prijatie H<sub>A</sub>.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Introduction;
