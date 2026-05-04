// src/components/Footer.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * @component Footer
 * @description Renders the application's global footer. Displays copyright information,
 * author details, open-source attributions, and a dynamic university logo that adapts
 * to the current light/dark theme.
 */
function Footer() {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const basePath = import.meta.env.BASE_URL;

  // Resolve the correct university logo asset based on the active theme
  const uniLogo = darkMode
    ? `${basePath}assets/images/UP_logo_dark.png`
    : `${basePath}assets/images/UP_logo_light.png`;

  const linkClass = "link-body-emphasis text-decoration-none";

  return (
    <footer
      className="mt-auto pt-4 pb-5 bg-body-tertiary border-top text-secondary small"
      style={{ paddingBottom: "calc(3rem + env(safe-area-inset-bottom))" }}
    >
      <div className="container-fluid px-4">
        <div className="row align-items-center text-center text-md-start">
          <div className="col-md-4 order-1 order-md-1 mb-4 mb-md-0">
            <p className="mb-0">
              &copy; {currentYear}{" "}
              <a
                href="mailto:kikosarluska@gmail.com"
                className="link-primary text-decoration-none fw-medium"
              >
                Kristián ŠARLUŠKA
              </a>
              <br />
              {t("footer.license")}
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="link-primary text-decoration-none"
              >
                GNU GPL v3
              </a>
              <br />
              {t("footer.thesis")}
              <br />
              {t("footer.supervisor")}
            </p>
          </div>

          <div className="col-md-4 order-3 order-md-2 text-center mt-3 mt-md-0">
            <Link to="https://www.upol.cz/" target="_blank">
              <img
                src={uniLogo}
                alt="University Logo"
                style={{ height: "80px", width: "auto" }}
              />
            </Link>
          </div>

          <div className="col-md-4 order-2 order-md-3 text-md-end mb-4 mb-md-0">
            <p className="mb-1">
              <a
                href="https://github.com/kristiansarluska/StatTerra"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {t("footer.sourceCode")}
              </a>
            </p>
            <p className="mb-1">
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
            <p className="mb-0" style={{ fontSize: "0.85em", opacity: 0.8 }}>
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
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
