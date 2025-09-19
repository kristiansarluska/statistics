// src/components/Sidebar.jsx
import React from "react";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

function Sidebar({ closeSidebar }) {
  const { t } = useTranslation();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  const getLinkClass = ({ isActive }) =>
    `list-group-item list-group-item-action p-3 ${isActive ? "active" : ""}`;

  return (
    <div
      className="border-end bg-body-tertiary d-flex flex-column"
      id="sidebar-wrapper"
    >
      <div className="sidebar-heading border-bottom">
        {t("topics.statisticalMethods")}
      </div>
      <div className="list-group">
        <NavLink
          to="/random-variable"
          className={getLinkClass}
          onClick={handleLinkClick}
        >
          {t("topics.randomVariable")}
        </NavLink>
        <NavLink
          to="/probability-distributions"
          className={getLinkClass}
          onClick={handleLinkClick}
        >
          {t("topics.probabilityDistributions")}
        </NavLink>
        <NavLink
          to="/parameter-estimation"
          className={getLinkClass}
          onClick={handleLinkClick}
        >
          {t("topics.parameterEstimation")}
        </NavLink>
        <NavLink
          to="/hypothesis-testing"
          className={getLinkClass}
          onClick={handleLinkClick}
        >
          {t("topics.hypothesisTesting")}
        </NavLink>
        <NavLink
          to="/correlation"
          className={getLinkClass}
          onClick={handleLinkClick}
        >
          {t("topics.correlation")}
        </NavLink>
        <NavLink
          to="/spatial-autocorrelation"
          className={getLinkClass}
          onClick={handleLinkClick}
        >
          {t("topics.spatialAutocorrelation")}
        </NavLink>
        <NavLink
          to="/regression"
          className={getLinkClass}
          onClick={handleLinkClick}
        >
          {t("topics.regression")}
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
