// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import ThemeToggle from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher.jsx";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Link } from "react-router-dom";

function Navbar({ onToggleSidebar, isSidebarOpen, closeSidebar }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAutoScrolling = useRef(false);

  const handleHomeClick = () => {
    if (window.innerWidth < 768) {
      if (closeSidebar) closeSidebar();

      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  };

  useEffect(() => {
    const menu = document.getElementById("navbarSupportedContent");
    if (!menu) return;

    const handleShow = () => setIsMenuOpen(true);
    const handleHide = () => setIsMenuOpen(false);

    menu.addEventListener("show.bs.collapse", handleShow);
    menu.addEventListener("hide.bs.collapse", handleHide);

    return () => {
      menu.removeEventListener("show.bs.collapse", handleShow);
      menu.removeEventListener("hide.bs.collapse", handleHide);
    };
  }, []);

  useEffect(() => {
    const handleSidebarNav = (e) => {
      isAutoScrolling.current = true;

      if (e.detail && e.detail.isMainChapter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 2000);
    };

    window.addEventListener("sidebar-navigate", handleSidebarNav);
    return () =>
      window.removeEventListener("sidebar-navigate", handleSidebarNav);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.getElementById("page-content-wrapper")?.scrollTop ||
        0;

      if (isAutoScrolling.current) {
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 80) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [lastScrollY]);

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-secondary border-bottom fixed-top"
      style={{
        transform:
          isVisible || isMenuOpen ? "translateY(0)" : "translateY(-120%)",
        willChange: "transform",
        top: 0,
        zIndex: 1030,
      }}
    >
      <div className="container-fluid">
        <button
          className="btn btn-primary d-flex align-items-center rounded-5 text-nowrap"
          onClick={(e) => {
            isAutoScrolling.current = true;
            setTimeout(() => {
              isAutoScrolling.current = false;
            }, 500);

            onToggleSidebar();
          }}
        >
          {t("navbar.topics")}
          <img
            className={`arrow ms-2 ${isSidebarOpen ? "open" : ""}`}
            src={`${import.meta.env.BASE_URL}assets/images/up-arrow.png`}
            alt="Toggle arrow"
          />
        </button>

        <button
          className="navbar-toggler ms-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <Link to="/" className="nav-link" onClick={handleHomeClick}>
                {t("navbar.home")}
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!" onClick={handleHomeClick}>
                {t("navbar.about")}
              </a>
            </li>
            <li className="nav-item active" onClick={handleHomeClick}>
              <Link
                to="https://www.geoinformatics.upol.cz/"
                target="_blank"
                className="nav-link"
              >
                {t("navbar.department")}
              </Link>
            </li>
          </ul>
          <div className="d-flex ms-auto align-items-center">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
