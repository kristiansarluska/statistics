// src/components/content/characteristics/ModeCalc.jsx
import React, { useState, useMemo } from "react";
import { Bar, Cell } from "recharts";
import StyledBarChart from "../../charts/helpers/StyledBarChart";
import DataInputControl from "../../content/helpers/DataInputControl";

// Geoinformatics-themed data: Number of floors in urban buildings
const DEFAULT_DATA = [
  1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 7, 7, 7, 7, 7, 7,
  8, 8, 12,
];

const ModeCalc = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [inputValue, setInputValue] = useState("");
  const [hoveredRemoveIdx, setHoveredRemoveIdx] = useState(null);

  const isDefault =
    data.length === DEFAULT_DATA.length &&
    data.every((val, idx) => val === DEFAULT_DATA[idx]);

  const handleReset = () => {
    setData([...DEFAULT_DATA]);
  };

  const handleAddNumber = (e) => {
    e.preventDefault();
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num > 0) {
      setData([...data, num]);
      setInputValue("");
    }
  };

  const handleRemoveNumber = (indexToRemove) => {
    setData(data.filter((_, idx) => idx !== indexToRemove));
  };

  // Výpočet frekvencií a identifikácia modusu (alebo modusov, ak je ich viac)
  const { chartData, modes, sortedData } = useMemo(() => {
    const counts = {};
    data.forEach((val) => {
      counts[val] = (counts[val] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts), 0);

    const currentModes = Object.keys(counts)
      .filter((k) => counts[k] === maxCount && maxCount > 0)
      .map(Number);

    const cData = Object.keys(counts)
      .map((k) => ({
        x: String(k),
        y: counts[k],
      }))
      .sort((a, b) => Number(a.x) - Number(b.x));

    const sorted = [...data].sort((a, b) => a - b);

    return { chartData: cData, modes: currentModes, sortedData: sorted };
  }, [data]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <h5 className="mb-4 text-center">
        Interaktívny výpočet modusu: Počet poschodí budov
      </h5>

      {/* Box so zobrazením aktuálneho modusu umiestnený nad grafom */}
      <div
        className="p-3 rounded-3 shadow-sm border bg-body-tertiary text-center w-100 mb-4"
        style={{ maxWidth: "800px" }}
      >
        <p className="mb-2 fw-bold text-muted" style={{ fontSize: "0.9rem" }}>
          Aktuálny modus:
        </p>
        <div className="fs-5 mt-2">
          {modes.length > 0 ? (
            modes.map((m, i) => (
              <span
                key={i}
                className="badge bg-info fw-bold rounded-pill mx-1 shadow-sm px-3"
              >
                {m}{" "}
                {m === 1
                  ? "poschodie"
                  : m >= 2 && m <= 4
                    ? "poschodia"
                    : "poschodí"}
              </span>
            ))
          ) : (
            <span className="text-muted text-body">Žiadne dáta</span>
          )}
        </div>
      </div>

      {/* Graf zohľadňujúci podmienené formátovanie farieb stĺpcov */}
      <div className="w-100 mb-4" style={{ maxWidth: "800px" }}>
        <StyledBarChart
          data={chartData}
          xLabel="Počet poschodí"
          yLabel="Počet budov (frekvencia)"
        >
          <Bar
            dataKey="y"
            maxBarSize={60}
            isAnimationActive={true}
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  modes.includes(Number(entry.x))
                    ? "var(--bs-info)"
                    : "var(--bs-primary)"
                }
              />
            ))}
          </Bar>
        </StyledBarChart>
      </div>
      <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
        {/* Nahradiť starý formulár a tlačidlá v ModeCalc.jsx */}
        <h6 className="mb-3 text-start" style={{ fontSize: "0.95rem" }}>
          Namerané dáta (zoradené podľa poschodí):
        </h6>
        <DataInputControl
          data={sortedData}
          onAdd={(val) => setData([...data, val])}
          onRemove={(idxToRemove) => {
            // Odstraňujeme nad už zoradenými dátami (sortedData) pre konzistentnosť indexov
            setData(sortedData.filter((_, idx) => idx !== idxToRemove));
          }}
          onReset={handleReset}
          isDefault={isDefault}
          min="1"
          step="1"
          placeholder="Nová budova"
          itemClassName={(val) =>
            modes.includes(val) ? "btn-info" : "btn-outline-secondary text-body"
          }
        />
      </div>
    </div>
  );
};

export default ModeCalc;
