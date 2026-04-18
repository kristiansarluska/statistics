// src/pages/anova/PostHocTests.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import AnovaSimulation from "../../components/content/anova/AnovaSimulation";

const PostHocTests = () => {
  const { t } = useTranslation();
  return (
    <section id="post-hoc" className="mb-5">
      <h2 className="mb-4 fw-bold">Testy mnohonásobného porovnávania</h2>
      <p>
        Ak ANOVA zamietne nulovú hypotézu (<InlineMath math="p < \alpha" />
        ), vieme, že aspoň jedna dvojica stredných hodnôt sa líši. ANOVA však
        neidentifikuje, o ktorú sa jedná. Na to slúžia{" "}
        <strong>post-hoc testy</strong> – vykonávajú sa <em>po</em> zamietnutí{" "}
        <InlineMath math="H_0" /> v ANOVE a upravujú hladinu významnosti tak,
        aby celková chyba I. druhu zostala pod zvoleným{" "}
        <InlineMath math="\alpha" />.
      </p>

      {/* TEST CARDS */}
      <div className="row mb-5 g-3">
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-primary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-primary">Tukeyho HSD test</h5>
              <p className="card-text small">
                <strong>Najpoužívanejší post-hoc test.</strong> Porovnáva všetky
                možné dvojice skupín a zachováva zvolenú hladinu{" "}
                <InlineMath math="\alpha" /> pre celú rodinu testov. Vhodný pre
                vyvážené aj nevyvážené výbery.
              </p>
              <div className="text-center overflow-auto mt-3">
                <BlockMath math="\mathrm{HSD} = q \sqrt{\frac{S_\varepsilon}{n_k}}" />
              </div>
              <p className="text-muted small mb-0">
                <InlineMath math="q" /> – štatistika studentizovaného rozdelenia
                (z tabuliek), <InlineMath math="n_k" /> – veľkosť skupiny.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-success border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-success">Bonferroniho metóda</h5>
              <p className="card-text small">
                Jednoduchá a konzervatívna korekcia — korigovaná hladina
                významnosti sa vypočíta vydelením <InlineMath math="\alpha" />{" "}
                celkovým počtom porovnaní <InlineMath math="m" />:
              </p>
              <div className="text-center overflow-auto mt-3">
                <BlockMath math="\alpha^* = \frac{\alpha}{m}" />
              </div>
              <p className="text-muted small mb-0">
                Každý párový t-test sa vyhodnocuje na upravenom{" "}
                <InlineMath math="\alpha^*" />. Vhodná pre menší počet
                porovnaní, kde je konzervatívnosť akceptovateľná.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-warning border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title">Scheffého metóda</h5>
              <p className="card-text small">
                Najkonzervatívnejší test — kontroluje chybu I. druhu pri
                všetkých možných lineárnych kontrastoch, nielen párových
                porovnaniach. Vhodná najmä pre{" "}
                <strong>nevyvážené výbery</strong> (rôzny počet pozorovaní v
                skupinách). Testové kritérium sa porovnáva s kritickou hodnotou
                odvodenú z Fisherovho F-rozdelenia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SIMULATION */}
      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">{t("anova.postHoc.simulation.title")}</h5>

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

        <div className="text-muted mb-3 small">
          <Trans
            i18nKey="anova.postHoc.simulation.tryIt"
            components={{ bold: <strong /> }}
          />
        </div>
        <AnovaSimulation />
      </div>
    </section>
  );
};

export default PostHocTests;
