import React from "react";
import { useLocation } from "react-router-dom";

const containsPath = (item, targetPath) => {
  if (!targetPath) return false;
  if (item.path === targetPath) return true;
  if (item.children) {
    return item.children.some((child) => containsPath(child, targetPath));
  }
  return false;
};

function SidebarItem({
  item,
  activePath,
  expandedPath,
  setExpandedPath,
  setActivePath,
  handleClick,
  arrow,
  t,
  level = 0,
  parentPath = null,
}) {
  const location = useLocation();
  const basePath = item.path.split("#")[0];
  const isCurrentPage = location.pathname === basePath;

  const isExactActive = activePath === item.path;
  const isOpen = containsPath(item, expandedPath);
  const hasChildren = item.children && item.children.length > 0;

  const onLinkClick = (e) => {
    // 1. Zistíme, či ide o hlavnú kapitolu (nemá # v URL)
    const isMainChapter = !item.path.includes("#");

    // 2. Pošleme túto informáciu Navbaru cez CustomEvent
    window.dispatchEvent(
      new CustomEvent("sidebar-navigate", {
        detail: { isMainChapter },
      }),
    );

    setActivePath(item.path);
    setExpandedPath(item.path);

    if (isCurrentPage && isMainChapter) {
      e.preventDefault();

      window.scrollTo({ top: 0, behavior: "smooth" });
      const contentWrapper = document.getElementById("page-content-wrapper");
      if (contentWrapper) {
        contentWrapper.scrollTo({ top: 0, behavior: "smooth" });
      }

      handleClick(basePath);

      if (window.innerWidth < 768) {
        const btn = document.getElementById("sidebarToggle");
        if (btn && document.body.classList.contains("sb-sidenav-toggled"))
          btn.click();
      }
      return;
    }

    handleClick(item.path);
  };

  const toggleSubmenu = (e) => {
    e.stopPropagation();
    if (isOpen) {
      setExpandedPath(parentPath);
    } else {
      setExpandedPath(item.path);
    }
  };

  return (
    <div className="w-100">
      <div
        className={`d-flex align-items-stretch list-group-item list-group-item-action p-0 ${isExactActive ? "active" : ""}`}
      >
        <button
          type="button"
          className="btn text-start flex-grow-1 border-0 rounded-0"
          // ZMENA: Zmenšený pravý padding z 1rem na 0.25rem pre viac priestoru
          style={{
            padding: "0.5rem 0.25rem 0.5rem 1rem",
            fontSize: "14px",
            color: "inherit",
            backgroundColor: "transparent",
          }}
          onClick={onLinkClick}
        >
          {item.labelKey ? t(item.labelKey) : item.label}
        </button>

        {hasChildren && (
          <button
            type="button"
            // ZMENA: Z px-3 na px-2 a pridaný flex-shrink-0
            className="btn border-0 rounded-0 d-flex align-items-center justify-content-center px-2 flex-shrink-0"
            onClick={toggleSubmenu}
            style={{ backgroundColor: "transparent", color: "inherit" }}
          >
            <img
              src={arrow}
              alt="toggle"
              className="sidebar-arrow"
              style={{
                transform: isOpen ? "rotate(90deg)" : "rotate(-90deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </button>
        )}
      </div>

      {hasChildren && (
        <div
          className="sidebar-submenu"
          style={{
            maxHeight: isOpen ? "800px" : "0",
            opacity: isOpen ? 1 : 0,
            paddingLeft: level === 0 ? "0.75rem" : "0.5rem",
          }}
        >
          <div className="list-group list-group-flush ms-2">
            {item.children.map((child, idx) => (
              <SidebarItem
                key={idx}
                item={child}
                activePath={activePath}
                expandedPath={expandedPath}
                setExpandedPath={setExpandedPath}
                setActivePath={setActivePath}
                handleClick={handleClick}
                arrow={arrow}
                t={t}
                level={level + 1}
                parentPath={item.path}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarItem;
