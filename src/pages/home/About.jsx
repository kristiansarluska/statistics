// src/pages/home/About.jsx
import React from "react";

function About() {
  return (
    <section className="row mb-5 align-items-center">
      <div className="col-md-6 mb-4 mb-md-0">
        <h2 className="mb-3">O projekte</h2>
        <p>
          Táto webová aplikácia vznikla ako výstup bakalárskej práce. Jej cieľom
          je prepojiť teoretické poznatky štatistiky s praktickými ukážkami,
          vizualizáciami a geodátami.
        </p>
        <h4 className="mt-4 mb-2">Pre koho je určená?</h4>
        <ul className="list-unstyled text-muted">
          <li>
            &#x2022; Pre študentov katedry geoinformatiky Univerzity Palackého v
            Olomouci
          </li>
          <li>&#x2022; Pre študentov príbuzných odborov</li>
          <li>
            &#x2022; Pre každého, kto hľadá moderný spôsob výučby štatistiky
          </li>
        </ul>
      </div>
      <div className="col-md-6 text-center">
        <div
          className="bg-dark-subtle rounded-3 d-flex align-items-center justify-content-center"
          style={{ minHeight: "250px" }}
        >
          <span className="text-secondary">
            [ Miesto pre ukážkové video / GIF aplikácie ]
          </span>
        </div>
      </div>
    </section>
  );
}

export default About;
