// src/pages/parameterEstimation/IntervalEstimation.jsx
import React from "react";
import { useTranslation } from "react-i18next";

function IntervalEstimation() {
  const { t } = useTranslation();

  return (
    <section id="interval-estimation" className="mb-5">
      <h2 className="mb-4">
        {t("parameterEstimation.intervalEstimation.title")}
      </h2>
      <div className="row">
        <div className="col-12">
          <p>
            {/* TODO: Add theoretical text about confidence intervals here */}
          </p>

          {/* Interactive Component Placeholder */}
          <div className="card shadow-sm mt-4">
            <div className="card-body bg-light text-center py-5">
              <p className="text-muted mb-0">
                Interaktívny prvok: Výpočet a vizualizácia intervalov
                spoľahlivosti - pripravuje sa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntervalEstimation;
