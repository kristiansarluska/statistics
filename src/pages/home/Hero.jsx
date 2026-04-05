// src/pages/home/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="py-5 mb-5 bg-secondary-subtle rounded-4 shadow-sm hero-grid-bg position-relative">
      <div className="row align-items-center px-4 px-lg-5 position-relative z-1">
        <div className="col-lg-5 text-center mb-4 mb-lg-0">
          <img
            src={`${import.meta.env.BASE_URL}assets/images/logo_only.svg`}
            alt="StatTerra Logo"
            className="img-fluid mb-3 drop-shadow"
            style={{ maxWidth: "200px" }}
          />
          <h1 className="display-4 fw-normal mb-0 tracking-tight">StatTerra</h1>
        </div>
        <div className="col-lg-7 text-center text-lg-end ps-lg-5">
          <h2 className="fw-normal mb-3">{t("home.hero.title")}</h2>
          <p className="lead text-muted mb-4">{t("home.hero.subtitle")}</p>
          <Link
            to="/random-variable"
            className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm fw-semibold"
          >
            {t("home.hero.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
