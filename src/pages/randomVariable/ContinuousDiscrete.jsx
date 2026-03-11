// src/pages/randomVariable/ContinuousDiscrete.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";

const ContinuousDiscrete = () => {
  const { t } = useTranslation();

  return (
    <section id="continuous-discrete" className="mb-5">
      <h2 className="mb-3">{t("randomVariable.continuousDiscrete.title")}</h2>
      <p>{t("randomVariable.continuousDiscrete.description")}</p>

      <div className="row mt-4">
        {/* Discrete Card */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm">
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

        {/* Continuous Card */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 shadow-sm">
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
};

export default ContinuousDiscrete;
