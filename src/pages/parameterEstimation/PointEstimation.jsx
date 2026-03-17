// src/pages/parameterEstimation/PointEstimation.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";
import PointEstimationSimulation from "../../components/content/parameterEstimation/PointEstimationSimulation";
import RealDataSampling from "../../components/content/parameterEstimation/RealDataSampling";
import "katex/dist/katex.min.css";

function PointEstimation() {
  const { t } = useTranslation();

  return (
    <section id="point-estimation" className="mb-5">
      <h2 className="mb-4">{t("parameterEstimation.pointEstimation.title")}</h2>

      <p>
        <Trans
          i18nKey="parameterEstimation.pointEstimation.p1"
          components={{
            bold: <strong />,
            xbar: <InlineMath math="\bar{x}" />,
            mu: <InlineMath math="\mu" />,
          }}
        />
      </p>
      <p>
        <Trans
          i18nKey="parameterEstimation.pointEstimation.p2"
          components={{ bold: <strong /> }}
        />
      </p>

      <h4 className="mt-5 mb-3">
        {t("parameterEstimation.pointEstimation.semTitle")}
      </h4>
      <p>
        <Trans
          i18nKey="parameterEstimation.pointEstimation.semDesc"
          components={{ bold: <strong /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey="parameterEstimation.pointEstimation.semFormulaDesc"
          components={{
            sigma: <InlineMath math="\sigma" />,
            n: <InlineMath math="n" />,
          }}
        />
      </p>

      <p>{t("parameterEstimation.pointEstimation.semEffect")}</p>

      {/* Interaktívny simulátor s dynamickým vzorcom */}

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("parameterEstimation.pointEstimation.simulation.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="parameterEstimation.pointEstimation.simulation.exampleDesc"
            components={{ bold: <strong /> }}
          />
        </p>
        <PointEstimationSimulation />
      </div>
      <RealDataSampling />
    </section>
  );
}

export default PointEstimation;
