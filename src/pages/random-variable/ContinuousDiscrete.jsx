// src/pages/randomVariable/ContinuousDiscrete.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";

/**
 * @component ContinuousDiscrete
 * @description Renders a comparative section that defines and distinguishes between
 * Discrete and Continuous random variables.
 * - Discrete: Variables with countable values, often resulting from a counting process.
 * - Continuous: Variables that can take any value within an interval, typically resulting
 * from a measurement process (e.g., coordinates, altitude, area).
 * The component uses a card-based layout to contrast their definitions, processes,
 * and practical examples relevant to statistical analysis.
 */
function ContinuousDiscrete() {
  const { t } = useTranslation();

  return (
    <section id="continuous-discrete" className="mb-5">
      <h2 className="mb-3 fw-bold">
        {t("randomVariable.continuousDiscrete.title")}
      </h2>
      <p>{t("randomVariable.continuousDiscrete.description")}</p>

      <div className="row mt-4">
        {/* DISCRETE CARD */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">
                {t("randomVariable.continuousDiscrete.discrete.title")}
              </h5>
              <p className="card-text">
                <Trans
                  i18nKey="randomVariable.continuousDiscrete.discrete.description"
                  components={{ bold: <strong /> }}
                />
              </p>
              <ul className="mb-0 text-muted small">
                <li>
                  <strong>
                    {t("randomVariable.continuousDiscrete.discrete.process")}
                  </strong>{" "}
                  {t("randomVariable.continuousDiscrete.discrete.processDesc")}
                </li>
                <li>
                  <strong>
                    {t("randomVariable.continuousDiscrete.discrete.examples")}
                  </strong>{" "}
                  {t("randomVariable.continuousDiscrete.discrete.examplesDesc")}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CONTINUOUS CARD */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("randomVariable.continuousDiscrete.continuous.title")}
              </h5>
              <p className="card-text">
                <Trans
                  i18nKey="randomVariable.continuousDiscrete.continuous.description"
                  components={{ bold: <strong /> }}
                />
              </p>
              <ul className="mb-0 text-muted small">
                <li>
                  <strong>
                    {t("randomVariable.continuousDiscrete.continuous.process")}
                  </strong>{" "}
                  {t(
                    "randomVariable.continuousDiscrete.continuous.processDesc",
                  )}
                </li>
                <li>
                  <strong>
                    {t("randomVariable.continuousDiscrete.continuous.examples")}
                  </strong>{" "}
                  {t(
                    "randomVariable.continuousDiscrete.continuous.examplesDesc",
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContinuousDiscrete;
