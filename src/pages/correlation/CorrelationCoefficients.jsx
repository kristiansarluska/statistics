// src/pages/correlation/CorrelationCoefficients.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";

function CorrelationCoefficients() {
  const { t } = useTranslation();

  return (
    <section id="coefficients" className="mb-5">
      <h2 className="mb-4">{t("correlation.coefficients.title")}</h2>
      <p className="mb-4">{t("correlation.coefficients.p1")}</p>

      <div className="row mb-5">
        <div className="col-lg-6 mb-4">
          <div className="card h-100 shadow-sm">
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
            </div>
            <div className="card-footer bg-light border-top-0 pb-4">
              <div className="text-center overflow-auto mt-2">
                <BlockMath math="r = \frac{cov(X,Y)}{\sigma_X \sigma_Y}" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card h-100 shadow-sm">
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
            </div>
            <div className="card-footer bg-light border-top-0 pb-4">
              <div className="text-center overflow-auto mt-2">
                <BlockMath math="r_s = 1 - \frac{6 \sum (P_i - R_i)^2}{n(n^2 - 1)}" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for Data Comparison */}
      <div className="card bg-light border-0 shadow-sm p-5 text-center mt-4 border-start border-end border-5 border-secondary">
        <h5 className="text-muted">
          {t("correlation.coefficients.placeholderTitle")}
        </h5>
        <p className="text-muted small mb-0">
          {t("correlation.coefficients.placeholderDesc")}
        </p>
      </div>
    </section>
  );
}

export default CorrelationCoefficients;
