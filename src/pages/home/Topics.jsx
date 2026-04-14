// src/pages/home/Topics.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { chapters } from "./homeData";

function Topics() {
  const { t } = useTranslation();

  return (
    <section className="mb-5">
      <h2 className="mb-4 border-bottom pb-2">{t("home.topicsTitle")}</h2>
      <p className=" text-center">
        <Trans
          i18nKey="home.topicsDescription"
          components={{
            1: (
              <a
                href="https://stag.upol.cz/StagPortletsJSR168/CleanUrl?urlid=prohlizeni-predmet-sylabus&predmetZkrPrac=KGI&predmetZkrPred=STAME&predmetRok=2025&predmetSemestr=LS"
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}
        />
      </p>
      <div className="row g-3">
        {chapters.map((chapter, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <Link to={chapter.path} className="text-decoration-none">
              <div className="card h-100 shadow-sm border-primary nav-icon-btn rounded-4">
                <div className="card-body d-flex align-items-start">
                  <div
                    className="fs-1 me-3 lh-1 d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    {chapter.icon.includes(".") ? (
                      <img
                        src={`${import.meta.env.BASE_URL}${chapter.icon}`}
                        alt="icon"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      chapter.icon
                    )}
                  </div>
                  <div>
                    <h5 className="card-title text-body mb-1">
                      {t(chapter.titleKey)}
                    </h5>
                    <p className="card-text text-muted small">
                      {t(chapter.descKey)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Topics;
