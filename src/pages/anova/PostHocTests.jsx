// src/pages/anova/PostHocTests.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import AnovaSimulation from "../../components/content/anova/AnovaSimulation";

/**
 * @component PostHocTests
 * @description Renders a section dedicated to Post-Hoc analysis following a significant ANOVA result.
 * Explains the necessity of multiple comparison tests (Tukey HSD, Bonferroni, Scheffé)
 * to identify specific group differences while controlling the family-wise error rate.
 * Includes an interactive simulation (AnovaSimulation) using regional data.
 */
function PostHocTests() {
  const { t } = useTranslation();
  return (
    <section id="post-hoc" className="mb-5">
      <h2 className="mb-4 fw-bold">{t("anova.postHoc.title")}</h2>
      <p>
        <Trans
          i18nKey="anova.postHoc.intro"
          components={{
            bold: <strong />,
            italic: <em />,
            m1: <InlineMath math="p < \alpha" />,
            m2: <InlineMath math="H_0" />,
            m3: <InlineMath math="\alpha" />,
          }}
        />
      </p>

      {/* TEST CARDS */}
      <div className="row mb-5 g-3">
        {/* TUKEY HSD */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-primary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-primary">
                {t("anova.postHoc.tukey.title")}
              </h5>
              <p className="card-text small">
                <Trans
                  i18nKey="anova.postHoc.tukey.desc"
                  components={{
                    bold: <strong />,
                    m: <InlineMath math="\alpha" />,
                  }}
                />
              </p>
            </div>
          </div>
        </div>

        {/* BONFERRONI */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-success border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("anova.postHoc.bonferroni.title")}
              </h5>
              <p className="card-text small">
                <Trans
                  i18nKey="anova.postHoc.bonferroni.desc"
                  components={{
                    m1: <InlineMath math="\alpha" />,
                    m2: <InlineMath math="m" />,
                  }}
                />
              </p>
            </div>
          </div>
        </div>

        {/* SCHEFFE */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-warning border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-warning">
                {t("anova.postHoc.scheffe.title")}
              </h5>
              <p className="card-text small">
                <Trans
                  i18nKey="anova.postHoc.scheffe.desc"
                  components={{ bold: <strong /> }}
                />
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
}

export default PostHocTests;
