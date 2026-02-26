// src/components/charts/random-variable/quantile-function/QuantileFunctionSlider.jsx
import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { ReferenceLine } from "recharts";
import StyledLineChart from "../../../charts/helpers/StyledLineChart";
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

  const { chartData, n, minX, maxX } = useMemo(() => {
    const length = data.length;
    if (length === 0) return { chartData: [], n: 0, minX: 0, maxX: 0 };

    const points = data.map((val, idx) => ({
      x: (idx + 1) / length,
      y: val,
      index: idx,
    }));

    const fullPoints = [{ x: 0, y: data[0], index: -1 }, ...points];

    return {
      chartData: fullPoints,
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

      if (val < minX) {
        return {
          p: null,
          x: null,
          msg: `Zadaná hodnota (${val}) je nižšia ako minimum v dátach (${minX.toFixed(2)}).`,
        };
      }
      if (val > maxX) {
        return {
          p: null,
          x: null,
          msg: `Zadaná hodnota (${val}) prekračuje maximum v dátach (${maxX.toFixed(2)}).`,
        };
      }

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
    <div className="card shadow-sm p-4 mb-4">
      <h5 className="mb-4">
        Kvantilová funkcia: Podiel populácie hlavného mesta (Real data)
      </h5>

      <div className="col-md-6 d-flex align-items-center gap-3">
        <div className="col-md-6">
          <label className="form-label fw-bold mb-1">
            Zobraziť podľa kvantilu (p):{" "}
            <span className="text-primary">{displayPercentage}%</span>
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

        <div className="col-md-6">
          <label className="form-label fw-bold mb-1">
            Alebo zadaj konkrétnu hodnotu (x):
          </label>
          <div className="controls d-flex gap-2">
            <input
              type="number"
              className="form-control"
              value={inputX}
              onKeyDown={(e) => {
                // Zachytenie stlačenia šípok na klávesnici pri prázdnom poli
                if (inputX === "" && target?.x != null) {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setInputX(String((target.x + 1).toFixed(2)));
                    setActiveMode("input");
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setInputX(String((target.x - 1).toFixed(2)));
                    setActiveMode("input");
                  }
                }
              }}
              onChange={(e) => {
                let val = e.target.value;
                // Zachytenie kliknutia na šípky v UI prehliadača (nativeEvent.data je null)
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
      </div>

      {target?.msg && (
        <div className="alert alert-warning py-2 px-3 mb-4" role="alert">
          {target.msg}
        </div>
      )}

      {target && !target.msg && (
        <div className="alert alert-success bg-success-subtle text-success py-2 px-3 mb-4">
          <strong>Výsledok:</strong> Pre pravdepodobnosť{" "}
          <strong>p = {target.p.toFixed(3)}</strong> je hodnota{" "}
          <strong>x = {target.x.toFixed(2)} %</strong>.
        </div>
      )}

      <div className="mb-4 w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <StyledLineChart
          data={chartData}
          xLabel="p"
          yLabel="x"
          lineType="stepBefore"
          type="cdf"
          hoverX={hoverX}
          setHoverX={setHoverX}
        >
          {target && !target.msg && (
            <>
              <ReferenceLine
                x={target.p}
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
