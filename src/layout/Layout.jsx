// src/layout/Layout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScrollToTopButton from "../components/ScrollToTopButton";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sb-sidenav-toggled");
    } else {
      document.body.classList.remove("sb-sidenav-toggled");
    }
  }, [sidebarOpen]);

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar closeSidebar={closeSidebar} />
      <div id="page-content-wrapper">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="container-fluid">{children}</div>
        <ScrollToTopButton />
      </div>
    </div>
  );
}

export default Layout;
