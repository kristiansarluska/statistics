// src/pages/home/About.jsx
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";

function About() {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  return (
    <section className="row mb-5 align-items-center">
      {/* TEXT CONTENT */}
      <div className="col-md-6 mb-4 mb-md-0">
        <h2 className="mb-3">{t("home.about.title")}</h2>
        <p>{t("home.about.description")}</p>

        <h4 className="mt-4 mb-2">{t("home.about.targetAudienceTitle")}</h4>
        <ul className="list-unstyled text-muted">
          <li>&#x2022; {t("home.about.audience1")}</li>
          <li>&#x2022; {t("home.about.audience2")}</li>
          <li>&#x2022; {t("home.about.audience3")}</li>
        </ul>
      </div>

      {/* MOCKUP IMAGE */}
      <div className="col-md-6 text-center">
        <div
          className="bg-body-tertiary rounded-4 d-flex align-items-center justify-content-center p-3 shadow-sm border"
          style={{ minHeight: "320px" }}
        >
          <img
            src={
              darkMode
                ? `${import.meta.env.BASE_URL}assets/images/mockup_dark.webp`
                : `${import.meta.env.BASE_URL}assets/images/mockup_light.webp`
            }
            alt="Application mockup"
            className="img-fluid"
            style={{
              maxHeight: "350px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default About;
