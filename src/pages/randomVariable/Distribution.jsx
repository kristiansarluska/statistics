// src/pages/randomVariable/Distribution.jsx
import React from "react";
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

      <div id="pmf-pdf" className="mb-5">
        <h3 className="mb-3">Pravdepodobnostná funkcia</h3>
        <p>
          {/* Tu pôjde teoretický úvod k pravdepodobnostnej funkcii a hustote... */}
        </p>
        <SimulatedPMFChart />

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
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
        <p>{/* Tu pôjde teória k distribučnej funkcii... */}</p>

        <DiscreteDistributionChart />

        <NormalChart />
      </div>

      <div id="quantile" className="mb-5">
        <h3 className="mb-3">Kvantilová funkcia</h3>
        <p>{/* Tu pôjde teória ku kvantilovej funkcii... */}</p>
        <div className="mb-4">
          <QuantileFunctionSlider />
        </div>

        <div className="mx-auto w-100" style={{ maxWidth: "800px" }}>
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
