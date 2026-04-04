// src/pages/home/Methodology.jsx
import React, { useState } from "react";
import { methodologyModules } from "./homeData";

function Methodology() {
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  return (
    <section className="mb-5">
      <h2 className="text-center mb-4">Metodika výučby</h2>
      <div className="row g-4">
        {methodologyModules.map((mod) => (
          <div className="col-md-4" key={mod.id}>
            <div
              className="card h-100 shadow-sm border-0 nav-icon-btn cursor-pointer"
              style={{ cursor: "pointer" }}
              onClick={() => setActiveModal(mod)}
            >
              <div
                className="bg-dark-subtle card-img-top d-flex align-items-center justify-content-center"
                style={{ height: "180px" }}
              >
                <span className="text-secondary small">
                  {mod.placeholderText}
                </span>
              </div>
              <div className="card-body">
                <h5 className="card-title text-primary">{mod.title}</h5>
                <p className="card-text text-muted">{mod.shortDesc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={closeModal}
          >
            <div
              className="modal-dialog modal-xl modal-dialog-centered"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content shadow-lg border-0 bg-body">
                <div className="modal-header border-bottom-0 pb-0">
                  <h3 className="modal-title fw-bold">{activeModal.title}</h3>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <p className="lead text-muted mb-4">{activeModal.fullDesc}</p>
                  <div
                    className="border rounded bg-secondary-subtle d-flex align-items-center justify-content-center"
                    style={{ minHeight: "400px" }}
                  >
                    <h5 className="text-secondary">
                      [ Tu sa načíta reálny komponent pre: {activeModal.id} ]
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show opacity-50"></div>
        </>
      )}
    </section>
  );
}

export default Methodology;
