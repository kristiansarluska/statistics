// src/pages/probabilityDistributions/ContinuousDistributions.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { BlockMath, InlineMath } from "react-katex";
import UniformContinuousChart from "../../components/charts/probability-distributions/continuous/UniformContinuousChart";
import ExponentialChart from "../../components/charts/probability-distributions/continuous/ExponentialChart";
import NormalChart from "../../components/charts/probability-distributions/continuous/NormalChart";
import ChiSquareChart from "../../components/charts/probability-distributions/continuous/ChiSquareChart";
import StudentTChart from "../../components/charts/probability-distributions/continuous/StudentTChart";
import FisherFChart from "../../components/charts/probability-distributions/continuous/FisherFChart";

function ContinuousDistributions() {
  const { t } = useTranslation();

  return (
    <section id="continuous-distributions">
      <h2 className="mb-4">{t("probabilityDistributions.continuous.title")}</h2>
      <p className="mb-5">
        <Trans
          i18nKey="probabilityDistributions.continuous.description"
          components={{ m: <InlineMath math="x = 2.0000" /> }}
        />
      </p>

      {/* ROVNOMERNÉ SPOJITÉ ROZDELENIE */}
      <h3 id="uniform-continuous" className="mb-3 mt-5">
        {t("probabilityDistributions.continuous.uniform.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.continuous.uniform.description"
          components={{ m: <InlineMath math="[a, b]" /> }}
        />
      </p>

      <div className="overflow-x-auto mb-4">
        <BlockMath
          math={`f(x) = \\begin{cases} \\frac{1}{b-a} & x \\in \\langle a, b \\rangle \\\\ 0 & x \\notin \\langle a, b \\rangle \\end{cases}`}
        />
        <BlockMath
          math={`F(x) = \\begin{cases} 0 & x \\in (-\\infty, a) \\\\ \\frac{x-a}{b-a} & x \\in \\langle a, b ) \\\\ 1 & x \\in \\langle b, \\infty) \\end{cases}`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.continuous.uniform.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.continuous.uniform.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="a" />,
              m2: <InlineMath math="b" />,
            }}
          />
        </p>
        <UniformContinuousChart />
      </div>

      {/* EXPONENCIÁLNE ROZDELENIE */}
      <h3 id="exponential" className="mb-3 mt-5">
        {t("probabilityDistributions.continuous.exponential.title")}
      </h3>
      <p className="mb-4">
        {t("probabilityDistributions.continuous.exponential.description")}
      </p>

      <div className="overflow-x-auto mb-4">
        <BlockMath
          math={`f(x) = \\begin{cases} \\lambda e^{-\\lambda x} & x \\ge 0 \\\\ 0 & x < 0 \\end{cases}`}
        />
        <BlockMath
          math={`F(x) = \\begin{cases} 1 - e^{-\\lambda x} & x \\ge 0 \\\\ 0 & x < 0 \\end{cases}`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.continuous.exponential.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.continuous.exponential.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="\lambda" />,
            }}
          />
        </p>
        <ExponentialChart />
      </div>

      {/* NORMÁLNE ROZDELENIE */}
      <h3 id="normal" className="mb-3 mt-5">
        {t("probabilityDistributions.continuous.normal.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.continuous.normal.description"
          components={{
            m1: <InlineMath math="\mu" />,
            m2: <InlineMath math="\sigma" />,
          }}
        />
      </p>

      <div className="overflow-x-auto mb-4">
        <BlockMath
          math={`f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\cdot e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}`}
        />
        <BlockMath
          math={`F(x) = \\int_{-\\infty}^{x} \\frac{1}{\\sigma \\sqrt{2\\pi}} \\cdot e^{-\\frac{(t-\\mu)^2}{2\\sigma^2}} \\, dt`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.continuous.normal.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.continuous.normal.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="\mu" />,
              m2: <InlineMath math="\sigma" />,
              m3: <InlineMath math="\sigma" />,
            }}
          />
        </p>
        <NormalChart />
      </div>

      {/* CHÍ-KVADRÁT ROZDELENIE */}
      <h3 id="chi-square" className="mb-3 mt-5">
        {t("probabilityDistributions.continuous.chiSquare.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.continuous.chiSquare.description"
          components={{
            m1: <InlineMath math="\chi^2" />,
            m2: <InlineMath math="\nu" />,
            m3: <InlineMath math="\nu = n-1" />,
          }}
        />
      </p>

      <div className="overflow-x-auto mb-4">
        <BlockMath
          math={`f(x) = \\begin{cases} \\frac{1}{\\Gamma\\left(\\frac{\\nu}{2}\\right) 2^{\\frac{\\nu}{2}}} x^{\\frac{\\nu}{2}-1} e^{-\\frac{x}{2}} & x > 0 \\\\ 0 & x \\le 0 \\end{cases}`}
        />
        <BlockMath math={`F(x) = \\int_{0}^{x} f(t) \\, dt`} />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.continuous.chiSquare.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.continuous.chiSquare.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="\chi^2" />,
              m2: <InlineMath math="n-1" />,
              m3: <InlineMath math="\nu" />,
            }}
          />
        </p>
        <ChiSquareChart />
      </div>

      {/* STUDENTOVO T-ROZDELENIE */}
      <h3 id="student-t" className="mb-3 mt-5">
        {t("probabilityDistributions.continuous.studentT.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.continuous.studentT.description"
          components={{ m1: <InlineMath math="n" /> }}
        />
      </p>

      <div className="overflow-x-auto mb-4">
        <BlockMath
          math={`f(x) = \\frac{1}{\\sqrt{n\\pi}} \\cdot \\frac{\\Gamma\\left(\\frac{n+1}{2}\\right)}{\\Gamma\\left(\\frac{n}{2}\\right)} \\cdot \\left(1 + \\frac{x^2}{n}\\right)^{-\\frac{n+1}{2}}`}
        />
        <BlockMath math={`F(x) = \\int_{-\\infty}^{x} f(t) \\, dt`} />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.continuous.studentT.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.continuous.studentT.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="n" />,
            }}
          />
        </p>
        <StudentTChart />
      </div>

      {/* FISHEROVO F-ROZDELENIE */}
      <h3 id="fisher-f" className="mb-3 mt-5">
        {t("probabilityDistributions.continuous.fisherF.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.continuous.fisherF.description"
          components={{
            m1: <InlineMath math="v_1" />,
            m2: <InlineMath math="v_2" />,
          }}
        />
      </p>

      <div className="overflow-x-auto mb-4">
        <BlockMath
          math={`f(x) = \\begin{cases} \\frac{1}{\\mathrm{B}\\left(\\frac{v_1}{2}, \\frac{v_2}{2}\\right)} \\left(\\frac{v_1}{v_2}\\right)^{\\frac{v_1}{2}} x^{\\frac{v_1}{2}-1} \\left(1 + \\frac{v_1}{v_2}x\\right)^{-\\frac{v_1+v_2}{2}} & x > 0 \\\\ 0 & x \\le 0 \\end{cases}`}
        />
        <BlockMath math={`F(x) = \\int_{0}^{x} f(t) \\, dt`} />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.continuous.fisherF.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.continuous.fisherF.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="PM_{10}" />,
              m2: <InlineMath math="v_1" />,
              m3: <InlineMath math="v_2" />,
            }}
          />
        </p>
        <FisherFChart />
      </div>
    </section>
  );
}

export default ContinuousDistributions;
