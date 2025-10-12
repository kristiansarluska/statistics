// src/components/Sidebar.jsx
import React from "react";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Sidebar({ closeSidebar }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (path) => {
    if (window.innerWidth < 768) closeSidebar();
    navigate(path);
  };

  const arrow = `${import.meta.env.BASE_URL}assets/images/up-arrow.png`;

  // Dynamické aktivovanie hlavných sekcií
  const isProbabilityActive = location.pathname.startsWith(
    "/probability-distributions"
  );
  const isRandomVariableActive = location.pathname === "/random-variable";
  const isParameterEstimationActive =
    location.pathname === "/parameter-estimation";
  const isHypothesisTestingActive = location.pathname === "/hypothesis-testing";
  const isCorrelationActive = location.pathname === "/correlation";
  const isSpatialAutocorrelationActive =
    location.pathname === "/spatial-autocorrelation";
  const isRegressionActive = location.pathname === "/regression";

  return (
    <div
      className="border-end bg-body-tertiary d-flex flex-column"
      id="sidebar-wrapper"
    >
      <div className="sidebar-heading border-bottom">
        {t("topics.statisticalMethods")}
      </div>

      <div className="list-group list-group-flush">
        {/* === Jednoduché sekcie === */}
        <button
          type="button"
          className={`btn list-group-item list-group-item-action text-start p-3 ${
            isRandomVariableActive ? "active" : ""
          }`}
          onClick={() => handleLinkClick("/random-variable")}
        >
          {t("topics.randomVariable")}
        </button>

        {/* === ROZDIELENIA PRAVDEPODOBNOSTI === */}
        <div className="btn-group dropend w-100">
          <button
            type="button"
            className={`btn list-group-item list-group-item-action text-start w-100 ${
              isProbabilityActive ? "active" : ""
            }`}
            onClick={() => handleLinkClick("/probability-distributions")}
          >
            {t("topics.probabilityDistributions")}
          </button>
          <button
            type="button"
            className={`btn dropdown-toggle dropdown-toggle-split ${
              isProbabilityActive ? "active" : ""
            }`}
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={arrow} alt="submenu" className="sidebar-arrow" />
          </button>

          <ul className="dropdown-menu">
            {/* VNORENÉ POLOŽKY */}
            <li>
              <a
                className="dropdown-item"
                href="/probability-distributions#motivation"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("/probability-distributions#motivation");
                }}
              >
                Motivácia
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="/probability-distributions#pdf-cdf"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("/probability-distributions#pdf-cdf");
                }}
              >
                Pravdepodobnostná a distribučná funkcia
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="/probability-distributions#discrete-vs-continuous"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(
                    "/probability-distributions#discrete-vs-continuous"
                  );
                }}
              >
                Diskrétna a spojitá veličina
              </a>
            </li>

            {/* Diskrétne rozdelenia */}
            <li>
              <div className="btn-group dropend w-100">
                <button
                  type="button"
                  className="btn dropdown-item text-start w-100"
                  onClick={() =>
                    handleLinkClick(
                      "/probability-distributions#discrete-distributions"
                    )
                  }
                >
                  Diskrétne rozdelenia
                </button>
                <button
                  type="button"
                  className="btn dropdown-toggle dropdown-toggle-split"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={arrow} alt="submenu" className="sidebar-arrow" />
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      href="/probability-distributions#bernoulli"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick("/probability-distributions#bernoulli");
                      }}
                    >
                      Alternatívne rozdelenie
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/probability-distributions#uniform-discrete"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(
                          "/probability-distributions#uniform-discrete"
                        );
                      }}
                    >
                      Rovnomerné rozdelenie
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/probability-distributions#binomial"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick("/probability-distributions#binomial");
                      }}
                    >
                      Binomické rozdelenie
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/probability-distributions#poisson"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick("/probability-distributions#poisson");
                      }}
                    >
                      Poissonovo rozdelenie
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            {/* Spojité rozdelenia */}
            <li>
              <div className="btn-group dropend w-100">
                <button
                  type="button"
                  className="btn dropdown-item text-start w-100"
                  onClick={() =>
                    handleLinkClick(
                      "/probability-distributions#continuous-distributions"
                    )
                  }
                >
                  Spojité rozdelenia
                </button>
                <button
                  type="button"
                  className="btn dropdown-toggle dropdown-toggle-split"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={arrow} alt="submenu" className="sidebar-arrow" />
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      href="/probability-distributions#exponential"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(
                          "/probability-distributions#exponential"
                        );
                      }}
                    >
                      Exponenciálne rozdelenie
                    </a>
                  </li>

                  {/* Normálne rozdelenie */}
                  <li>
                    <div className="btn-group dropend w-100">
                      <button
                        type="button"
                        className="btn dropdown-item text-start w-100"
                        onClick={() =>
                          handleLinkClick("/probability-distributions#normal")
                        }
                      >
                        Normálne rozdelenie
                      </button>
                      <button
                        type="button"
                        className="btn dropdown-toggle dropdown-toggle-split"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={arrow}
                          alt="submenu"
                          className="sidebar-arrow"
                        />
                      </button>

                      <ul className="dropdown-menu">
                        <li>
                          <a
                            className="dropdown-item"
                            href="/probability-distributions#chi-square"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLinkClick(
                                "/probability-distributions#chi-square"
                              );
                            }}
                          >
                            Chí kvadrát rozdelenie
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="/probability-distributions#student-t"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLinkClick(
                                "/probability-distributions#student-t"
                              );
                            }}
                          >
                            Studentovo t rozdelenie
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="/probability-distributions#fisher-f"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLinkClick(
                                "/probability-distributions#fisher-f"
                              );
                            }}
                          >
                            Fisherovo F rozdelenie
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        {/* === Ostatné sekcie === */}
        <button
          type="button"
          className={`btn list-group-item list-group-item-action text-start p-3 ${
            isParameterEstimationActive ? "active" : ""
          }`}
          onClick={() => handleLinkClick("/parameter-estimation")}
        >
          {t("topics.parameterEstimation")}
        </button>

        <button
          type="button"
          className={`btn list-group-item list-group-item-action text-start p-3 ${
            isHypothesisTestingActive ? "active" : ""
          }`}
          onClick={() => handleLinkClick("/hypothesis-testing")}
        >
          {t("topics.hypothesisTesting")}
        </button>

        <button
          type="button"
          className={`btn list-group-item list-group-item-action text-start p-3 ${
            isCorrelationActive ? "active" : ""
          }`}
          onClick={() => handleLinkClick("/correlation")}
        >
          {t("topics.correlation")}
        </button>

        <button
          type="button"
          className={`btn list-group-item list-group-item-action text-start p-3 ${
            isSpatialAutocorrelationActive ? "active" : ""
          }`}
          onClick={() => handleLinkClick("/spatial-autocorrelation")}
        >
          {t("topics.spatialAutocorrelation")}
        </button>

        <button
          type="button"
          className={`btn list-group-item list-group-item-action text-start p-3 ${
            isRegressionActive ? "active" : ""
          }`}
          onClick={() => handleLinkClick("/regression")}
        >
          {t("topics.regression")}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
