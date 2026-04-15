// src/layout/Layout.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useGlobalHashScroll } from "../hooks/useGlobalHashScroll";
import { useDynamicMeta } from "../hooks/useDynamicMeta";
import Footer from "../components/Footer";

function Layout({ children }) {
  useDynamicMeta();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useGlobalHashScroll();

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sb-sidenav-toggled");
    } else {
      document.body.classList.remove("sb-sidenav-toggled");
    }
  }, [sidebarOpen]);

  // Handle scroll position on route or hash change
  useEffect(() => {
    if (location.hash) {
      // Scroll to specific section if hash exists in URL
      const targetId = location.hash.substring(1);

      // Use short timeout to ensure new page DOM is fully rendered before scrolling
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // No hash means main chapter, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      const contentWrapper = document.getElementById("page-content-wrapper");
      if (contentWrapper) {
        contentWrapper.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar closeSidebar={closeSidebar} />
      <div
        id="page-content-wrapper"
        className="d-flex flex-column min-vh-100 w-100"
      >
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          closeSidebar={closeSidebar}
        />
        <div className="container-fluid p-4 flex-grow-1">
          <ScrollToTopButton />
          {children}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;
