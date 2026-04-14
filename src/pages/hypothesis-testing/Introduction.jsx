// src/pages/hypothesisTesting/Introduction.jsx
import React from "react";
import { InlineMath } from "react-katex";
import { useTranslation, Trans } from "react-i18next";

function Introduction() {
  const { t } = useTranslation();

  return (
    <section id="introduction" className="mb-5">
      <p className="fst-italic lead">
        {t("hypothesisTesting.introduction.leadText")}
      </p>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">
            {t("hypothesisTesting.introduction.basicHypothesesTitle")}
          </h5>
          <ul className="mb-0">
            <li>
              <Trans
                i18nKey="hypothesisTesting.introduction.nullHypothesis"
                components={{
                  bold: <strong />,
                  h0: <InlineMath math="H_0" />,
                }}
              />
            </li>
            <li className="mt-2">
              <Trans
                i18nKey="hypothesisTesting.introduction.alternativeHypothesis"
                components={{
                  bold: <strong />,
                  ha: <InlineMath math="H_A" />,
                  h0: <InlineMath math="H_0" />,
                }}
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Introduction;
