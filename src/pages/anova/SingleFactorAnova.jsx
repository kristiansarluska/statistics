// src/pages/anova/SingleFactorAnova.jsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import { useTranslation, Trans } from "react-i18next";

/**
 * @component SingleFactorAnova
 * @description Renders the core theoretical section for One-Way Analysis of Variance (ANOVA).
 * It covers the formal hypothesis definition, the linear model equation, the principle
 * of variance decomposition (Total, Between-group, and Within-group sums of squares),
 * and the final F-test calculation used to determine statistical significance.
 */
function SingleFactorAnova() {
  const { t } = useTranslation();

  return (
    <section id="single-factor" className="mb-5">
      <h2 className="mb-4 fw-bold">{t("anova.singleFactor.title")}</h2>

      <p>
        <Trans
          i18nKey="anova.singleFactor.intro1"
          components={{ bold: <strong />, m: <InlineMath math="k" /> }}
        />
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="H_0\colon \mu_1 = \mu_2 = \cdots = \mu_k" />
      </div>
      <p>
        <Trans
          i18nKey="anova.singleFactor.intro2"
          components={{ bold: <strong /> }}
        />
      </p>

      <p>
        <Trans
          i18nKey="anova.singleFactor.intro3"
          components={{ m: <InlineMath math="x_{kn}" /> }}
        />
      </p>
      <div className="text-center overflow-none my-4">
        <BlockMath math="x_{kn} = \mu + \alpha_k + \varepsilon_{kn}" />

        <div className="text-muted small text-start d-inline-block">
          <InlineMath math="\mu" /> {t("anova.singleFactor.legend.mu")}
          <br />
          <InlineMath math="\alpha_k" /> {t("anova.singleFactor.legend.alpha")}
          <br />
          <InlineMath math="\varepsilon_{kn}" />{" "}
          {t("anova.singleFactor.legend.epsilon")}
        </div>
      </div>

      {/* VARIANCE DECOMPOSITION */}
      <h4 className="mt-5 mb-3">{t("anova.singleFactor.varianceTitle")}</h4>
      <p>
        <Trans
          i18nKey="anova.singleFactor.varianceDesc"
          components={{
            m1: <InlineMath math="S_T" />,
            m2: <InlineMath math="S_\alpha" />,
            m3: <InlineMath math="S_\varepsilon" />,
            italic: <em />,
          }}
        />
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="S_T = S_\alpha + S_\varepsilon" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-primary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-primary">
                {t("anova.singleFactor.betweenTitle")}{" "}
                <InlineMath math="S_\alpha" />
              </h5>
              <p className="card-text small">
                <Trans
                  i18nKey="anova.singleFactor.betweenDesc"
                  components={{ bold: <strong /> }}
                />
              </p>
              <div className="text-center overflow-auto mt-3">
                <BlockMath math="S_\alpha = n_i \sum_{i}^{k} (\bar{x}_{i} - \bar{x})^2" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-success border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("anova.singleFactor.withinTitle")}{" "}
                <InlineMath math="S_\varepsilon" />
              </h5>
              <p className="card-text small">
                <Trans
                  i18nKey="anova.singleFactor.withinDesc"
                  components={{ bold: <strong /> }}
                />
              </p>
              <div className="text-center overflow-auto mt-3">
                <BlockMath math="S_\varepsilon = \sum_{i}^{k}\sum_{j}^{n} (x_{ij} - \bar{x}_{i})^2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* F-TEST */}
      <h4 className="mt-5 mb-3">{t("anova.singleFactor.ftestTitle")}</h4>
      <p>
        <Trans
          i18nKey="anova.singleFactor.ftestDesc"
          components={{
            italic: <em />,
            m1: <InlineMath math="F" />,
            m2: <InlineMath math="H_0" />,
            m3: <InlineMath math="k-1" />,
            m4: <InlineMath math="n-k" />,
          }}
        />
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="F_{(k-1,\; n-k)} = \frac{S_\alpha}{S_\varepsilon} \cdot \frac{n-k}{k-1} = \frac{M_\alpha}{M_\varepsilon}" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-danger">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="F > F_{1-\alpha}" />{" "}
                {t("anova.singleFactor.reject")} <InlineMath math="H_0" />
              </h6>
              <p className="small text-muted mb-0">
                {t("anova.singleFactor.rejectDesc")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <h6 className="mb-2">
                <InlineMath math="F \leq F_{1-\alpha}" />{" "}
                {t("anova.singleFactor.accept")} <InlineMath math="H_0" />
              </h6>
              <p className="small text-muted mb-0">
                {t("anova.singleFactor.acceptDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SingleFactorAnova;
