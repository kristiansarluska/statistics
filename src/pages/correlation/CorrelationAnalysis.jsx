// src/pages/correlation/CorrelationAnalysis.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";
import CorrelationChart from "../../components/charts/correlation/CorrelationChart";

/**
 * @component CorrelationAnalysis
 * @description Renders a comprehensive theoretical and interactive section on correlation analysis.
 * It explains the interpretation of the correlation coefficient, differentiates between
 * positive and negative relationships, and provides a crucial warning about correlation
 * vs. causality. The component includes an interactive scatter plot simulator (CorrelationChart)
 * and details the statistical procedure for testing the significance of the correlation coefficient.
 */
function CorrelationAnalysis() {
  const { t } = useTranslation();

  return (
    <section id="analysis" className="mb-5">
      {/* INTRODUCTION */}
      <h2 className="mb-4 fw-bold">{t("correlation.analysis.title")}</h2>
      <p className="mb-4">
        <Trans
          i18nKey="correlation.analysis.p1"
          components={{
            bold: <strong />,
            m: <InlineMath math="\langle -1, 1 \rangle" />,
          }}
        />
      </p>

      <div className="row mb-4">
        {/* POSITIVE CORRELATION */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("correlation.analysis.positiveTitle")}
              </h5>
              <p className="card-text">
                <Trans
                  i18nKey="correlation.analysis.positiveDesc"
                  components={{ bold: <strong />, br: <br />, i: <i /> }}
                />
              </p>
              <p className="card-text text-muted small mt-3">
                <Trans
                  i18nKey="correlation.analysis.positiveExamples"
                  components={{ bold: <strong /> }}
                />
              </p>
            </div>
          </div>
        </div>

        {/* NEGATIVE CORRELATION */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm border-danger">
            <div className="card-body">
              <h5 className="card-title text-danger">
                {t("correlation.analysis.negativeTitle")}
              </h5>
              <p className="card-text">
                <Trans
                  i18nKey="correlation.analysis.negativeDesc"
                  components={{ bold: <strong />, br: <br />, i: <i /> }}
                />
              </p>
              <p className="card-text text-muted small mt-3">
                <Trans
                  i18nKey="correlation.analysis.negativeExamples"
                  components={{ bold: <strong /> }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CAUSALITY ALERT */}
      <div className="alert alert-info border-info-subtle shadow-sm mb-5">
        <h5 className="alert-heading fs-6 fw-bold">
          {t("correlation.analysis.alertCausalityTitle")}
        </h5>
        <p className="mb-0 small text-muted">
          <Trans
            i18nKey="correlation.analysis.alertCausalityDesc"
            components={{
              bold: <strong />,
              italic: <i />,
              br: <br />,
            }}
          />
        </p>
      </div>

      {/* PRACTICAL EXAMPLE */}
      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3">{t("correlation.simulator.exampleTitle")}</h5>
        <p className="text-muted mb-3 small">
          {t("correlation.simulator.exampleDesc")}
        </p>

        <ul className="mb-4">
          <li className="text-muted mb-2 small">
            <Trans
              i18nKey="correlation.simulator.examplePoints.positive"
              components={{ bold: <strong />, italic: <em /> }}
            />
          </li>
          <li className="text-muted mb-2 small">
            <Trans
              i18nKey="correlation.simulator.examplePoints.negative"
              components={{ bold: <strong />, italic: <em /> }}
            />
          </li>
          <li className="text-muted mb-2 small">
            <Trans
              i18nKey="correlation.simulator.examplePoints.zero"
              components={{ bold: <strong /> }}
            />
          </li>
        </ul>

        <CorrelationChart />
      </div>

      {/* SIGNIFICANCE TESTING */}
      <div className="mb-4">
        <h4>{t("correlation.analysis.testingTitle")}</h4>
        <p>
          <Trans
            i18nKey="correlation.analysis.testingDesc"
            components={{ m1: <InlineMath math="r_{xy} = 0{,}15" /> }}
          />
        </p>

        {/* HYPOTHESES AND FORMULA */}
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "900px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <ul className="mb-0">
                <li className="mb-2">
                  <Trans
                    i18nKey="correlation.analysis.testingH0"
                    components={{
                      bold: <strong />,
                      h0: <InlineMath math="H_0" />,
                      m: <InlineMath math="\rho_{xy} = 0" />,
                    }}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey="correlation.analysis.testingHa"
                    components={{
                      bold: <strong />,
                      ha: <InlineMath math="H_A" />,
                      m: <InlineMath math="\rho_{xy} \neq 0" />,
                    }}
                  />
                </li>
              </ul>
              <hr className="my-3" />
              <p className="text-muted small mb-2 text-center">
                {t("correlation.analysis.testingTStat")}
              </p>
              <div className="text-center overflow-auto">
                <BlockMath math="T = \frac{r_{xy} \cdot \sqrt{n-2}}{\sqrt{1 - r_{xy}^2}} \sim t_{n-2}" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHART REMINDER */}
      <div className="mx-auto w-100 mt-4">
        <div className="bg-body-tertiary border rounded-3 p-4 shadow-sm">
          <h6 className="mb-2">
            {t("correlation.analysis.testingExperimentTitle")}
          </h6>
          <p className="mb-0 small text-muted">
            <Trans
              i18nKey="correlation.analysis.testingExperimentDesc"
              components={{
                bold: <strong className="text-body" />,
                italic: <i />,
                textDanger: <strong className="text-danger" />,
                textSuccess: <strong className="text-success" />,
              }}
            />
          </p>
        </div>
      </div>
    </section>
  );
}

export default CorrelationAnalysis;
