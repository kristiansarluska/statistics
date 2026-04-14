// src/pages/parameterEstimation/IntervalEstimation.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import ConfidenceIntervalSimulation from "../../components/content/parameter-estimation/ConfidenceIntervalSimulation";

import "katex/dist/katex.min.css";

function IntervalEstimation() {
  const { t } = useTranslation();

  return (
    <section id="interval-estimation" className="mb-5">
      <h2 className="mb-4 fw-bold">
        {t("parameterEstimation.intervalEstimation.title")}
      </h2>

      <p>
        <Trans
          i18nKey="parameterEstimation.intervalEstimation.p1"
          components={{
            bold: <strong />,
            m1: <InlineMath math="1 - \alpha" />,
          }}
        />
      </p>

      <p>
        <Trans
          i18nKey="parameterEstimation.intervalEstimation.p2"
          components={{
            m1: <InlineMath math="(T_D, T_H)" />,
          }}
        />
      </p>

      <div className="text-center overflow-auto mb-4">
        <BlockMath math="P\!\left(T_D \leq \theta \leq T_H\right) = 1 - \alpha" />
      </div>

      <div className="alert alert-info border-info-subtle shadow-sm mb-5">
        <h5 className="alert-heading fs-6 fw-bold">
          {t("parameterEstimation.intervalEstimation.alertTitle")}
        </h5>
        <p className="mb-0 small text-muted">
          <Trans
            i18nKey="parameterEstimation.intervalEstimation.alertDesc"
            components={{ bold: <strong /> }}
          />
        </p>
      </div>

      {/* CI formula overview */}
      <h4 className="mb-3">
        {t("parameterEstimation.intervalEstimation.typesTitle")}
      </h4>
      <p className="mb-4">
        {t("parameterEstimation.intervalEstimation.typesDesc")}
      </p>
      <div className="row g-3 mb-5">
        {[
          {
            title: t("parameterEstimation.intervalEstimation.typeLeftTitle"),
            math: "\\left(\\bar{x} - z_{1-\\alpha} \\cdot \\frac{\\sigma}{\\sqrt{n}},\\;+\\infty\\right)",
            desc: t("parameterEstimation.intervalEstimation.typeLeftDesc"),
            color: "border-success",
          },
          {
            title: t(
              "parameterEstimation.intervalEstimation.typeTwoSidedTitle",
            ),
            math: "\\bar{x} \\pm z_{1-\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}",
            desc: t("parameterEstimation.intervalEstimation.typeTwoSidedDesc"),
            color: "border-primary",
          },
          {
            title: t("parameterEstimation.intervalEstimation.typeRightTitle"),
            math: "\\left(-\\infty,\\;\\bar{x} + z_{1-\\alpha} \\cdot \\frac{\\sigma}{\\sqrt{n}}\\right)",
            desc: t("parameterEstimation.intervalEstimation.typeRightDesc"),
            color: "border-warning",
          },
        ].map(({ title, math, desc, color }) => (
          <div key={title} className="col-md-4">
            <div className={`card h-100 shadow-sm border-2 ${color}`}>
              <div className="card-body">
                <h6 className="card-title fw-bold">{title}</h6>
                <div
                  className="overflow-auto text-center my-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  <BlockMath math={math} />
                </div>
                <p className="card-text small text-muted mb-0">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p>
        <Trans
          i18nKey="parameterEstimation.intervalEstimation.p3"
          components={{
            bold: <strong />,
            m1: <InlineMath math="\sigma" />,
            m2: <InlineMath math="z" />,
            m3: <InlineMath math="\sigma" />,
            m4: <InlineMath math="s" />,
            m5: <InlineMath math="n" />,
          }}
        />
      </p>

      {/* Simulation */}
      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("parameterEstimation.intervalEstimation.simTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="parameterEstimation.intervalEstimation.simDesc"
            components={{
              bold: <strong />,
              italic: <em />,
            }}
          />
        </p>
        <ConfidenceIntervalSimulation />
      </div>
    </section>
  );
}

export default IntervalEstimation;
