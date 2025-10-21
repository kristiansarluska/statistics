// src/components/charts/BernoulliChart.jsx
import React, { useState, useMemo } from "react"; // Pridaj useState
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Cell,
} from "recharts";
import "../../styles/charts.css";

// Tooltip formatter zostáva rovnaký
const renderTooltipContent = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "5px 10px",
          border: "1px solid #ccc",
          borderRadius: "3px",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ margin: 0 }}>{`Hodnota (x): ${label}`}</p>
        <p
          style={{ margin: 0, color: payload[0].color }}
        >{`P(X=x): ${data.probability.toFixed(3)}`}</p>
      </div>
    );
  }
  return null;
};

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
    [bernoulliP]
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
            barGap={10}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" interval={0} tick={{ fontSize: 12 }}>
              <Label value="Hodnota (x)" offset={-20} position="insideBottom" />
            </XAxis>
            <YAxis domain={[0, 1]} tick={{ fontSize: 12 }}>
              <Label
                value="Pravdepodobnosť P(X=x)"
                angle={-90}
                position="insideLeft"
                offset={-10}
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip
              content={renderTooltipContent}
              cursor={{ fill: "rgba(206, 206, 206, 0.2)" }}
            />
            <Bar dataKey="probability" barSize={60}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BernoulliChart;
