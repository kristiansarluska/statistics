// src/components/Sidebar.jsx
import React, { useState, useEffect, useMemo } from "react";
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

  const [activePath, setActivePath] = useState(
    location.pathname + location.hash,
  );
  const [expandedPath, setExpandedPath] = useState(
    location.pathname + location.hash,
  );

  // Extract only valid IDs defined in sidebarData to ignore charts/SVGs
  const validIds = useMemo(() => {
    const getIds = (items) => {
      let ids = [];
      items.forEach((item) => {
        if (item.path && item.path.includes("#"))
          ids.push(item.path.split("#")[1]);
        if (item.children) ids = [...ids, ...getIds(item.children)];
      });
      return ids;
    };
    return getIds(sidebarData);
  }, []);

  // Bulletproof ScrollSpy
  useEffect(() => {
    const handleScroll = () => {
      const validElements = validIds
        .map((id) => document.getElementById(id))
        .filter((el) => el !== null);

      let currentId = "";
      for (let el of validElements) {
        const rect = el.getBoundingClientRect();
        // Zvýšený detekčný offset (250px) pre lepšie zachytenie pri scrollovaní
        if (rect.top <= 250) {
          currentId = el.id;
        }
      }

      const newActivePath = currentId
        ? location.pathname + "#" + currentId
        : location.pathname;

      if (newActivePath !== activePath) {
        setActivePath(newActivePath);
        setExpandedPath(newActivePath);
      }
    };

    // Vynútené zachytenie scrollu z akéhokoľvek kontajneru (capture phase)
    window.addEventListener("scroll", handleScroll, true);

    // Spustenie hneď po načítaní
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [activePath, location.pathname, validIds]);

  // Sync state with URL changes (e.g. initial load)
  useEffect(() => {
    const currentPath = location.pathname + location.hash;
    setActivePath(currentPath);
    setExpandedPath(currentPath);
  }, [location.pathname, location.hash]);

  const handleLinkClick = (path) => {
    if (window.innerWidth < 768) closeSidebar();
    navigate(path);
  };

  return (
    <div className="border-end d-flex flex-column" id="sidebar-wrapper">
      <div className="sidebar-heading border-bottom">
        {t("topics.statisticalMethods")}
      </div>
      <div className="list-group list-group-flush">
        {sidebarData.map((item, idx) => (
          <SidebarItem
            key={idx}
            item={item}
            activePath={activePath}
            expandedPath={expandedPath}
            setExpandedPath={setExpandedPath}
            setActivePath={setActivePath}
            handleClick={handleLinkClick}
            arrow={arrow}
            t={t}
            level={0}
            parentPath={null}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
