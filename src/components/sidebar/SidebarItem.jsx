// src/components/sidebar/SidebarItem.jsx
import React from "react";
import { useLocation } from "react-router-dom";

/**
 * @function containsPath
 * @description Recursively checks if a given target path exists within a menu item or its children.
 * Used to determine if a parent menu should remain expanded when a child is active.
 * @param {Object} item - The current sidebar item object.
 * @param {string} targetPath - The path to search for.
 * @returns {boolean} True if the path is found in the item's subtree.
 */
const containsPath = (item, targetPath) => {
  if (!targetPath) return false;
  if (item.path === targetPath) return true;
  if (item.children) {
    return item.children.some((child) => containsPath(child, targetPath));
  }
  return false;
};

/**
 * @component SidebarItem
 * @description A recursive component that renders an individual navigation item within the sidebar.
 * Handles active states, smooth scrolling for hash links, mobile sidebar toggling, and collapsible submenus.
 * @param {Object} props
 * @param {Object} props.item - Navigation data object containing path, labelKey, and optional children.
 * @param {string} props.activePath - The currently active application path.
 * @param {string} props.expandedPath - The path of the currently expanded accordion menu.
 * @param {Function} props.setExpandedPath - Callback to update the expanded menu state.
 * @param {Function} props.setActivePath - Callback to update the active item state.
 * @param {Function} props.handleClick - Callback to handle routing/navigation.
 * @param {string} props.arrow - Asset path for the toggle arrow icon.
 * @param {Function} props.t - i18n translation function.
 * @param {number} [props.level=0] - Current depth level in the recursive tree (used for indentation).
 * @param {string|null} [props.parentPath=null] - The path of the parent item, used for collapsing menus.
 */
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
    // 1. Determine if this is a main chapter (no hash in URL)
    const isMainChapter = !item.path.includes("#");

    // 2. Notify the Navbar via CustomEvent to adjust active states
    window.dispatchEvent(
      new CustomEvent("sidebar-navigate", {
        detail: { isMainChapter },
      }),
    );

    setActivePath(item.path);
    setExpandedPath(item.path);

    // 3. If clicking the main chapter of the current page, scroll smoothly to the top
    if (isCurrentPage && isMainChapter) {
      e.preventDefault();

      window.scrollTo({ top: 0, behavior: "smooth" });
      const contentWrapper = document.getElementById("page-content-wrapper");
      if (contentWrapper) {
        contentWrapper.scrollTo({ top: 0, behavior: "smooth" });
      }

      handleClick(basePath);

      // Auto-collapse sidebar on mobile devices
      if (window.innerWidth < 768) {
        const btn = document.getElementById("sidebarToggle");
        if (btn && document.body.classList.contains("sb-sidenav-toggled"))
          btn.click();
      }
      return;
    }

    // 4. If clicking a sub-chapter (hash link), scroll to the specific element
    if (!isMainChapter) {
      const hashId = item.path.split("#")[1];
      if (hashId) {
        // If navigating from another page, the DOM needs more time for the initial render
        const delay = isCurrentPage ? 50 : 500;
        setTimeout(() => {
          const element = document.getElementById(hashId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, delay);
      }
    }

    // 5. Proceed with standard navigation
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
          // Reduced right padding (from 1rem to 0.25rem) to provide more space for longer labels
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

      {/* Recursive rendering of nested children */}
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
