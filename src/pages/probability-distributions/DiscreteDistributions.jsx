// src/pages/probabilityDistributions/DiscreteDistributions.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { BlockMath, InlineMath } from "react-katex";
import BernoulliChart from "../../components/charts/probability-distributions/discrete/BernoulliChart";
import UniformDiscreteChart from "../../components/charts/probability-distributions/discrete/UniformDiscreteChart";
import BinomialChart from "../../components/charts/probability-distributions/discrete/BinomialChart";
import PoissonChart from "../../components/charts/probability-distributions/discrete/PoissonChart";

function DiscreteDistributions() {
  const { t } = useTranslation();

  return (
    <section id="discrete-distributions" className="mb-5">
      <h2 className="mb-4 fw-bold">
        {t("probabilityDistributions.discrete.title")}
      </h2>
      <p className="mb-5">
        {t("probabilityDistributions.discrete.description")}
      </p>

      {/* BERNOULLI */}
      <h3 id="bernoulli" className="mb-3">
        {t("probabilityDistributions.discrete.bernoulli.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.discrete.bernoulli.description"
          components={{
            m1: <InlineMath math="\Omega = \{0, 1\}" />,
            m2: <InlineMath math="p" />,
            m3: <InlineMath math="p \in \langle 0, 1 \rangle" />,
            m4: <InlineMath math="P(X=1) = p" />,
            m5: <InlineMath math="P(X=0) = 1 - p" />,
          }}
        />
      </p>

      <div className="overflow-x-automb-4">
        <BlockMath
          math={`p(x) = P(X=x) = \\begin{cases} 1-p & \\text x = 0 \\\\ p & \\text x = 1 \\\\ 0 & \\text{${t("probabilityDistributions.discrete.bernoulli.otherwise")}} \\end{cases}`}
        />
        <BlockMath
          math={`F(x) = \\begin{cases} 0 & \\text x < 0 \\\\ 1-p & \\text 0 \\le x < 1 \\\\ 1 & \\text x \\ge 1 \\end{cases}`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.discrete.bernoulli.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.discrete.bernoulli.exampleDesc"
            components={{
              bold: <strong />,
              m: <InlineMath math="p" />,
            }}
          />
        </p>
        <BernoulliChart />
      </div>

      {/* UNIFORM DISCRETE */}
      <h3 id="uniform-discrete" className="mb-3">
        {t("probabilityDistributions.discrete.uniform.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.discrete.uniform.description"
          components={{
            m1: <InlineMath math="n" />,
            m2: <InlineMath math="P(X=x) = \frac{1}{n}" />,
          }}
        />
      </p>

      <div className="overflow-x-auto mb-4">
        <BlockMath
          math={`p(x_i) = p(x) = \\frac{1}{n} \\quad \\text x \\in \\{1, 2, \\dots, n\\}`}
        />
        <BlockMath
          math={`F(x) = \\frac{\\lfloor x \\rfloor}{n} \\quad \\text 1 \\le x \\le n`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.discrete.uniform.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.discrete.uniform.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="n" />,
              m2: <InlineMath math="n" />,
              m3: <InlineMath math="n=5" />,
              m4: <InlineMath math="n=7" />,
            }}
          />
        </p>
        <UniformDiscreteChart />
      </div>

      {/* BINOMIAL */}
      <h3 id="binomial" className="mb-3">
        {t("probabilityDistributions.discrete.binomial.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.discrete.binomial.description"
          components={{
            m1: <InlineMath math="n" />,
            m2: <InlineMath math="p" />,
            m3: <InlineMath math="n" />,
          }}
        />
      </p>

      <div
        className="overflow-x-auto
      mb-4"
      >
        <BlockMath
          math={`P(X=x) = \\binom{n}{x} p^x (1-p)^{n-x} \\quad \\text x \\in \\{0, 1, \\dots, n\\}`}
        />
        <BlockMath
          math={`F(x) = \\sum_{i=0}^{\\lfloor x \\rfloor} \\binom{n}{i} p^i (1-p)^{n-i}`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.discrete.binomial.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.discrete.binomial.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="p" />,
              m2: <InlineMath math="n" />,
              m3: <InlineMath math="p = 0,9" />,
              m4: <InlineMath math="n" />,
            }}
          />
        </p>
        <BinomialChart />
      </div>

      {/* POISSON */}
      <h3 id="poisson" className="mb-3">
        {t("probabilityDistributions.discrete.poisson.title")}
      </h3>
      <p className="mb-4">
        <Trans
          i18nKey="probabilityDistributions.discrete.poisson.description"
          components={{
            m1: <InlineMath math="\lambda" />,
          }}
        />
      </p>

      <div className="overflow-x-auto mb-4">
        <BlockMath
          math={`P(X=x) = \\frac{\\lambda^x}{x!} e^{-\\lambda} \\quad \\text x \\in \\{0, 1, 2, \\dots\\}`}
        />
        <BlockMath
          math={`F(x) = e^{-\\lambda} \\sum_{i=0}^{\\lfloor x \\rfloor} \\frac{\\lambda^i}{i!}`}
        />
      </div>

      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">
          {t("probabilityDistributions.discrete.poisson.exampleTitle")}
        </h5>
        <p className="text-muted mb-4 small">
          <Trans
            i18nKey="probabilityDistributions.discrete.poisson.exampleDesc"
            components={{
              bold: <strong />,
              m1: <InlineMath math="\lambda" />,
              m2: <InlineMath math="\lambda" />,
            }}
          />
        </p>
        <PoissonChart />
      </div>
    </section>
  );
}

export default DiscreteDistributions;
