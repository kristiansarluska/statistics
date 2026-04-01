// src/pages/correlation/CorrelationAnalysis.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath, BlockMath } from "react-katex";

function CorrelationAnalysis() {
  const { t } = useTranslation();

  return (
    <section id="analysis" className="mb-5">
      <h2 className="mb-4">{t("correlation.analysis.title")}</h2>
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

      {/* Causality Alert matching IntervalEstimation style */}
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

      <div className="mb-4">
        <h4>{t("correlation.analysis.testingTitle")}</h4>
        <p>
          <Trans
            i18nKey="correlation.analysis.testingDesc"
            components={{ m1: <InlineMath math="r_{xy} = 0{,}15" /> }}
          />
        </p>
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
                Testové kritérium (T) sa následne riadi Studentovým
                t-rozdelením:
              </p>
              <div className="text-center overflow-auto">
                <BlockMath math="T = \frac{r_{xy} \cdot \sqrt{n-2}}{\sqrt{1 - r_{xy}^2}} \sim t_{n-2}" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for Interactive Simulator */}
      <div className="card bg-light border-0 shadow-sm p-5 text-center mt-4 border-start border-end border-5 border-secondary">
        <h5 className="text-muted">
          {t("correlation.analysis.simulatorPlaceholder")}
        </h5>
        <p className="text-muted small mb-0">
          {t("correlation.analysis.simulatorDesc")}
        </p>
      </div>
    </section>
  );
}

export default CorrelationAnalysis;
