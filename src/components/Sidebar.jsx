// src/components/Sidebar.jsx
import React from "react";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Sidebar() {
  const { t } = useTranslation();

  return (
    <div
      className="border-end bg-body-tertiary d-flex flex-column"
      id="sidebar-wrapper"
    >
      <div className="sidebar-heading border-bottom">
        {t("topics.statisticalMethods")}
      </div>
      <div className="list-group">
        <Link
          to="/random-variable"
          className="list-group-item list-group-item-action p-3"
        >
          {t("topics.randomVariable")}
        </Link>
        <Link
          to="/probability-distributions"
          className="list-group-item list-group-item-action p-3"
        >
          {t("topics.probabilityDistributions")}
        </Link>
        <Link
          to="/parameter-estimation"
          className="list-group-item list-group-item-action p-3"
        >
          {t("topics.parameterEstimation")}
        </Link>
        <Link
          to="/hypothesis-testing"
          className="list-group-item list-group-item-action p-3"
        >
          {t("topics.hypothesisTesting")}
        </Link>
        <Link
          to="/correlation"
          className="list-group-item list-group-item-action p-3"
        >
          {t("topics.correlation")}
        </Link>
        <Link
          to="/spatial-autocorrelation"
          className="list-group-item list-group-item-action p-3"
        >
          {t("topics.spatialAutocorrelation")}
        </Link>
        <Link
          to="/regression"
          className="list-group-item list-group-item-action p-3"
        >
          {t("topics.regression")}
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
