import React, { useEffect, useState } from "react";

function SidebarItem({ item, activePath, handleClick, arrow, t, level = 0 }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isActive = activePath === item.path || activePath.startsWith(item.path);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ak má položka children, ale na mobile už nechceme viac ako 2 úrovne
  const hasChildren = item.children && item.children.length > 0;
  const showAsDropend = hasChildren && (!isMobile || level < 1);
  const renderAsSimple = isMobile && level >= 1; // na mobile, od 2. úrovne ďalej len buttony

  // === SIMPLE BUTTON ===
  if (!hasChildren || renderAsSimple) {
    return (
      <button
        type="button"
        className={`btn list-group-item list-group-item-action text-start w-100 ${
          isActive ? "active" : ""
        }`}
        onClick={() => handleClick(item.path)}
      >
        {item.labelKey ? t(item.labelKey) : item.label}
      </button>
    );
  }

  // === DROPDOWN / DROPEND ===
  return (
    <div className={`btn-group dropend w-100 ${isMobile ? "mobile" : ""}`}>
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
              level={level + 1}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SidebarItem;
