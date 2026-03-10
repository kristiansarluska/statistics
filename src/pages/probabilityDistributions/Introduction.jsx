// src/pages/probabilityDistributions/Introduction.jsx
import React from "react";

function Introduction() {
  return (
    <section id="introduction" className="mb-5">
      <p className="lead">
        V geoinformatike často pracujeme s údajmi, ktoré majú náhodný charakter
        — napríklad chybou merania, odchýlkami v polohách bodov alebo
        variabilitou v dátach získaných z terénu. Aby sme tieto javy vedeli
        modelovať, používame <strong>pravdepodobnostné rozdelenia</strong>.
      </p>
      <p>
        Ich cieľom je matematicky opísať, s akou pravdepodobnosťou sa jednotlivé
        hodnoty náhodnej veličiny vyskytujú. Na základe takého popisu môžeme
        nielen analyzovať minulé dáta, ale aj predpovedať správanie systému do
        budúcnosti.
      </p>
    </section>
  );
}

export default Introduction;
