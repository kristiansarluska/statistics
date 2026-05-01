// src/pages/anova/Introduction.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";

/**
 * @component Introduction
 * @description Renders the introductory section for the ANOVA chapter.
 * It provides a theoretical overview of why ANOVA is used instead of multiple t-tests,
 * outlines the necessary prerequisites (independence, normality, homoscedasticity),
 * and introduces tests for homogeneity of variances (Bartlett's and Levene's tests).
 */
function Introduction() {
  const { t } = useTranslation();

  return (
    <section id="introduction" className="mb-5">
      <p className="fst-italic lead">
        <Trans
          i18nKey="anova.introduction.p1"
          components={{ italic: <em />, bold: <strong /> }}
        />
      </p>

      <p>
        <Trans
          i18nKey="anova.introduction.p2"
          components={{ bold: <strong /> }}
        />
      </p>

      {/* ANOVA USAGE */}
      <h4 className="mt-4 mb-3">{t("anova.introduction.usageTitle")}</h4>
      <p>
        <Trans
          i18nKey="anova.introduction.usageDesc"
          components={{ bold: <strong /> }}
        />
      </p>
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-secondary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-muted text-uppercase small mb-2">
                {t("anova.introduction.tests.oneSample.title")}
              </h6>
              <p className="small mb-0">
                {t("anova.introduction.tests.oneSample.parametric")}
                <br />
                <span className="text-muted">
                  {t("anova.introduction.tests.oneSample.nonparametric")}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-secondary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-muted text-uppercase small mb-2">
                {t("anova.introduction.tests.twoSamples.title")}
              </h6>
              <p className="small mb-0">
                {t("anova.introduction.tests.twoSamples.parametric")}
                <br />
                <span className="text-muted">
                  {t("anova.introduction.tests.twoSamples.nonparametric")}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-primary border-2 border-top-0 border-bottom-0 border-end-0">
            <div className="card-body">
              <h6 className="text-primary text-uppercase small mb-2">
                {t("anova.introduction.tests.threePlusSamples.title")}
              </h6>
              <p className="small mb-0">
                <strong>
                  {t("anova.introduction.tests.threePlusSamples.parametric")}
                </strong>
                <br />
                <span className="text-muted">
                  {t("anova.introduction.tests.threePlusSamples.nonparametric")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WHY NOT MULTIPLE T-TESTS */}
      <p>
        <Trans
          i18nKey="anova.introduction.whyNotMultipleP1"
          components={{
            m1: <InlineMath math="k = 3" />,
            m2: <InlineMath math="\binom{k}{2} = \binom{3}{2} = 3" />,
          }}
        />
      </p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math=" 0{,}95^3 = 0{,}857 \quad \Rightarrow \quad \alpha = 0{,}143" />
      </div>
      <p>
        <Trans
          i18nKey="anova.introduction.whyNotMultipleP2"
          components={{
            bold: <strong />,
            m1: <InlineMath math="\alpha = 0{,}05" />,
          }}
        />
      </p>

      {/* PREREQUISITES */}
      <h4 className="mt-5 mb-3">
        {t("anova.introduction.prerequisitesTitle")}
      </h4>
      <p>{t("anova.introduction.prerequisitesDesc")}</p>
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2 text-primary">
                {t("anova.introduction.prereqIndependence.title")}
              </h6>
              <p className="small text-muted mb-0">
                {t("anova.introduction.prereqIndependence.desc")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2 text-primary">
                {t("anova.introduction.prereqNormality.title")}
              </h6>
              <p className="small text-muted mb-0">
                {t("anova.introduction.prereqNormality.desc")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="mb-2 text-primary">
                {t("anova.introduction.prereqHomoscedasticity.title")}
              </h6>
              <p className="small text-muted mb-0">
                {t("anova.introduction.prereqHomoscedasticity.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HOMOGENEITY TESTS */}
      <h5 className="mt-4 mb-3">{t("anova.introduction.homogeneityTitle")}</h5>
      <p>{t("anova.introduction.homogeneityDesc")}</p>
      <div className="text-center overflow-auto my-4">
        <BlockMath math="H_0\colon \sigma_1^2 = \sigma_2^2 = \cdots = \sigma_k^2" />
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-info border-2 ">
            <div className="card-body">
              <h5 className="card-title text-info">
                {t("anova.introduction.bartlett.title")}
              </h5>
              <p className="card-text small">
                {t("anova.introduction.bartlett.desc1")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-success border-2">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("anova.introduction.levene.title")}
              </h5>
              <p className="card-text small">
                {t("anova.introduction.levene.desc1")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Introduction;
