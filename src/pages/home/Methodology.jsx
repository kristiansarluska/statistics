// src/pages/home/Methodology.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { methodologyModules } from "./homeData";
import ArithmeticMeanCalc from "../../components/content/characteristics/ArithmeticMeanCalc";
import NormalChart from "../../components/charts/probability-distributions/continuous/NormalChart";
import NutsMap from "../../components/maps/NutsMap";
import DataPreviewTable from "../../components/charts/helpers/DataPreviewTable";

function Methodology() {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState(null);
  const [showFade, setShowFade] = useState(false);
  const [geoData, setGeoData] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const openModal = (mod) => {
    setActiveModal(mod);
    setTimeout(() => setShowFade(true), 10);
  };

  const closeModal = () => {
    setShowFade(false);
    setTimeout(() => {
      setActiveModal(null);
      setHoveredId(null);
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && activeModal) {
        closeModal();
      }
    };

    if (activeModal) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/NUTS3_median_age_EU.geojson`)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load map data:", err));
  }, []);

  const sampleSelectedIds = useMemo(() => {
    return geoData ? geoData.features.map((f) => f.properties.nuts_id) : [];
  }, [geoData]);

  const renderModalContent = () => {
    switch (activeModal.id) {
      case "theory":
        return <ArithmeticMeanCalc />;
      case "interactive":
        return <NormalChart />;
      case "data": {
        if (!geoData) {
          return (
            <div className="text-center p-4">
              {t("home.methodology.loadingMap")}
            </div>
          );
        }

        const tableData = geoData.features.map((f) => f.properties);
        const columns = [
          { key: "nuts_id", label: t("home.methodology.table.colNutsId") },
          { key: "name", label: t("home.methodology.table.colRegion") },
          { key: "country", label: t("home.methodology.table.colCountry") },
          {
            key: "median_age",
            label: t("home.methodology.table.colMedianAge"),
          },
        ];

        return (
          <div className="w-100">
            <NutsMap
              geoJsonData={geoData}
              selectedIds={sampleSelectedIds}
              hoveredId={hoveredId}
              onRegionHover={setHoveredId}
            />
            <DataPreviewTable
              data={tableData}
              columns={columns}
              title={t("home.methodology.table.title")}
              rowKey="nuts_id"
              hoveredRowKey={hoveredId}
              onRowHover={setHoveredId}
            />
          </div>
        );
      }
      default:
        return null;
    }
  };

  const renderThumbnail = (id) => {
    const innerStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "200%",
      height: "360px",
      transform: "scale(0.5)",
      transformOrigin: "top left",
      overflow: "hidden",
      padding: "1rem",
    };

    switch (id) {
      case "theory":
        return (
          <div style={innerStyle}>
            <ArithmeticMeanCalc />
          </div>
        );
      case "interactive":
        return (
          <div style={innerStyle}>
            <NormalChart />
          </div>
        );
      case "data":
        return (
          <div style={{ ...innerStyle, padding: 0 }}>
            {geoData ? (
              <NutsMap geoJsonData={geoData} selectedIds={sampleSelectedIds} />
            ) : (
              <div className="d-flex h-100 w-100 align-items-center justify-content-center bg-body-tertiary">
                <div className="spinner-border text-secondary" role="status" />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="mb-5">
      <h2 className="text-center mb-4">{t("home.methodology.title")}</h2>
      {/* --- Learning flow guide --- */}
      <div className="row mb-5 justify-content-center">
        <div className="col-lg-10 text-center">
          <p className="text-muted mb-4">
            {t("home.methodology.guideDescription")}
          </p>

          <div className="d-flex flex-column flex-md-row gap-3">
            {/* Added h-100 for equal height */}
            <div className="card bg-body-tertiary border-0 shadow-sm flex-fill h-100 w-100">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-primary fw-bold">
                  1. {t("home.methodology.step1Title")}
                </h6>
                <p className="card-text small mb-0 text-muted">
                  {t("home.methodology.step1Desc")}
                </p>
              </div>
            </div>

            <div className="card bg-body-tertiary border-0 shadow-sm flex-fill h-100 w-100">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-primary fw-bold">
                  2. {t("home.methodology.step2Title")}
                </h6>
                <p className="card-text small mb-0 text-muted">
                  {t("home.methodology.step2Desc")}
                </p>
              </div>
            </div>

            <div className="card bg-body-tertiary border-0 shadow-sm flex-fill h-100 w-100">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-primary fw-bold">
                  3. {t("home.methodology.step3Title")}
                </h6>
                <p className="card-text small mb-0 text-muted">
                  {t("home.methodology.step3Desc")}
                </p>
              </div>
            </div>
          </div>

          {/* Added connection text */}
          <p className="text-muted mt-4 mb-0">
            {t("home.methodology.guideConnection")}
          </p>
        </div>
      </div>

      <div className="row g-4">
        {methodologyModules.map((mod) => (
          <div className="col-md-4" key={mod.id}>
            <div
              className="card h-100 shadow-sm border-0 nav-icon-btn overflow-hidden position-relative"
              style={{
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onClick={() => openModal(mod)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.className = e.currentTarget.className.replace(
                  "shadow-sm",
                  "shadow-lg",
                );
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.className = e.currentTarget.className.replace(
                  "shadow-lg",
                  "shadow-sm",
                );
              }}
            >
              <div
                className="bg-body-tertiary border-bottom position-relative w-100"
                style={{ height: "180px", overflow: "hidden" }}
              >
                {renderThumbnail(mod.id)}
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ zIndex: 10 }}
                ></div>
              </div>

              <div className="card-body bg-body">
                <h5 className="card-title text-primary">{t(mod.titleKey)}</h5>
                <p className="card-text text-muted">{t(mod.shortDescKey)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeModal && (
        <>
          <div
            className={`modal fade d-block ${showFade ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            onClick={closeModal}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div
              className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content shadow-lg border-0 bg-body">
                <div className="modal-header border-bottom-0 pb-0">
                  <h3 className="modal-title">{t(activeModal.titleKey)}</h3>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <p className="lead text-muted mb-4">
                    {t(activeModal.longDescKey)}
                  </p>
                  <div
                    className="border rounded p-4 bg-body-tertiary"
                    style={{ minHeight: "400px" }}
                  >
                    {renderModalContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Methodology;
