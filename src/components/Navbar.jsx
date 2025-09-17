// src/components/Navbar.jsx
import React from "react";
import ThemeToggle from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher.jsx";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Link } from "react-router-dom";

function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg bg-body-secondary border-bottom">
      <div className="container-fluid">
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={onToggleSidebar}
        >
          {t("navbar.topics")}
          <img
            className={`arrow ms-2 ${isSidebarOpen ? "open" : ""}`}
            src="./assets/images/up-arrow.png"
            alt="Toggle arrow"
          />
        </button>

        <button
          className="navbar-toggler"
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
              <Link to="/" className="nav-link">
                {t("navbar.home")}
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!">
                {t("navbar.about")}
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {t("navbar.links")}
              </a>
              <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <a
                  className="dropdown-item"
                  href="https://www.geoinformatics.upol.cz/"
                  target="_blank"
                >
                  {t("navbar.dropdown.department")}
                </a>
                <a
                  className="dropdown-item"
                  href="https://getbootstrap.com/"
                  target="_blank"
                >
                  {t("navbar.dropdown.bootstrap")}
                </a>
                <div className="dropdown-divider"></div>
                <a
                  className="dropdown-item"
                  href="mailto:kikosarluska@gmail.com"
                >
                  {t("navbar.dropdown.contact")}
                </a>
              </div>
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
