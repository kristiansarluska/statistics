// src/pages/randomVariable/Distribution.jsx
import React from "react";
import { InlineMath } from "react-katex";
import { useTranslation, Trans } from "react-i18next";
import DiscreteDistributionChart from "../../components/charts/random-variable/distribution/DiscreteDistributionChart";
import SimulatedPMFChart from "../../components/charts/random-variable/distribution/SimulatedPMFChart";
import SimulatedPDFChart from "../../components/charts/random-variable/distribution/SimulatedPDFChart";
import QuantileFunctionSlider from "../../components/charts/random-variable/distribution/QuantileFunctionSlider";
import QuantileFunctionInput from "../../components/charts/random-variable/distribution/QuantileFunctionInput";
import NormalChart from "../../components/charts/probability-distributions/continuous/NormalChart";

/**
 * @component Distribution
 * @description Renders the core section focused on the mathematical description of
 * random variable distributions. It covers:
 * 1. Probability Mass Function (PMF) and Probability Density Function (PDF):
 * Explains how likelihood is assigned to specific values or intervals, featuring
 * interactive simulations of the Law of Large Numbers.
 * 2. Cumulative Distribution Function (CDF): Demonstrates the probability that
 * a variable is less than or equal to a value, with discrete and continuous simulations.
 * 3. Quantile Function: Explains the inverse relationship to the CDF, allowing users
 * to interactively find values (quantiles) corresponding to specific probabilities.
 */
function Distribution() {
  const { t } = useTranslation();

  return (
    <section id="distribution" className="mb-5">
      {/* INTRODUCTION */}
      <h2 className="mb-4 fw-bold">{t("randomVariable.distribution.title")}</h2>
      <p className="mb-5">{t("randomVariable.distribution.description")}</p>

      {/* PMF AND PDF */}
      <div id="pmf-pdf" className="mb-5">
        <h3 className="mb-3">
          {t("randomVariable.distribution.pmfPdf.title")}
        </h3>
        <p className="mb-3">
          <Trans
            i18nKey="randomVariable.distribution.pmfPdf.desc1"
            components={{
              bold: <strong />,
              m1: <InlineMath math="P(X=x)" />,
              br: <br />,
              m2: <InlineMath math="f(x)" />,
            }}
          />
        </p>

        {/* LAW OF LARGE NUMBERS */}
        <div className="alert alert-info border-info-subtle shadow-sm mb-5">
          <h5 className="alert-heading fs-6 fw-bold">
            {t("randomVariable.distribution.pmfPdf.alertTitle")}
          </h5>
          <p className="mb-0 text-muted small">
            <Trans
              i18nKey="randomVariable.distribution.pmfPdf.alertDesc"
              components={{ bold: <strong /> }}
            />
          </p>
        </div>

        {/* SIMULATED PMF */}
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            <Trans
              i18nKey="randomVariable.distribution.pmfPdf.chart1Title"
              components={{ color: <span className="text-primary" /> }}
            />
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.distribution.pmfPdf.chart1Desc"
              components={{ bold: <strong /> }}
            />
          </p>
          <SimulatedPMFChart />
        </div>

        {/* SIMULATED PDF */}
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            <Trans
              i18nKey="randomVariable.distribution.pmfPdf.chart2Title"
              components={{ color: <span className="text-primary" /> }}
            />
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.distribution.pmfPdf.chart2Desc"
              components={{ bold: <strong /> }}
            />
          </p>
          <SimulatedPDFChart />
        </div>
      </div>

      {/* CUMULATIVE DISTRIBUTION FUNCTION */}
      <div id="cdf" className="mb-5">
        <h3 className="mb-3">{t("randomVariable.distribution.cdf.title")}</h3>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.distribution.cdf.desc"
            components={{
              m1: <InlineMath math="F(x)" />,
              m2: <InlineMath math="x" />,
              m3: <InlineMath math="F(x) = P(X \le x)" />,
            }}
          />
        </p>

        {/* DISCRETE CDF SIMULATION*/}
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            <Trans
              i18nKey="randomVariable.distribution.cdf.chart1Title"
              components={{ color: <span className="text-primary" /> }}
            />
          </h5>
          <div className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.distribution.cdf.chart1Desc"
              components={{
                bold: <strong />,
                color: <span className="text-primary fw-bold" />,
                br: <br />,
                ul: <ul />,
                li: <li />,
              }}
            />
          </div>
          <DiscreteDistributionChart />
        </div>

        {/* CONTINUOUS CDF SIMULATION */}
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            <Trans
              i18nKey="randomVariable.distribution.cdf.chart2Title"
              components={{ color: <span className="text-primary" /> }}
            />
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.distribution.cdf.chart2Desc"
              components={{
                bold: <strong />,
                br: <br />,
              }}
            />
          </p>
          <NormalChart />
        </div>
      </div>

      {/* QUANTILE FUNCTION */}
      <div id="quantile" className="mb-5">
        <h3 className="mb-3">
          {t("randomVariable.distribution.quantile.title")}
        </h3>
        <p className="mb-4">
          <Trans
            i18nKey="randomVariable.distribution.quantile.desc"
            components={{
              m1: <InlineMath math="x" />,
              m2: <InlineMath math="x_p" />,
              m3: <InlineMath math="p" />,
              bold: <strong />,
              italic: <i />,
              m4: <InlineMath math="p = 0,5" />,
            }}
          />
        </p>

        {/* QUANTILE FUNCTION SLIDER SIMULATION */}
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            <Trans
              i18nKey="randomVariable.distribution.quantile.chart1Title"
              components={{ color: <span className="text-primary" /> }}
            />
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.distribution.quantile.chart1Desc"
              components={{
                bold: <strong />,
                m1: <InlineMath math="p" />,
                m2: <InlineMath math="x_p" />,
                br: <br />,
              }}
            />
          </p>
          <QuantileFunctionSlider />
        </div>

        {/* QUANTILE FUNCTION INPUT SIMULATION */}
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <h5 className="mb-3">
            <Trans
              i18nKey="randomVariable.distribution.quantile.chart2Title"
              components={{ color: <span className="text-primary" /> }}
            />
          </h5>
          <p className="text-muted mb-4 small">
            <Trans
              i18nKey="randomVariable.distribution.quantile.chart2Desc"
              components={{ bold: <strong /> }}
            />
          </p>
          <QuantileFunctionInput />
        </div>
      </div>
    </section>
  );
}

export default Distribution;
