// src/pages/randomVariable/Introduction.jsx
import React from "react";

const Introduction = () => {
  return (
    <section id="introduction" className="mb-5">
      <p className="lead">
        V reálnom svete, a obzvlášť v geoinformatike, sú naše merania a
        pozorovania takmer vždy zaťažené určitou mierou neistoty. Či už ide o
        meranie nadmorskej výšky GNSS prijímačom, počítanie výskytu dopravných
        nehôd na križovatke, alebo analýzu teploty, výsledky týchto procesov
        závisia od náhody.
      </p>
      <p>
        Aby sme mohli tieto náhodné javy matematicky a štatisticky spracovať,
        zavádzame pojem <strong>náhodná veličina</strong>. Ide o funkciu, ktorá
        každému možnému výsledku náhodného pokusu (elementárnemu javu) priradí
        konkrétne reálne číslo. Vďaka tomu vieme s neistotou pracovať exaktne –
        vieme modelovať rozdelenie pravdepodobnosti, odhadovať stredné hodnoty a
        analyzovať variabilitu našich dát.
      </p>
    </section>
  );
};

export default Introduction;
