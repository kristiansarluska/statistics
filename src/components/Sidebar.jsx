// src/components/Sidebar.jsx
import React from "react";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarItem from "./sidebar/SidebarItem";
import { sidebarData } from "./sidebar/sidebarData";

function Sidebar({ closeSidebar }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const arrow = `${import.meta.env.BASE_URL}assets/images/small-arrow.png`;

  const handleLinkClick = (path) => {
    if (window.innerWidth < 768) closeSidebar();
    navigate(path);
  };

  return (
    <div
      className="border-end bg-body-tertiary d-flex flex-column"
      id="sidebar-wrapper"
    >
      <div className="sidebar-heading border-bottom">
        {t("topics.statisticalMethods")}
      </div>

      <div className="list-group list-group-flush">
        {sidebarData.map((item, idx) => (
          <SidebarItem
            key={idx}
            item={item}
            activePath={location.pathname}
            handleClick={handleLinkClick}
            arrow={arrow}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
