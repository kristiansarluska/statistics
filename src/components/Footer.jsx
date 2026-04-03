// src/components/Footer.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

function Footer() {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation(); // Initialize translation hook
  const currentYear = new Date().getFullYear();
  const basePath = import.meta.env.BASE_URL;

  // Define logo based on theme
  const uniLogo = darkMode
    ? `${basePath}assets/images/UP_logo_dark.png`
    : `${basePath}assets/images/UP_logo_light.png`;

  // Standardize link classes for better contrast (replaces link-secondary)
  const linkClass = "link-body-emphasis text-decoration-none";

  return (
    <footer className="mt-auto py-4 bg-body-tertiary border-top text-center text-secondary">
      <div className="container-fluid d-flex flex-column align-items-center gap-3">
        <div className="small">
          {/* Copyright & Name */}
          <p className="mb-4">
            &copy; {currentYear}{" "}
            <a
              href="mailto:kikosarluska@gmail.com"
              className="link-primary text-decoration-none fw-medium"
            >
              Kristián Šarluška
            </a>{" "}
            <br />
            {t("footer.thesis")}
            <br />
            {t("footer.supervisor")}
          </p>

          {/* GitHub Link */}
          <p className="mb-4">
            <a
              href="https://github.com/kristiansarluska/statistics"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {t("footer.sourceCode")}
            </a>
          </p>

          {/* UI Templates */}
          <p className="mb-2">
            {t("footer.ui")}{" "}
            <a
              href="https://startbootstrap.com/template/simple-sidebar"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Simple Sidebar
            </a>
            {" • "}
            <a
              href="https://bootswatch.com/yeti/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Yeti Theme
            </a>
          </p>

          {/* Credits */}
          <p className="mb-4" style={{ fontSize: "0.85em", opacity: 0.8 }}>
            {t("footer.iconsBy")}{" "}
            <a
              href="https://www.freepik.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-body-emphasis"
            >
              Freepik
            </a>
          </p>

          {/* University Logo */}
          <div className="mb-2">
            <Link to="https://www.upol.cz/" target="_blank">
              <img
                src={uniLogo}
                alt="University Logo"
                style={{ height: "100px", width: "auto" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
