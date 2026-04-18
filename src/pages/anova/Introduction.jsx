// src/pages/anova/Introduction.jsx
import React from "react";

const Introduction = () => {
  return (
    <section id="introduction" className="mb-5">
      <p className="fst-italic lead">
        ANOVA (Analysis of Variance) je štatistická metóda určená na testovanie
        rozdielov medzi strednými hodnotami troch alebo viacerých výberových
        súborov.
      </p>
      <div className="alert alert-info shadow-sm">
        <strong>Hlavná myšlienka:</strong> Zisťujeme, či sa na zmenách
        pozorovanej veličiny významne podieľa určitý sledovaný faktor
        (kategorická premenná), alebo sú rozdiely spôsobené len náhodnými
        vplyvmi.
      </div>
    </section>
  );
};

export default Introduction;
