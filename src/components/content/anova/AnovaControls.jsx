// src/components/content/anova/AnovaControls.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const AnovaControls = ({ params, onParamChange }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Local style for overriding Bootstrap slider pseudo-elements */}
      <style>
        {`
          .colored-slider::-webkit-slider-thumb {
            background-color: var(--slider-color) !important;
          }
          .colored-slider::-moz-range-thumb {
            background-color: var(--slider-color) !important;
          }
        `}
      </style>

      <div className="row g-3">
        {params.map((group, index) => (
          <div key={group.name} className="col-md-4">
            <div
              className="card border-0"
              style={{ borderTop: `4px solid ${group.color}` }}
            >
              <div className="card-body">
                <h6
                  className="card-title fw-bold"
                  style={{ color: group.color }}
                >
                  {t("components.anovaSimulation.city", { name: group.name })}
                </h6>

                <label className="form-label small mb-0">μ: {group.mean}</label>
                <input
                  type="range"
                  className="form-range colored-slider"
                  style={{ "--slider-color": group.color }}
                  min="8"
                  max="32"
                  step="0.1"
                  value={group.mean}
                  onChange={(e) =>
                    onParamChange(index, "mean", Number(e.target.value))
                  }
                />

                <label className="form-label small mb-0 mt-2">
                  σ: {group.std}
                </label>
                <input
                  type="range"
                  className="form-range colored-slider"
                  style={{ "--slider-color": group.color }}
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={group.std}
                  onChange={(e) =>
                    onParamChange(index, "std", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AnovaControls;
