// src/pages/anova/PostHocTests.jsx
import React from "react";
import AnovaSimulation from "../../components/content/anova/AnovaSimulation";

const PostHocTests = () => {
  return (
    <section id="post-hoc">
      <h2 className="mb-4">Testy mnohonásobného porovnania</h2>
      <p>
        Ak ANOVA zamietne nulovú hypotézu (p &lt; α), vieme, že aspoň jedna
        dvojica stredných hodnôt sa líši. Nerozlíši však, ktorá to je. Na to
        slúžia <strong>post-hoc testy</strong>.
      </p>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100 border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">Tukeyho HSD test</h5>
              <p className="card-text">
                Najpoužívanejší test, ktorý porovnáva všetky možné dvojice
                skupín a identifikuje signifikantné rozdiely pri zachovaní
                zvolenej hladiny významnosti pre celú rodinu testov.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Prečo nepoužiť sériu t-testov?</h5>
              <p className="card-text text-danger">
                Pri viacerých t-testoch dochádza k nekontrolovanému zvyšovaniu
                chyby I. typu (pravdepodobnosť, že nájdeme rozdiel tam, kde nie
                je).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for Interactive Element */}
      <div className="p-5 rounded border text-center shadow-sm mt-5">
        <h4 className="text-muted">Interaktívna simulácia ANOVY a Tukey HSD</h4>
        <AnovaSimulation />
      </div>
    </section>
  );
};

export default PostHocTests;
