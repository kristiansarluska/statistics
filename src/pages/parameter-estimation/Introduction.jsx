// src/pages/parameterEstimation/Introduction.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

/**
 * @component Introduction
 * @description Renders the introductory section of the Parameter Estimation chapter.
 * It establishes the conceptual framework of inferential statistics by:
 * - Differentiating between a Population (total set) and a Sample (subset).
 * - Defining the relationship between sample statistics (e.g., mean x̄, SD s)
 * and their corresponding population parameters (e.g., mean μ, SD σ).
 * - Providing a comparative table of notation used for populations versus samples.
 */
function Introduction() {
  const { t } = useTranslation();

  return (
    <section id="introduction" className="mb-5">
      {/* INTRODUCTION */}
      <p className="fst-italic lead">{t("parameterEstimation.intro.p1")}</p>

      <p>
        <Trans
          i18nKey="parameterEstimation.intro.p2"
          components={{
            bold: <strong />,
          }}
        />
      </p>

      <div className="row mt-4 mb-4 g-4">
        {/* POPULATION */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-primary border-opacity-50">
            <div className="card-body">
              <h5 className="card-title text-primary">
                {t("parameterEstimation.intro.populationTitle")}
              </h5>
              <p className="card-text">
                {t("parameterEstimation.intro.populationDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* SAMPLE */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-success border-opacity-50">
            <div className="card-body">
              <h5 className="card-title text-success">
                {t("parameterEstimation.intro.sampleTitle")}
              </h5>
              <p className="card-text">
                {t("parameterEstimation.intro.sampleDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p>{t("parameterEstimation.intro.p3")}</p>

      {/* TABLE */}
      <div className="mx-auto w-100 my-4" style={{ maxWidth: "1000px" }}>
        <div className="card-body">
          <h6 className="card-subtitle mb-3 text-muted">
            {t("parameterEstimation.intro.tableTitle")}
          </h6>

          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle mb-0">
              <thead className="table-active">
                <tr>
                  <th colSpan="2" style={{ width: "50%" }}>
                    {t("parameterEstimation.intro.table.col1")}
                  </th>
                  <th colSpan="2" style={{ width: "50%" }}>
                    {t("parameterEstimation.intro.table.col2")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="text-start fw-normal">
                    <Link to="/random-variable#arithmetic-mean">
                      {t("parameterEstimation.intro.table.row1_stat")}
                    </Link>
                  </th>
                  <td style={{ width: "10%" }}>
                    <InlineMath math="\bar{x}" />
                  </td>
                  <th className="text-start fw-normal border-start">
                    {t("parameterEstimation.intro.table.row1_param")}
                  </th>
                  <td style={{ width: "10%" }}>
                    <InlineMath math="\mu" />
                  </td>
                </tr>
                <tr>
                  <th className="text-start fw-normal">
                    <Link to="/random-variable#standard-deviation">
                      {t("parameterEstimation.intro.table.row2_stat")}
                    </Link>
                  </th>
                  <td>
                    <InlineMath math="s" />
                  </td>
                  <th className="text-start fw-normal border-start">
                    {t("parameterEstimation.intro.table.row2_param")}
                  </th>
                  <td>
                    <InlineMath math="\sigma" />
                  </td>
                </tr>
                <tr>
                  <th className="text-start fw-normal">
                    <Link to="/random-variable#variance">
                      {t("parameterEstimation.intro.table.row3_stat")}
                    </Link>
                  </th>
                  <td>
                    <InlineMath math="s^2" />
                  </td>
                  <th className="text-start fw-normal border-start">
                    {t("parameterEstimation.intro.table.row3_param")}
                  </th>
                  <td>
                    <InlineMath math="\sigma^2" />
                  </td>
                </tr>
                <tr>
                  <th className="text-start fw-normal">
                    {t("parameterEstimation.intro.table.row4_stat")}
                  </th>
                  <td>
                    <InlineMath math="n" />
                  </td>
                  <th className="text-start fw-normal border-start">
                    {t("parameterEstimation.intro.table.row4_param")}
                  </th>
                  <td>
                    <InlineMath math="N" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Introduction;
