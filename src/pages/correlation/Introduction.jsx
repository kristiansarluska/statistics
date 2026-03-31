// src/pages/correlation/Introduction.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";

function Introduction() {
  const { t } = useTranslation();

  return (
    <section id="introduction" className="mb-5">
      <h2 className="mb-4">{t("correlation.introduction.title")}</h2>
      <p>
        <Trans
          i18nKey="correlation.introduction.p1"
          components={{
            bold: <strong />,
            m: <InlineMath math="m = \rho \cdot V" />,
          }}
        />
      </p>
      <p>
        <Trans
          i18nKey="correlation.introduction.p2"
          components={{ bold: <strong /> }}
        />
      </p>

      {/* Dependency table matching GeneralProcedure style */}
      <div className="mx-auto w-100 mb-5 mt-5" style={{ maxWidth: "800px" }}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="card-subtitle mb-3 text-muted">
              {t("correlation.introduction.tableTitle")}
            </h6>
            <p className="card-text mb-4 text-muted small">
              {t("correlation.introduction.tableDesc")}
            </p>
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle mb-0">
                <thead className="table-active">
                  <tr>
                    <th
                      scope="col"
                      rowSpan="2"
                      className="align-middle border-0 bg-transparent"
                    ></th>
                    <th scope="col" colSpan="2" className="align-middle">
                      {t("correlation.introduction.typeY")}
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" style={{ width: "35%" }}>
                      {t("correlation.introduction.categorical")}
                    </th>
                    <th scope="col" style={{ width: "35%" }}>
                      {t("correlation.introduction.quantitative")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th
                      scope="row"
                      className="text-start table-active text-wrap fw-normal"
                    >
                      <strong className="d-block mb-1 text-muted small text-uppercase">
                        {t("correlation.introduction.typeX")}
                      </strong>
                      {t("correlation.introduction.categorical")}
                    </th>
                    <td>{t("correlation.introduction.contingency")}</td>
                    <td>{t("correlation.introduction.anova")}</td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="text-start table-active text-wrap fw-normal"
                    >
                      <strong className="d-block mb-1 text-muted small text-uppercase">
                        {t("correlation.introduction.typeX")}
                      </strong>
                      {t("correlation.introduction.quantitative")}
                    </th>
                    <td>{t("correlation.introduction.anova")}</td>
                    <td className="table-primary fw-bold">
                      {t("correlation.introduction.corr_regr")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Introduction;
