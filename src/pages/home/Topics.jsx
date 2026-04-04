// src/pages/home/Topics.jsx
import React from "react";
import { Link } from "react-router-dom";
import { chapters } from "./homeData";

function Topics() {
  return (
    <section className="mb-5">
      <h2 className="mb-4 border-bottom pb-2">Preberané témy</h2>
      <div className="row g-3">
        {chapters.map((chapter, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <Link to={chapter.path} className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 nav-icon-btn">
                <div className="card-body d-flex align-items-start">
                  <div className="fs-1 me-3 lh-1">{chapter.icon}</div>
                  <div>
                    <h5 className="card-title text-body mb-1">
                      {chapter.title}
                    </h5>
                    <p className="card-text text-muted small">{chapter.desc}</p>
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
