// src/pages/hypothesisTesting/Introduction.jsx
import React from "react";
import { InlineMath } from "react-katex";
import { useTranslation, Trans } from "react-i18next";

/**
 * @component Introduction
 * @description Renders the introductory section of the Hypothesis Testing chapter.
 * It defines the fundamental logic of statistical inference, focusing on the
 * essential distinction between the Null Hypothesis (H0), which typically assumes
 * no effect or status quo, and the Alternative Hypothesis (HA), which represents
 * the research claim to be supported by evidence.
 */
function Introduction() {
  const { t } = useTranslation();

  return (
    <section id="introduction" className="mb-5">
      <p className="fst-italic lead">
        {t("hypothesisTesting.introduction.leadText")}
      </p>

      {/* NULL AND ALTERNATIVE HYPOTHESIS */}
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
