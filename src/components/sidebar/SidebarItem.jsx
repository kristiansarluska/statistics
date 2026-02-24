import React from "react";
import { useLocation } from "react-router-dom";

// Check if targetPath exists within this item's tree
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

  // Root levels open if active, otherwise check exact expanded path tree
  const isOpen =
    (level === 0 && isCurrentPage) || containsPath(item, expandedPath);
  const hasChildren = item.children && item.children.length > 0;

  const onLinkClick = (e) => {
    setActivePath(item.path);
    setExpandedPath(item.path);

    if (isCurrentPage && !item.path.includes("#")) {
      e.preventDefault();

      // Vynútený scroll na začiatok pre window aj hlavný kontajner
      window.scrollTo({ top: 0, behavior: "smooth" });
      const contentWrapper = document.getElementById("page-content-wrapper");
      if (contentWrapper) {
        contentWrapper.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Premazanie hashu bez re-loadu celej stránky
      window.history.pushState(null, "", basePath);

      // Ak sme na mobile, zavrie sidebar
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
          style={{
            padding: "0.5rem 1rem",
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
            className="btn border-0 rounded-0 d-flex align-items-center justify-content-center px-3"
            onClick={toggleSubmenu}
            style={{ backgroundColor: "transparent", color: "inherit" }}
          >
            <img
              src={arrow}
              alt="toggle"
              className="sidebar-arrow"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
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
          <div className="list-group list-group-flush border-start ms-2">
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
