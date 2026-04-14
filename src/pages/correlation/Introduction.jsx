// src/pages/correlation/Introduction.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";

function Introduction() {
  const { t } = useTranslation();

  return (
    <section id="introduction" className="mb-5">
      <p className="fst-italic lead">
        <Trans
          i18nKey="correlation.introduction.p1"
          components={{ bold: <strong /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey="correlation.introduction.p2"
          components={{
            bold: <strong />,
            m: <InlineMath math="m = \rho \cdot V" />,
          }}
        />
      </p>

      <div className="mx-auto w-100 mb-5 mt-5" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <h6 className="card-subtitle mb-3 text-muted">
            {t("correlation.introduction.tableTitle")}
          </h6>
          <p className="card-text mb-4 text-muted small">
            {t("correlation.introduction.tableDesc")}
          </p>
          <div className="table-responsive pb-2">
            <table className="table text-center align-middle mb-0">
              <colgroup>
                <col style={{ width: "3rem" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "35%" }} />
                <col style={{ width: "35%" }} />
              </colgroup>

              <tbody>
                <tr>
                  <td
                    colSpan="2"
                    rowSpan="2"
                    style={{ border: "none", backgroundColor: "transparent" }}
                  ></td>
                  <th
                    colSpan="2"
                    className="table-active border fw-bold text-muted text-uppercase small"
                  >
                    {t("correlation.introduction.typeY")}
                  </th>
                </tr>
                <tr>
                  <th className="table-active border fw-normal">
                    {t("correlation.introduction.categorical")}
                  </th>
                  <th className="table-active border fw-normal">
                    {t("correlation.introduction.quantitative")}
                  </th>
                </tr>
                <tr>
                  <th
                    rowSpan="2"
                    className="table-active border align-middle py-4"
                  >
                    <div
                      className="fw-bold text-muted text-uppercase small mx-auto"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t("correlation.introduction.typeX")}
                    </div>
                  </th>
                  <th className="text-start table-active border fw-normal px-3">
                    {t("correlation.introduction.categorical")}
                  </th>
                  <td className="border px-3">
                    {t("correlation.introduction.contingency")}
                  </td>
                  <td className="border px-3">
                    {t("correlation.introduction.anova")}
                  </td>
                </tr>
                <tr>
                  <th className="text-start table-active border fw-normal px-3">
                    {t("correlation.introduction.quantitative")}
                  </th>
                  <td className="border px-3">
                    {t("correlation.introduction.anova")}
                  </td>
                  <td className="text-primary fw-bold border px-3">
                    {t("correlation.introduction.corr_regr")}
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
