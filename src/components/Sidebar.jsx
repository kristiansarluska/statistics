// src/components/Sidebar.jsx
import React, { useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarItem from "./sidebar/SidebarItem";
import { sidebarData } from "./sidebar/sidebarData";

/**
 * @component Sidebar
 * @description The main navigation sidebar component. It generates a recursive menu
 * based on `sidebarData` and implements a "ScrollSpy" feature to automatically
 * highlight and expand the menu items as the user scrolls through the content.
 * @param {Object} props
 * @param {Function} props.closeSidebar - Callback function to close the sidebar (used for mobile responsiveness).
 */
function Sidebar({ closeSidebar }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const arrow = `${import.meta.env.BASE_URL}assets/images/small-arrow.png`;

  // Internal state to track which menu item is active or expanded based on current URL and scroll
  const [activePath, setActivePath] = useState(
    location.pathname + location.hash,
  );
  const [expandedPath, setExpandedPath] = useState(
    location.pathname + location.hash,
  );

  /**
   * Memoized list of all hash IDs defined in the navigation data.
   * This allows the ScrollSpy to focus only on content sections and ignore other elements like charts.
   */
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

  /**
   * ScrollSpy Logic: Monitors the scrolling of the content wrapper and updates
   * the active sidebar item based on which section is currently visible in the viewport.
   */
  useEffect(() => {
    const handleScroll = () => {
      const validElements = validIds
        .map((id) => document.getElementById(id))
        .filter((el) => el !== null);

      let currentId = "";
      for (let el of validElements) {
        const rect = el.getBoundingClientRect();
        // Detection offset (250px) ensures sections are captured slightly before they hit the top
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

    const contentEl = document.getElementById("page-content-wrapper");
    contentEl?.addEventListener("scroll", handleScroll);

    // Initial check on mount
    handleScroll();

    return () => {
      contentEl?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [activePath, location.pathname, validIds]);

  /**
   * Effect to synchronize the sidebar state with manual URL changes or initial page load.
   */
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
      {/* Sidebar Header with Logo */}
      <div className="sidebar-heading border-bottom">
        <Link
          to="/"
          className="sidebar-logo d-flex align-items-center text-decoration-none"
          onClick={() => {
            if (location.pathname === "/") {
              const contentWrapper = document.getElementById(
                "page-content-wrapper",
              );
              if (contentWrapper) {
                contentWrapper.scrollTo({ top: 0, behavior: "smooth" });
              }
            }

            if (window.innerWidth < 768) {
              closeSidebar();
            }

            setActivePath("/");
            setExpandedPath("/");
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}assets/images/logo_only.svg`}
            alt="StatTerra Logo"
            className="me-2"
            style={{ height: "32px", width: "auto" }}
          />
          <span className="h4 fw-normal mb-0 text-body tracking-tight">
            StatTerra
          </span>
        </Link>
      </div>

      {/* Navigation List */}
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
