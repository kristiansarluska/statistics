// src/pages/anova/AssumptionViolations.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";

/**
 * @component AssumptionViolations
 * @description Renders a theoretical section focused on the assumptions of ANOVA.
 * It details the requirements for independence, normality, and homoscedasticity,
 * and provides a set of cards explaining alternative non-parametric tests
 * (Friedman, Kruskal-Wallis, Welch) used when these assumptions are violated.
 */
function AssumptionViolations() {
  const { t } = useTranslation();

  return (
    <section
      id="violation"
      className="mb-5"
      style={{
        minHeight: "75vh",
        scrollMarginTop: "100px",
      }}
    >
      <h2 className="mb-4 fw-bold">{t("anova.assumptionViolations.title")}</h2>
      <div className="mb-4">
        {t("anova.assumptionViolations.intro1")}
        <ul>
          <li>{t("anova.assumptionViolations.list.independence")}</li>
          <li>{t("anova.assumptionViolations.list.normality")}</li>
          <li>{t("anova.assumptionViolations.list.homoscedasticity")}</li>
        </ul>
        {t("anova.assumptionViolations.intro2")}
      </div>
      <div className="row mb-5 g-3">
        {/* FRIEDMAN */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                {t("anova.assumptionViolations.cards.friedman.violation")}
              </h6>
              <h5 className="card-title mb-2">
                {t("anova.assumptionViolations.cards.friedman.title")}
              </h5>
              <p className="card-text small text-muted mb-0">
                <Trans
                  i18nKey="anova.assumptionViolations.cards.friedman.desc"
                  components={{ bold: <strong /> }}
                ></Trans>
              </p>
            </div>
          </div>
        </div>

        {/* KRUSKAL-WALLIS */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                {t("anova.assumptionViolations.cards.kruskal.violation")}
              </h6>
              <h5 className="card-title mb-2">
                {t("anova.assumptionViolations.cards.kruskal.title")}
              </h5>
              <p className="card-text small text-muted mb-0">
                <Trans
                  i18nKey="anova.assumptionViolations.cards.kruskal.desc"
                  components={{ bold: <strong /> }}
                ></Trans>
              </p>
            </div>
          </div>
        </div>

        {/* WELCH */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-danger border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-danger text-uppercase small mb-1">
                {t("anova.assumptionViolations.cards.welch.violation")}
              </h6>
              <h5 className="card-title mb-2">
                {t("anova.assumptionViolations.cards.welch.title")}
              </h5>
              <p className="card-text small text-muted mb-0">
                <Trans
                  i18nKey="anova.assumptionViolations.cards.welch.desc"
                  components={{ bold: <strong /> }}
                ></Trans>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AssumptionViolations;
