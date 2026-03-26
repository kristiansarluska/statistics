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

      <div className="mx-auto w-100 mb-5 mt-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("parameterEstimation.pointEstimation.simulation.exampleTitle")}
        </h5>

        {/* Manuálne pridaný kontextový text pre Praděd */}
        <p className="text-muted mb-4 small">
          Predstavte si, že opakovane meriame nadmorskú výšku hory Praděd
          pomocou GPS prístroja. Skutočná výška (<InlineMath math="\mu" />) je{" "}
          <strong>1492 m</strong>, pričom prístroj má danú presnosť, ktorá
          predstavuje smerodajnú odchýlku populácie (
          <InlineMath math="\sigma = 5" /> m). V simulácii nižšie môžete
          sledovať, ako sa pri rôznej veľkosti výberu (<InlineMath math="n" />{" "}
          meraní) správa bodový odhad strednej hodnoty (
          <InlineMath math="\bar{x}" />) a výberovej smerodajnej odchýlky (
          <InlineMath math="s" />
          ). Pridávaním ďalších výberov zistíte, ako jednotlivé odhady kolíšu
          okolo skutočnej hodnoty.
        </p>

        <PointEstimationSimulation />
      </div>

      <h4 className="mt-5 mb-3">
        {t("parameterEstimation.pointEstimation.realDataTitle")}
      </h4>
      <p>
        <Trans
          i18nKey="parameterEstimation.pointEstimation.realDataP1"
          components={{ bold: <strong /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey="parameterEstimation.pointEstimation.realDataP2"
          components={{
            bold: <strong />,
            mu: <InlineMath math="\mu = 46{,}22" />,
            sigma: <InlineMath math="\sigma = 3{,}76" />,
          }}
        />
      </p>

      <RealDataSampling />
    </section>
  );
}

export default PointEstimation;
