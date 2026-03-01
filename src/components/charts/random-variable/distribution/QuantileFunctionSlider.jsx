// src/components/charts/random-variable/quantile-function/QuantileFunctionSlider.jsx
import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { ReferenceLine } from "recharts";
import StyledLineChart from "../../helpers/StyledLineChart";
import BackgroundArea from "../../helpers/BackgroundArea";
import useDebouncedValue from "../../../../hooks/useDebouncedValue";

const QuantileFunctionSlider = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [activeMode, setActiveMode] = useState("slider");
  const [sliderP, setSliderP] = useState(50);

  const [inputX, debouncedInputX, setInputX] = useDebouncedValue("", 0);
  const [hoverX, setHoverX] = useState(null);

  useEffect(() => {
    const csvUrl = `${import.meta.env.BASE_URL}data/CapitalPopulationShare.csv`;

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const values = results.data
          .map((row) => parseFloat(row["2024"]))
          .filter((val) => !isNaN(val))
          .sort((a, b) => a - b);

        if (values.length > 0) {
          setData(values);
        } else {
          setError(
            "CSV sa načítalo, ale nenašli sa v ňom platné číselné dáta pre stĺpec '2024'.",
          );
        }
      },
      error: (err) => {
        console.error("PapaParse chyba:", err);
        setError("Nepodarilo sa stiahnuť alebo spracovať CSV súbor.");
      },
    });
  }, []);

  // Opravená zjednotená logika z predchádzajúcich úprav pre bezproblémový hover
  const { chartData, n, minX, maxX } = useMemo(() => {
    const length = data.length;
    if (length === 0) return { chartData: [], n: 0, minX: 0, maxX: 0 };

    const allX = new Set([0, 100]);
    data.forEach((val, idx) => {
      allX.add(((idx + 1) / length) * 100);
      allX.add(val);
    });

    const sortedX = Array.from(allX).sort((a, b) => a - b);

    const mergedData = sortedX.map((x) => {
      const exactK = (x / 100) * length;
      const k = Math.round(exactK);
      const isIntegerK = Math.abs(exactK - k) < 1e-9;

      let quantileVal;
      if (x === 0) {
        quantileVal = data[0];
      } else if (isIntegerK && k > 0 && k < length) {
        quantileVal = (data[k - 1] + data[k]) / 2;
      } else {
        const idx = Math.ceil(exactK) - 1;
        quantileVal = data[Math.min(Math.max(idx, 0), length - 1)];
      }

      let count = 0;
      for (let i = 0; i < length; i++) {
        if (data[i] <= x) count++;
        else break;
      }
      const cdfY = (count / length) * 100;

      return { x, y: quantileVal, cdfY };
    });

    return {
      chartData: mergedData,
      n: length,
      minX: data[0],
      maxX: data[length - 1],
    };
  }, [data]);

  const target = useMemo(() => {
    if (n === 0) return null;

    if (activeMode === "slider") {
      const p = sliderP / 100;
      if (p === 0) return { p: 0, x: minX, msg: null };

      const exactK = p * n;
      const isIntegerK = Math.abs(exactK - Math.round(exactK)) < 1e-9;
      const k = Math.round(exactK);

      let val;
      if (isIntegerK && k > 0 && k < n) {
        val = (data[k - 1] + data[k]) / 2;
      } else {
        const idx = Math.ceil(exactK) - 1;
        val = data[idx];
      }
      return { p, x: val, msg: null };
    } else if (activeMode === "input") {
      const val = parseFloat(debouncedInputX);
      if (isNaN(val)) return null;

      if (val < minX)
        return {
          p: null,
          x: null,
          msg: `Zadaná hodnota (${val}) je nižšia ako minimum v dátach (${minX.toFixed(2)}).`,
        };
      if (val > maxX)
        return {
          p: null,
          x: null,
          msg: `Zadaná hodnota (${val}) prekračuje maximum v dátach (${maxX.toFixed(2)}).`,
        };

      let count = 0;
      for (let i = 0; i < n; i++) {
        if (data[i] <= val) count++;
        else break;
      }
      const p = count / n;
      return { p, x: val, msg: null };
    }
  }, [n, activeMode, sliderP, debouncedInputX, data, minX, maxX]);

  const currentSliderValue =
    activeMode === "slider"
      ? sliderP
      : target?.p != null
        ? Math.round(target.p * 100)
        : sliderP;
  const displayPercentage =
    activeMode === "input" && target?.p != null
      ? (target.p * 100).toFixed(1)
      : currentSliderValue;

  if (error) return <div className="alert alert-danger p-4 mb-4">{error}</div>;
  if (n === 0)
    return <div className="p-4 text-center">Načítavam dáta z CSV...</div>;

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      {/* Ovládacie prvky pre slider a input (pôvodný flex layout) */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-5 w-100"
        style={{ maxWidth: "800px" }}
      >
        <div className="d-flex flex-column align-items-center flex-grow-1">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            Zobraziť podľa kvantilu (p):
            {/* Pridaná fixná šírka, aby slider neskákal */}
            <span
              className="text-primary d-inline-block text-start ms-1"
              style={{ width: "45px" }}
            >
              {displayPercentage}%
            </span>
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="100"
            step="1"
            value={currentSliderValue}
            onChange={(e) => {
              setSliderP(Number(e.target.value));
              setActiveMode("slider");
              setInputX("");
            }}
            style={{ maxWidth: "250px" }}
          />
        </div>

        <div className="d-flex flex-column align-items-center flex-grow-1">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            Alebo zadaj konkrétnu hodnotu (x):
          </label>
          <input
            type="number"
            className="form-control text-center shadow-sm"
            value={inputX}
            onChange={(e) => {
              let val = e.target.value;
              if (
                inputX === "" &&
                target?.x != null &&
                e.nativeEvent.data == null &&
                val !== ""
              ) {
                const direction = parseFloat(val) > 0 ? 1 : -1;
                val = String((target.x + direction).toFixed(2));
              }
              setInputX(val);
              setActiveMode("input");
            }}
            placeholder={
              target?.x != null
                ? target.x.toFixed(2).replace(".", ",")
                : "napr. 25,5"
            }
            step="any"
            style={{ maxWidth: "150px" }}
          />
        </div>
      </div>

      {/* Zobrazenie výsledku s fixnou šírkou pre čísla */}
      <div
        className="w-100 mb-4 text-center"
        style={{ maxWidth: "800px", minHeight: "40px" }}
      >
        {target?.msg && (
          <div className="text-danger fw-bold" style={{ fontSize: "0.95rem" }}>
            {target.msg}
          </div>
        )}
        {target && !target.msg && (
          <div
            className="px-4 py-2 rounded-pill bg-body-tertiary border shadow-sm d-inline-block"
            style={{ fontSize: "0.95rem" }}
          >
            <span className="text-muted me-2">Výsledok:</span>
            Pravdepodobnosti
            <strong
              className="text-primary d-inline-block text-start ms-1"
              style={{ width: "75px" }}
            >
              p = {(target.p * 100).toFixed(1)} %
            </strong>{" "}
            zodpovedá hodnota
            <strong
              className="text-primary d-inline-block text-start ms-1"
              style={{ width: "85px" }}
            >
              x = {target.x.toFixed(2)} %
            </strong>
          </div>
        )}
      </div>

      {/* Graf */}
      <div
        className="charts-wrapper w-100 mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <h6 className="mb-3 text-center">
          Kvantilová funkcia: Podiel populácie hlavného mesta (Real data)
        </h6>
        <StyledLineChart
          data={chartData}
          xLabel="p (%)"
          yLabel="x (%)"
          lineType="stepBefore"
          type="cdf"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={0}
          maxX={100}
          yAxisDomain={[0, 100]}
        >
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: 100, y: 100 },
            ]}
            stroke="var(--bs-secondary)"
            strokeDasharray="3 3"
            opacity={0.5}
          />
          <BackgroundArea
            dataKey="cdfY"
            type="stepAfter"
            color="var(--bs-gray-400)"
            fillOpacity={0.05}
            strokeWidth={1}
          />

          {target && !target.msg && (
            <>
              <ReferenceLine
                x={target.p * 100}
                stroke="var(--bs-success)"
                strokeWidth={1}
                opacity={0.8}
              />
              <ReferenceLine
                y={target.x}
                stroke="var(--bs-success)"
                strokeWidth={1}
                opacity={0.8}
              />
            </>
          )}
        </StyledLineChart>
      </div>
    </div>
  );
};

export default QuantileFunctionSlider;
