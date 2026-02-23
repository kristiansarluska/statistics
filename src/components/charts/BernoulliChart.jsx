// src/components/charts/BernoulliChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "./StyledBarChart";
import "../../styles/charts.css";

const COLORS = ["var(--bs-primary)", "var(--bs-info)"];

// Odstránili sme 'p' z props
function BernoulliChart() {
  // --- Presunutý stav a handler ---
  const [bernoulliP, setBernoulliP] = useState(0.25); // Lokálny stav pre p

  const handleBernoulliPChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      setBernoulliP(value);
    }
  };
  // --- Koniec presunutého kódu ---

  const data = useMemo(
    () => [
      { x: 0, probability: 1 - bernoulliP }, // Použijeme lokálny stav bernoulliP
      { x: 1, probability: bernoulliP }, // Použijeme lokálny stav bernoulliP
    ],
    [bernoulliP],
  ); // Závislosť na lokálnom stave

  return (
    // Obalíme ovládanie a graf do jedného divu pre lepšie usporiadanie
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* --- Presunuté ovládanie (slider) --- */}
      <div className="controls mb-3">
        {" "}
        {/* Pridáme trochu medzery pod slider */}
        <label className="d-flex align-items-center">
          {" "}
          {/* Upravené pre lepšie zarovnanie */}
          Parameter p:
          <input
            type="range"
            className="form-range"
            min="0"
            max="1"
            step="0.01"
            value={bernoulliP}
            onChange={handleBernoulliPChange}
            style={{
              width: "200px",
              cursor: "pointer",
              marginLeft: "10px",
              marginRight: "10px",
              verticalAlign: "middle",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              minWidth: "40px",
              textAlign: "right",
            }}
          >
            {bernoulliP.toFixed(2)}
          </span>
        </label>
      </div>
      {/* --- Koniec presunutého ovládania --- */}

      {/* Samotný graf */}
      <div
        className="chart-container"
        style={{ width: "100%", minWidth: "250px", maxWidth: "400px" }}
      >
        <div className="chart-title text-center">
          Alternatívne (Bernoulliho) rozdelenie
        </div>{" "}
        {/* Pridané text-center */}
        <StyledBarChart
          data={data}
          yDataKey="probability"
          xLabel="x"
          yLabel="P(X=x)"
          yDomain={[0, 1]}
          barSize={60}
          colors={["var(--bs-primary)", "var(--bs-info)"]}
        />
      </div>
    </div>
  );
}

export default BernoulliChart;
