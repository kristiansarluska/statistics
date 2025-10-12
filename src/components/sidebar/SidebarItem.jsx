// src/components/sidebar/SidebarItem.jsx
import React from "react";

function SidebarItem({ item, activePath, handleClick, arrow, t }) {
  const isActive = activePath === item.path || activePath.startsWith(item.path);

  // Položka s vnorenými children (dropdown)
  if (item.children && item.children.length > 0) {
    return (
      <div className="btn-group dropend w-100">
        <button
          type="button"
          className={`btn list-group-item list-group-item-action text-start w-100 ${
            isActive ? "active" : ""
          }`}
          onClick={() => handleClick(item.path)}
        >
          {item.labelKey ? t(item.labelKey) : item.label}
        </button>
        <button
          type="button"
          className={`btn dropdown-toggle dropdown-toggle-split ${
            isActive ? "active" : ""
          }`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={arrow} alt="submenu" className="sidebar-arrow" />
        </button>

        <ul className="dropdown-menu">
          {item.children.map((child, idx) => (
            <li key={idx}>
              <SidebarItem
                item={child}
                activePath={activePath}
                handleClick={handleClick}
                arrow={arrow}
                t={t}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Jednoduché tlačidlo
  return (
    <button
      type="button"
      className={`btn list-group-item list-group-item-action text-start p-3 ${
        isActive ? "active" : ""
      }`}
      onClick={() => handleClick(item.path)}
    >
      {item.labelKey ? t(item.labelKey) : item.label}
    </button>
  );
}

export default SidebarItem;
