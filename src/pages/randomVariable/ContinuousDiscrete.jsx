// src/pages/randomVariable/ContinuousDiscrete.jsx
import React from "react";

const ContinuousDiscrete = () => {
  return (
    <section id="continuous-discrete" className="mb-5">
      <h2 className="mb-3">Spojitá a diskrétna náhodná veličina</h2>
      <p>
        Náhodná veličina je funkcia, ktorá každému elementárnemu javu priraďuje
        reálne číslo. Zjednodušene povedané, "prekladá" náhodné výsledky rôznych
        javov do reči čísel, s ktorými vieme ďalej štatisticky pracovať. Podľa
        toho, aké hodnoty môže veličina nadobúdať, ju delíme na dva základné
        typy:
      </p>

      <div className="row mt-4">
        {/* Discrete Card */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Diskrétna veličina</h5>
              <p className="card-text">
                Nadobúda len <strong>spočítateľné množstvo hodnôt</strong>{" "}
                (zvyčajne celé čísla). Medzi jednotlivými hodnotami sú medzery,
                neexistujú prechody.
              </p>
              <ul className="mb-0 text-muted small">
                <li>
                  <strong>Proces:</strong> Vzniká rátaním (počítaním výskytov).
                </li>
                <li>
                  <strong>Príklady:</strong> Počet zemetrasení za rok, počet
                  budov v bloku, počet dopravných nehôd na križovatke.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Continuous Card */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Spojitá veličina</h5>
              <p className="card-text">
                Môže nadobúdať{" "}
                <strong>akúkoľvek hodnotu z určitého intervalu</strong>. Počet
                možných hodnôt je nekonečný a obmedzuje ho len presnosť
                meracieho prístroja.
              </p>
              <ul className="mb-0 text-muted small">
                <li>
                  <strong>Proces:</strong> Vzniká meraním.
                </li>
                <li>
                  <strong>Príklady:</strong> Nadmorská výška bodu, priemerná
                  ročná teplota, vzdialenosť budovy od rieky.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContinuousDiscrete;
