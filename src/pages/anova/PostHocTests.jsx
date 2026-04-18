// src/pages/anova/PostHocTests.jsx
import React from "react";
import AnovaSimulation from "../../components/content/anova/AnovaSimulation";

const PostHocTests = () => {
  return (
    <section id="post-hoc" className="mb-5">
      <h2 className="mb-4">Testy mnohonásobného porovnávania</h2>
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

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5>Priemerné denné teploty</h5>
        <div className="text-muted mb-3 small">
          <p>
            V nasledujúcej simulácii sú načítané
            <strong> historické dáta (OpenMeteo) pre júl 2025</strong> v troch
            moravských mestách. Cieľom analýzy je zistiť, či je prítomná
            preukázateľná odlišnosť v ich priemerných teplotách za daný mesiac.
          </p>
          <ul>
            <li>
              <strong>Olomouc a Přerov:</strong> Obe mestá ležia blízko seba v
              nížinatej oblasti Hornomoravského úvalu. Predpokladáme, že
              teplotné rozdiely medzi nimi budú minimálne.
            </li>
            <li>
              <strong>Jeseník:</strong> Mesto situované v horskom prostredí vo
              väčšej nadmorskej výške. Očakávame, že ANOVA zamietne nulovú
              hypotézu a post-hoc test potvrdí významný rozdiel voči obom
              nížinným mestám.
            </li>
          </ul>
        </div>
        <div>
          <div className="alert alert-info">
            <strong>Vyskúšajte si:</strong> V grafe Tukey HSD si všimnite, že
            interval rozdielu medzi Olomoucom a Přerovom pretína nulovú líniu
            (rozdiel nie je štatisticky významný). Následne skúste pomocou
            posuvníkov zvýšiť teplotu v Jeseníku. Sledujte, kedy sa jeho teploty
            priblížia tým na nížine a ako na to zareaguje výsledok post-hoc
            testu a p-hodnota.
          </div>
          <AnovaSimulation />
        </div>
      </div>
    </section>
  );
};

export default PostHocTests;
