// src/pages/correlation/CorrelationCoefficients.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import CoefficientComparison from "../../components/charts/correlation/CoefficientComparison";

/**
 * @component CorrelationCoefficients
 * @description Renders a theoretical and interactive comparison between different types of
 * correlation coefficients. It highlights the differences between Pearson's parametric
 * coefficient (linear relationship) and Spearman's non-parametric rank coefficient
 * (monotonic relationship). Includes an interactive comparison tool (CoefficientComparison)
 * that demonstrates how both coefficients react to non-linear trends and statistical outliers.
 */
function CorrelationCoefficients() {
  const { t } = useTranslation();

  return (
    <section id="coefficients" className="mb-5">
      {/* INTRODUCTION */}
      <h2 className="mb-4 fw-bold">{t("correlation.coefficients.title")}</h2>
      <p className="mb-4">{t("correlation.coefficients.p1")}</p>

      <div className="row mb-5">
        {/* PEARSON */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 shadow-sm border-primary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h4 className="card-title text-primary mb-3">
                <Trans
                  i18nKey="correlation.coefficients.pearsonTitle"
                  components={{ m: <InlineMath math="r" /> }}
                />
              </h4>
              <p className="card-text">
                <Trans
                  i18nKey="correlation.coefficients.pearsonDesc"
                  components={{ bold: <strong /> }}
                />
              </p>
              <div className="text-center overflow-auto mt-4">
                <BlockMath math="r = \frac{cov(X,Y)}{\sigma_X \sigma_Y}" />
              </div>
            </div>
          </div>
        </div>

        {/* SPEARMAN */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 shadow-sm border-success border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h4 className="card-title text-success mb-3">
                <Trans
                  i18nKey="correlation.coefficients.spearmanTitle"
                  components={{ m: <InlineMath math="r_s" /> }}
                />
              </h4>
              <p className="card-text">
                <Trans
                  i18nKey="correlation.coefficients.spearmanDesc"
                  components={{ bold: <strong /> }}
                />
              </p>
              <div className="text-center overflow-auto mt-4">
                <BlockMath math="r_s = 1 - \frac{6 \sum (P_i - R_i)^2}{n(n^2 - 1)}" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE COMPARISON */}
      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">{t("correlation.comparison.title")}</h5>

        <p className="text-muted mb-3 small">
          <Trans
            i18nKey="correlation.comparison.p1"
            components={{ bold: <strong /> }}
          />
        </p>

        <h6 className="text-muted mb-3">
          {t("correlation.comparison.instructionsTitle")}
        </h6>
        <ul className="text-muted mb-3 small">
          <li className="text-muted mb-3 ">
            <Trans
              i18nKey="correlation.comparison.instructions.nonlinear"
              components={{ bold: <strong className="text-body" /> }}
            />
          </li>
          <li className="text-muted mb-3 ">
            <Trans
              i18nKey="correlation.comparison.instructions.outlier"
              components={{ bold: <strong className="text-body" /> }}
            />
          </li>
          <li className="text-muted mb-3 ">
            <Trans
              i18nKey="correlation.comparison.instructions.interactive"
              components={{ bold: <strong className="text-body" /> }}
            />
          </li>
        </ul>

        {/* Samotný interaktívny komponent */}
        <CoefficientComparison />
      </div>
    </section>
  );
}

export default CorrelationCoefficients;
