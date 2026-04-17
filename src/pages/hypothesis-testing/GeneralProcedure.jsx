// src/pages/hypothesisTesting/GeneralProcedure.jsx
import React, { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import DataPreviewTable from "../../components/charts/helpers/DataPreviewTable";
import { useTranslation, Trans } from "react-i18next";

function GeneralProcedure() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/MS_kraj.json`,
        );
        if (!response.ok) throw new Error("Failed to load MS_kraj.json");
        const geojsonData = await response.json();

        const parsedData = geojsonData.features
          .filter((feature) => feature.properties.kod)
          .map((feature) => {
            const props = feature.properties;
            const pocet = props.Poc_obyv_SLDB_2021 || 0;
            const nad65 = props.poc_obyv_nad_65 || 0;
            const podil = pocet > 0 ? (nad65 / pocet) * 100 : null;

            return {
              kod: props.kod,
              nazev: props.nazev,
              okres: props.okres,
              Poc_obyv_SLDB_2021: pocet,
              poc_obyv_nad_65: nad65,
              podil_nad65: podil,
            };
          });

        setData(parsedData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(t("hypothesisTesting.generalProcedure.dataPreview.error"));
        setLoading(false);
      }
    };

    fetchGeoJSON();
  }, [t]);

  const tableColumns = [
    {
      key: "kod",
      label: t("hypothesisTesting.generalProcedure.dataPreview.columns.code"),
    },
    {
      key: "nazev",
      label: t("hypothesisTesting.generalProcedure.dataPreview.columns.name"),
    },
    {
      key: "okres",
      label: t(
        "hypothesisTesting.generalProcedure.dataPreview.columns.district",
      ),
    },
    {
      key: "Poc_obyv_SLDB_2021",
      label: t(
        "hypothesisTesting.generalProcedure.dataPreview.columns.population",
      ),
      render: (val) => val.toLocaleString("sk-SK"),
    },
    {
      key: "poc_obyv_nad_65",
      label: t("hypothesisTesting.generalProcedure.dataPreview.columns.pop65"),
      render: (val) => val.toLocaleString("sk-SK"),
    },
    {
      key: "podil_nad65",
      label: t(
        "hypothesisTesting.generalProcedure.dataPreview.columns.share65",
      ),
      render: (val) =>
        val != null
          ? val.toLocaleString("sk-SK", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "—",
    },
  ];

  return (
    <section id="procedure" className="mb-5">
      <h2 className="mb-4 fw-bold">
        {t("hypothesisTesting.generalProcedure.title")}
      </h2>
      <p>
        <Trans
          i18nKey="hypothesisTesting.generalProcedure.description"
          components={{
            1: (
              <a
                href="https://www.arcdata.cz/cs-cz/produkty/data/arccr"
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}
        />
      </p>
      {/* Data Preview Section */}
      <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h6 className="card-subtitle mb-3 text-muted">
              {t("hypothesisTesting.generalProcedure.dataPreview.subtitle")}
            </h6>
            <p className="card-text mb-3">
              <Trans
                i18nKey="hypothesisTesting.generalProcedure.dataPreview.description"
                components={{
                  c1: <code />,
                  c2: <code />,
                }}
              />
            </p>
            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : error ? (
              <div className="alert alert-danger mb-0">{error}</div>
            ) : (
              <DataPreviewTable
                data={data}
                columns={tableColumns}
                title={t(
                  "hypothesisTesting.generalProcedure.dataPreview.tableTitle",
                )}
                downloadUrl={`${import.meta.env.BASE_URL}data/MS_kraj.json`}
                downloadFilename="MS_kraj.json"
                downloadBtnLabel="Stiahnuť GeoJSON"
              />
            )}
          </div>
        </div>
      </div>

      {/* Step 1: Formulation */}
      <div className="mt-5">
        <h4>{t("hypothesisTesting.generalProcedure.step1.title")}</h4>
        <p>
          <Trans
            i18nKey="hypothesisTesting.generalProcedure.step1.description"
            components={{
              h0: <InlineMath math="H_0" />,
              ha: <InlineMath math="H_A" />,
            }}
          />
        </p>
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                {t("hypothesisTesting.generalProcedure.step1.appTitle")}
              </h6>
              <p className="card-text">
                {t("hypothesisTesting.generalProcedure.step1.appDesc")}
              </p>
              <ul>
                <li>
                  <Trans
                    i18nKey="hypothesisTesting.generalProcedure.step1.h0Item"
                    components={{
                      bold: <strong />,
                      m: <InlineMath math="H_0: \mu = 20{,}56" />,
                    }}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey="hypothesisTesting.generalProcedure.step1.haItem"
                    components={{
                      bold: <strong />,
                      m: <InlineMath math="H_A: \mu \neq 20{,}56" />,
                    }}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Significance Level */}
      <div className="mt-5">
        <h4>
          <Trans
            i18nKey="hypothesisTesting.generalProcedure.step2.title"
            components={{ alpha: <InlineMath math="\alpha" /> }}
          />
        </h4>
        <p>{t("hypothesisTesting.generalProcedure.step2.description")}</p>
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                {t("hypothesisTesting.generalProcedure.step2.appTitle")}
              </h6>
              <p className="card-text mb-0">
                <Trans
                  i18nKey="hypothesisTesting.generalProcedure.step2.appDesc"
                  components={{
                    bold: <strong />,
                    alpha: <InlineMath math="\alpha = 0{,}05" />,
                    h0: <InlineMath math="H_0" />,
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Test Statistic */}
      <div className="mt-5">
        <h4>{t("hypothesisTesting.generalProcedure.step3.title")}</h4>
        <p>{t("hypothesisTesting.generalProcedure.step3.description")}</p>
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                {t("hypothesisTesting.generalProcedure.step3.appTitle")}
              </h6>
              <p className="card-text">
                <Trans
                  i18nKey="hypothesisTesting.generalProcedure.step3.appDesc"
                  components={{ bold: <strong /> }}
                />
              </p>
              <div className="text-center overflow-auto py-3">
                <BlockMath math="t = \frac{\bar{x} - \mu_0}{\frac{s}{\sqrt{n}}}" />
              </div>
              <p className="card-text small text-muted mt-2 mb-0">
                <Trans
                  i18nKey="hypothesisTesting.generalProcedure.step3.formulaDesc"
                  components={{
                    xbar: <InlineMath math="\bar{x}" />,
                    mu0: <InlineMath math="\mu_0" />,
                    s: <InlineMath math="s" />,
                    n: <InlineMath math="n" />,
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Evaluation */}
      <div className="mt-5">
        <h4>{t("hypothesisTesting.generalProcedure.step4.title")}</h4>
        <p>
          <Trans
            i18nKey="hypothesisTesting.generalProcedure.step4.description"
            components={{
              bold: <strong />,
              h0: <InlineMath math="H_0" />,
              alpha: <InlineMath math="\alpha" />,
            }}
          />
        </p>
        <div className="mx-auto w-100 mb-5" style={{ maxWidth: "1000px" }}>
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                {t("hypothesisTesting.generalProcedure.step4.appTitle")}
              </h6>

              <div className="table-responsive mt-3">
                <table className="table table-bordered text-center align-middle mb-0">
                  <thead className="table-active">
                    <tr>
                      <th
                        rowSpan="2"
                        className="align-middle"
                        style={{ width: "30%" }}
                      >
                        {t(
                          "hypothesisTesting.generalProcedure.step4.table.col1",
                        )}
                      </th>
                      <th colSpan="2">
                        {t(
                          "hypothesisTesting.generalProcedure.step4.table.col2",
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th style={{ width: "35%" }}>
                        <Trans
                          i18nKey="hypothesisTesting.generalProcedure.step4.table.col2a"
                          components={{ h0: <InlineMath math="H_0" /> }}
                        />
                      </th>
                      <th style={{ width: "35%" }}>
                        <Trans
                          i18nKey="hypothesisTesting.generalProcedure.step4.table.col2b"
                          components={{ h0: <InlineMath math="H_0" /> }}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="text-start text-wrap">
                        <Trans
                          i18nKey="hypothesisTesting.generalProcedure.step4.table.row1Title"
                          components={{
                            h0: <InlineMath math="H_0" />,
                            br: <br />,
                            small: <small className="fw-normal text-muted" />,
                          }}
                        />
                      </th>
                      <td>
                        <Trans
                          i18nKey="hypothesisTesting.generalProcedure.step4.table.row1a"
                          components={{
                            br: <br />,
                            m: <InlineMath math="(1 - \alpha)" />,
                          }}
                        />
                      </td>
                      <td className="text-danger">
                        <Trans
                          i18nKey="hypothesisTesting.generalProcedure.step4.table.row1b"
                          components={{
                            bold: <strong />,
                            alpha: <InlineMath math="\alpha" />,
                            br: <br />,
                            small: <small />,
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className="text-start text-wrap">
                        <Trans
                          i18nKey="hypothesisTesting.generalProcedure.step4.table.row2Title"
                          components={{
                            ha: <InlineMath math="H_A" />,
                            br: <br />,
                            small: <small className="fw-normal text-muted" />,
                          }}
                        />
                      </th>
                      <td className="text-warning-emphasis">
                        <Trans
                          i18nKey="hypothesisTesting.generalProcedure.step4.table.row2a"
                          components={{
                            bold: <strong />,
                            beta: <InlineMath math="\beta" />,
                            br: <br />,
                            small: <small />,
                          }}
                        />
                      </td>
                      <td>
                        <Trans
                          i18nKey="hypothesisTesting.generalProcedure.step4.table.row2b"
                          components={{
                            br: <br />,
                            m: <InlineMath math="1 - \beta" />,
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GeneralProcedure;
