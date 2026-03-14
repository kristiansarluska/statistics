// src/pages/parameterEstimation/PointEstimation.jsx
import React from "react";
import { useTranslation } from "react-i18next";

function PointEstimation() {
  const { t } = useTranslation();

  return (
    <section id="point-estimation" className="mb-5">
      <h2 className="mb-4">{t("parameterEstimation.pointEstimation.title")}</h2>
      <div className="row">
        <div className="col-12">
          <p>
            {/* TODO: Add theoretical text about point estimation and SEM here */}
          </p>

          {/* Interactive Component Placeholder */}
          <div className="card shadow-sm mt-4">
            <div className="card-body bg-light text-center py-5">
              <p className="text-muted mb-0">
                Interaktívny prvok: Simulátor výberu a stredná chyba priemeru
                (SEM) - pripravuje sa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PointEstimation;
