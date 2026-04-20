// src/layout/Layout.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useGlobalHashScroll } from "../hooks/useGlobalHashScroll";
import { useDynamicMeta } from "../hooks/useDynamicMeta";
import Footer from "../components/Footer";

/**
 * @component Layout
 * @description The main structural wrapper for the application. It orchestrates the
 * global layout including the Sidebar, Navbar, and Footer. It handles the sidebar
 * toggle state via DOM classes and ensures proper scroll management across route changes.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The specific page content to be rendered within the layout.
 */
function Layout({ children }) {
  // Update document metadata (title, lang) dynamically based on current route
  useDynamicMeta();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Handle complex scrolling to hash anchors (Wait for content/charts to load)
  useGlobalHashScroll();

  /**
   * Effect to sync the sidebar's open/close state with the body class.
   * This allows CSS-based transitions defined in sidebar.css to take effect.
   */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sb-sidenav-toggled");
    } else {
      document.body.classList.remove("sb-sidenav-toggled");
    }
  }, [sidebarOpen]);

  /**
   * Secondary scroll management: Ensures that the user is scrolled to the correct
   * vertical position whenever the path or hash fragment changes.
   */
  useEffect(() => {
    if (location.hash) {
      // Extract target ID from the URL hash (e.g., #pmf-pdf -> pmf-pdf)
      const targetId = location.hash.substring(1);

      // Brief delay to ensure the new page DOM is rendered before attempting to scroll
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If no hash is present, the user navigated to a main chapter; scroll to the very top
      window.scrollTo({ top: 0, behavior: "smooth" });
      const contentWrapper = document.getElementById("page-content-wrapper");
      if (contentWrapper) {
        contentWrapper.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="d-flex" id="wrapper">
      {/* Navigation Sidebar */}
      <Sidebar closeSidebar={closeSidebar} />

      {/* Main Content Area */}
      <div
        id="page-content-wrapper"
        className="d-flex flex-column min-vh-100 w-100"
      >
        {/* Top Header/Navigation */}
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          closeSidebar={closeSidebar}
        />

        {/* Dynamic Page Content */}
        <div className="container-fluid p-4 flex-grow-1">
          <ScrollToTopButton />
          {children}
        </div>

        {/* Global Page Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
