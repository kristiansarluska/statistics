// src/components/Sidebar.jsx
import React from "react";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";

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
        <a className="list-group-item list-group-item-action p-3" href="#!">
          {t("topics.randomVariable")}
        </a>
        <a className="list-group-item list-group-item-action p-3" href="#!">
          {t("topics.distributions")}
        </a>
        <a className="list-group-item list-group-item-action p-3" href="#!">
          {t("topics.parameterEstimation")}
        </a>
        <a className="list-group-item list-group-item-action p-3" href="#!">
          {t("topics.hypothesisTesting")}
        </a>
        <a className="list-group-item list-group-item-action p-3" href="#!">
          {t("topics.correlation")}
        </a>
        <a className="list-group-item list-group-item-action p-3" href="#!">
          {t("topics.spatialAutocorrelation")}
        </a>
        <a className="list-group-item list-group-item-action p-3" href="#!">
          {t("topics.regression")}
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
