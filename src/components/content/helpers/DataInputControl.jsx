// src/components/content/helpers/DataInputControl.jsx
import React, { useState, useEffect, useRef } from "react";
import ResetButton from "../../charts/helpers/ResetButton";

function DataInputControl({
  data,
  onAdd,
  onRemove,
  onReset,
  isDefault,
  placeholder = "Hodnota",
  step = "any",
  min,
  max,
  itemClassName,
  renderExtra,
  isWeighted = false,
  weightPlaceholder = "Váha",
  formatItem = (val) => val,
  editable = false, // Zapnutie pokročilej editácie (overlay s úpravou/zmazaním)
  onEdit, // Funkcia (idx, newValue) => void
}) {
  const [inputValue, setInputValue] = useState("");
  const [weightValue, setWeightValue] = useState(isWeighted ? "1" : "");
  const [hoveredRemoveIdx, setHoveredRemoveIdx] = useState(null);

  // Stavy pre režim editácie
  const [activeActionIdx, setActiveActionIdx] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editX, setEditX] = useState("");
  const [editW, setEditW] = useState("");

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
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

  const handleAdd = (e) => {
    e.preventDefault();
    const val = parseFloat(inputValue.replace(",", "."));

    if (isWeighted) {
      const wVal = parseFloat(weightValue.replace(",", "."));
      if (!isNaN(val) && !isNaN(wVal) && wVal > 0) {
        if (min !== undefined && val < min) return;
        if (max !== undefined && val > max) return;

        onAdd({ x: val, w: wVal });
        setInputValue("");
        setWeightValue("1");
      }
    } else {
      if (!isNaN(val)) {
        if (min !== undefined && val < min) return;
        if (max !== undefined && val > max) return;

        onAdd(val);
        setInputValue("");
      }
    }
  };

  const handleSaveEdit = (e, idx) => {
    e.preventDefault();
    const xVal = parseFloat(editX.replace(",", "."));

    if (isWeighted) {
      const wVal = parseFloat(editW.replace(",", "."));
      if (!isNaN(xVal) && !isNaN(wVal) && wVal > 0) {
        if (min !== undefined && xVal < min) return;
        if (max !== undefined && xVal > max) return;
        onEdit(idx, { x: xVal, w: wVal });
        setEditingIdx(null);
      }
    } else {
      if (!isNaN(xVal)) {
        if (min !== undefined && xVal < min) return;
        if (max !== undefined && xVal > max) return;
        onEdit(idx, xVal);
        setEditingIdx(null);
      }
    }
  };

  return (
    <div className="w-100">
      <div
        ref={containerRef}
        className="d-flex flex-wrap gap-2 mb-3 align-items-center"
        style={{ minHeight: "38px" }}
      >
        {data.map((item, idx) => {
          const isEditing = editable && editingIdx === idx;
          const isActiveAction = editable && activeActionIdx === idx;
          const isHovered = !editable && hoveredRemoveIdx === idx;

          let btnClass = "btn-outline-secondary text-body";

          if (itemClassName) {
            const customClass = itemClassName(item, idx);
            if (customClass) btnClass = customClass;
          }

          if (isHovered) {
            btnClass = "btn-danger text-white";
          }

          return (
            <React.Fragment key={idx}>
              <div
                className="position-relative d-inline-flex"
                onMouseEnter={() => {
                  if (!editable) setHoveredRemoveIdx(idx);
                  else if (!isTouchDevice && !isEditing)
                    setActiveActionIdx(idx);
                }}
                onMouseLeave={() => {
                  if (!editable) setHoveredRemoveIdx(null);
                  else if (!isTouchDevice) setActiveActionIdx(null);
                }}
              >
                {isEditing ? (
                  <form
                    className="d-inline-flex align-items-center gap-1 bg-body-tertiary border rounded-pill p-1 shadow-sm m-0"
                    onSubmit={(e) => handleSaveEdit(e, idx)}
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
                    {isWeighted && (
                      <>
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
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
                      </>
                    )}
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
                      onClick={() => setEditingIdx(null)}
                      title="Zrušiť"
                    >
                      <span style={{ fontSize: "0.75rem" }}>✕</span>
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill shadow-sm ${btnClass}`}
                      style={{
                        fontSize: "0.85rem",
                        transition: "all 0.2s",
                        textDecoration: isHovered ? "line-through" : "none",
                        opacity: isActiveAction ? 0 : 1, // Skryje základné tlačidlo pod overlayom
                      }}
                      onClick={() => {
                        if (!editable) onRemove(idx);
                        else if (isTouchDevice)
                          setActiveActionIdx(isActiveAction ? null : idx);
                      }}
                      title={
                        isTouchDevice && editable
                          ? "Kliknutím zobrazíš možnosti"
                          : !editable
                            ? "Kliknutím odstrániš"
                            : ""
                      }
                    >
                      {formatItem(item)}
                    </button>

                    {isActiveAction && (
                      <div className="btn-group shadow-sm rounded-pill overflow-hidden position-absolute top-0 start-0 w-100 h-100">
                        <button
                          type="button"
                          className="btn btn-warning d-flex align-items-center justify-content-center w-50 p-0 border-0"
                          style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}
                          onClick={() => {
                            setEditingIdx(idx);
                            setEditX(
                              isWeighted ? String(item.x) : String(item),
                            );
                            if (isWeighted) setEditW(String(item.w));
                            setActiveActionIdx(null);
                          }}
                          title="Editovať"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger text-white d-flex align-items-center justify-content-center w-50 p-0 border-0"
                          onClick={() => {
                            onRemove(idx);
                            setActiveActionIdx(null);
                          }}
                          title="Zmazať"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              {renderExtra && renderExtra(item, idx)}
            </React.Fragment>
          );
        })}
        {data.length === 0 && (
          <span className="text-muted small">Žiadne dáta...</span>
        )}
      </div>

      <form
        onSubmit={handleAdd}
        className="controls d-flex flex-wrap align-items-center gap-2 m-0"
      >
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          className="form-control"
          style={{ width: "135px" }}
          placeholder={placeholder}
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {isWeighted && (
          <input
            type="number"
            step={step}
            min="0.1"
            className="form-control"
            style={{ width: "90px" }}
            placeholder={weightPlaceholder}
            required
            title="Váha (musí byť > 0)"
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
          />
        )}
        <button
          type="submit"
          className="btn btn-info fw-bold rounded-pill text-nowrap px-3 shadow-sm"
          style={{ color: "var(--bs-body-bg)" }}
        >
          Pridať
        </button>
        <ResetButton onClick={onReset} disabled={isDefault} />
      </form>
    </div>
  );
}

export default DataInputControl;
