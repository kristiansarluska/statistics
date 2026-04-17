// src/components/content/anova/AnovaControls.jsx
import React from "react";

const AnovaControls = ({ params, onParamChange }) => {
  return (
    <div className="row g-3 mb-4">
      {params.map((group, index) => (
        <div key={group.name} className="col-md-4">
          <div
            className="card shadow-sm border-0"
            style={{ borderTop: `4px solid ${group.color}` }}
          >
            <div className="card-body">
              <h6 className="card-title fw-bold" style={{ color: group.color }}>
                Group {group.name}
              </h6>

              <label className="form-label small mb-0 mt-2">
                Mean (μ): {group.mean}
              </label>
              <input
                type="range"
                className="form-range"
                min="10"
                max="90"
                step="1"
                value={group.mean}
                onChange={(e) =>
                  onParamChange(index, "mean", Number(e.target.value))
                }
              />

              <label className="form-label small mb-0 mt-2">
                Std Dev (σ): {group.std}
              </label>
              <input
                type="range"
                className="form-range"
                min="1"
                max="15"
                step="0.5"
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
  );
};

export default AnovaControls;
