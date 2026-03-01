// src/components/content/characteristics/WeightedMeanCalc.jsx
import React, { useState, useEffect, useRef } from "react";
import { InlineMath, BlockMath } from "react-katex";
import ResetButton from "../../charts/helpers/ResetButton";
import "katex/dist/katex.min.css";

function WeightedMeanCalc() {
  const DEFAULT_DATA = [
    { x: 420.15, w: 3 },
    { x: 420.18, w: 1 },
    { x: 420.12, w: 2 },
  ];
  const [measurements, setMeasurements] = useState(DEFAULT_DATA);
  const [inputX, setInputX] = useState("");
  const [inputW, setInputW] = useState("");

  const [activeActionIdx, setActiveActionIdx] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editX, setEditX] = useState("");
  const [editW, setEditW] = useState("");

  const badgesContainerRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detekcia dotykového zariadenia a sledovanie kliknutia mimo
  useEffect(() => {
    // Overenie, či prehliadač podporuje dotyk
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const handleClickOutside = (event) => {
      if (
        badgesContainerRef.current &&
        !badgesContainerRef.current.contains(event.target)
      ) {
        setActiveActionIdx(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const isDefault =
    measurements.length === DEFAULT_DATA.length &&
    measurements.every(
      (m, idx) => m.x === DEFAULT_DATA[idx].x && m.w === DEFAULT_DATA[idx].w,
    );

  const handleAdd = (e) => {
    e.preventDefault();
    const xVal = parseFloat(inputX.replace(",", "."));
    const wVal = parseFloat(inputW.replace(",", "."));

    if (!isNaN(xVal) && !isNaN(wVal) && wVal > 0) {
      setMeasurements([...measurements, { x: xVal, w: wVal }]);
      setInputX("");
      setInputW("1");
    }
  };

  const handleRemove = (indexToRemove) => {
    setMeasurements(measurements.filter((_, idx) => idx !== indexToRemove));
    setActiveActionIdx(null);
  };

  const handleReset = () => {
    setMeasurements([...DEFAULT_DATA]);
    setEditingIdx(null);
    setActiveActionIdx(null);
  };

  const startEdit = (idx, m) => {
    setEditingIdx(idx);
    setEditX(String(m.x));
    setEditW(String(m.w));
    setActiveActionIdx(null);
  };

  const saveEdit = (idx) => {
    const xVal = parseFloat(editX.replace(",", "."));
    const wVal = parseFloat(editW.replace(",", "."));
    if (!isNaN(xVal) && !isNaN(wVal) && wVal > 0) {
      const newMeasurements = [...measurements];
      newMeasurements[idx] = { x: xVal, w: wVal };
      setMeasurements(newMeasurements);
      setEditingIdx(null);
    }
  };

  const cancelEdit = () => {
    setEditingIdx(null);
  };

  const n = measurements.length;
  const sumW = measurements.reduce((acc, m) => acc + m.w, 0);
  const sumWX = measurements.reduce((acc, m) => acc + m.x * m.w, 0);
  const weightedMean = sumW > 0 ? sumWX / sumW : 0;

  const numString = measurements
    .map((m) => `(${m.w} \\cdot ${m.x})`)
    .join(" + ");
  const denString = measurements.map((m) => m.w).join(" + ");

  return (
    <div
      className="chart-with-controls-container d-flex flex-column mb-4 w-100 mx-auto"
      style={{ maxWidth: "800px" }}
    >
      <h6 className="mb-4 text-center">
        Vážený priemer nadmorskej výšky (podľa presnosti)
      </h6>

      <div className="w-100 mb-4">
        <h6 className="mb-3" style={{ fontSize: "0.95rem" }}>
          Namerané hodnoty a ich váhy:
        </h6>

        <div
          ref={badgesContainerRef}
          className="d-flex flex-wrap gap-2 mb-3 align-items-center"
          style={{ minHeight: "38px" }}
        >
          {measurements.map((m, idx) => {
            const isEditing = editingIdx === idx;
            const isActiveAction = activeActionIdx === idx;

            return (
              <div
                key={idx}
                className="position-relative d-inline-flex"
                // Hover aktivujeme iba na zariadeniach s myšou
                onMouseEnter={() => {
                  if (!isTouchDevice && !isEditing) setActiveActionIdx(idx);
                }}
                onMouseLeave={() => {
                  if (!isTouchDevice) setActiveActionIdx(null);
                }}
              >
                {isEditing ? (
                  <form
                    className="d-inline-flex align-items-center gap-1 bg-body-tertiary border rounded-pill p-1 shadow-sm m-0"
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveEdit(idx);
                    }}
                  >
                    <input
                      type="number"
                      step="any"
                      className="form-control form-control-sm rounded-pill text-center px-2"
                      style={{
                        width: "80px",
                        fontSize: "0.85rem",
                        height: "28px",
                      }}
                      value={editX}
                      onChange={(e) => setEditX(e.target.value)}
                      required
                    />
                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                      v:
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      className="form-control form-control-sm rounded-pill text-center px-2"
                      style={{
                        width: "60px",
                        fontSize: "0.85rem",
                        height: "28px",
                      }}
                      value={editW}
                      onChange={(e) => setEditW(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-sm btn-success rounded-circle p-0 ms-1 d-flex align-items-center justify-content-center"
                      style={{ width: "24px", height: "24px" }}
                      title="Uložiť"
                    >
                      <span style={{ fontSize: "0.75rem" }}>✓</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: "24px", height: "24px" }}
                      onClick={cancelEdit}
                      title="Zrušiť"
                    >
                      <span style={{ fontSize: "0.75rem" }}>✕</span>
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill"
                      style={{
                        fontSize: "0.85rem",
                        opacity: isActiveAction ? 0 : 1,
                      }}
                      // Kliknutie reaguje iba na dotykových zariadeniach
                      onClick={() => {
                        if (isTouchDevice)
                          setActiveActionIdx(isActiveAction ? null : idx);
                      }}
                      title={isTouchDevice ? "Kliknutím zobrazíš možnosti" : ""}
                    >
                      {m.x} m{" "}
                      <span className="opacity-75 ms-1">(v: {m.w})</span>
                    </button>

                    {isActiveAction && (
                      <div className="btn-group shadow-sm rounded-pill overflow-hidden position-absolute top-0 start-0 w-100 h-100">
                        <button
                          type="button"
                          className="btn btn-warning d-flex align-items-center justify-content-center w-50 p-0 border-0"
                          style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}
                          onClick={() => startEdit(idx, m)}
                          title="Editovať"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger text-white d-flex align-items-center justify-content-center w-50 p-0 border-0"
                          onClick={() => handleRemove(idx)}
                          title="Zmazať"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
          {n === 0 && <span className="text-muted small">Žiadne dáta...</span>}
        </div>

        <form
          onSubmit={handleAdd}
          className="controls d-flex flex-wrap align-items-center gap-2 m-0"
        >
          <input
            type="number"
            step="any"
            className="form-control"
            style={{ width: "120px" }}
            placeholder="Hodnota (m)"
            required
            value={inputX}
            onChange={(e) => setInputX(e.target.value)}
          />
          <input
            type="number"
            step="any"
            min="0.1"
            className="form-control"
            style={{ width: "90px" }}
            placeholder="Váha"
            required
            title="Váha (musí byť > 0)"
            value={inputW}
            onChange={(e) => setInputW(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-info text-white rounded-pill text-nowrap px-3"
          >
            Pridať
          </button>
          <ResetButton onClick={handleReset} disabled={isDefault} />
        </form>
      </div>

      {n > 0 && sumW > 0 && (
        <div className="p-3 rounded-3 shadow-sm border bg-body-tertiary text-center overflow-auto w-100">
          <p className="mb-2 fw-bold text-muted" style={{ fontSize: "0.9rem" }}>
            Postup výpočtu:
          </p>
          <div className="mb-2" style={{ fontSize: "1.1rem" }}>
            <BlockMath
              math={`\\bar{x}_w = \\frac{ \\sum w_i x_i }{ \\sum w_i } = \\frac{ ${numString} }{ ${denString} }`}
            />
          </div>
          <div className="fs-5 mt-3">
            <InlineMath math={`\\bar{x}_w = `} />
            <strong className="text-primary">
              {weightedMean.toFixed(3)} m
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeightedMeanCalc;
