// src/pages/anova/PostHocTests.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import AnovaSimulation from "../../components/content/anova/AnovaSimulation";

const PostHocTests = () => {
  const { t } = useTranslation();
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
        <h5>{t("anova.postHoc.simulation.title")}</h5>

        <div className="text-muted mb-3 small">
          <p>
            <Trans
              i18nKey="anova.postHoc.simulation.intro"
              components={{ bold: <strong /> }}
            />
          </p>
          <ul>
            <li>
              <Trans
                i18nKey="anova.postHoc.simulation.cityOlomoucPrerov"
                components={{ bold: <strong /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey="anova.postHoc.simulation.cityJesenik"
                components={{ bold: <strong /> }}
              />
            </li>
          </ul>
        </div>

        <div>
          <div className="text-muted mb-3 small">
            <Trans
              i18nKey="anova.postHoc.simulation.tryIt"
              components={{ bold: <strong /> }}
            />
          </div>
          <AnovaSimulation />
        </div>
      </div>
    </section>
  );
};

export default PostHocTests;
