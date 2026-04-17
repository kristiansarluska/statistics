// src/pages/anova/AssumptionViolations.jsx
import React from "react";

const AssumptionViolations = () => {
  return (
    <section id="violation">
      <h2 className="mb-4">Predpoklady a ich narušenie</h2>
      <div className="list-group shadow-sm">
        <div className="list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">1. Nezávislosť pozorovaní</h5>
          </div>
          <p className="mb-1">
            Dáta v skupinách musia byť navzájom nezávislé. Kľúčový predpoklad
            pre validitu testu.
          </p>
        </div>
        <div className="list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">2. Normalita rozdelenia</h5>
          </div>
          <p className="mb-1">
            Dáta v každej skupine by mali pochádzať z normálneho rozdelenia.
            ANOVA je voči miernemu narušeniu robustná.
          </p>
          <small className="text-muted">
            Overenie: Shapiro-Wilk test, Q-Q plot.
          </small>
        </div>
        <div className="list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">3. Homoskedasticita (Zhoda rozptylov)</h5>
          </div>
          <p className="mb-1">
            Rozptyly v jednotlivých skupinách by mali byť približne rovnaké.
          </p>
          <small className="text-muted">
            Overenie: Leveneho test, Bartlettov test.
          </small>
        </div>
      </div>

      <div className="mt-4 p-3 border-start border-warning border-4 bg-light">
        <strong>Čo ak nie sú splnené?</strong> Ak je výrazne narušená normalita
        alebo homoskedasticita, používame neparametrickú alternatívu:{" "}
        <strong>Kruskal-Wallisov test</strong>.
      </div>
    </section>
  );
};

export default AssumptionViolations;
