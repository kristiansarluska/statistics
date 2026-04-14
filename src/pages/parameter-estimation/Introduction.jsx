// src/pages/parameterEstimation/Introduction.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function Introduction() {
  const { t } = useTranslation();

  return (
    <section className="mb-5">
      {/* 1. Zvýraznený prvý odstavec */}
      <p className="fst-italic lead">{t("parameterEstimation.intro.p1")}</p>

      {/* 2. Druhý bežný odstavec */}
      <p>
        <Trans
          i18nKey="parameterEstimation.intro.p2"
          components={{
            bold: <strong />,
          }}
        />
      </p>

      {/* 3. Cards: Populácia vs. Vzorka */}
      <div className="row mt-4 mb-4 g-4">
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

      {/* 4. Bežný prepojovací odstavec pred tabuľkou */}
      <p>{t("parameterEstimation.intro.p3")}</p>

      {/* 5. Tabuľka porovnania znakov */}
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
                    {t("parameterEstimation.intro.table.row1_stat")}
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
                    {t("parameterEstimation.intro.table.row2_stat")}
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
                    {t("parameterEstimation.intro.table.row3_stat")}
                  </th>
                  <td>
                    <InlineMath math="n" />
                  </td>
                  <th className="text-start fw-normal border-start">
                    {t("parameterEstimation.intro.table.row3_param")}
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

      {/* 6. Záverečný odstavec prepájajúci teóriu s bodovým odhadom */}
      <p>{t("parameterEstimation.intro.p4")}</p>
    </section>
  );
}

export default Introduction;
