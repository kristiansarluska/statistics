// src/components/content/helpers/DataInputControl.jsx
import React, { useState } from "react";
import ResetButton from "../../charts/helpers/ResetButton";

function DataInputControl({
  data,
  onAdd,
  onRemove,
  onReset,
  isDefault,
  placeholder = "Hodnota",
  step = "any",
}) {
  const [inputValue, setInputValue] = useState("");
  const [hoveredRemoveIdx, setHoveredRemoveIdx] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    const val = parseFloat(inputValue.replace(",", "."));
    if (!isNaN(val)) {
      onAdd(val);
      setInputValue("");
    }
  };

  return (
    <div className="w-100">
      {/* Zoznam hodnôt */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        {data.map((val, idx) => {
          const isHovered = hoveredRemoveIdx === idx;
          const btnClass = isHovered
            ? "btn-danger text-white"
            : "btn-outline-secondary";

          return (
            <button
              key={idx}
              type="button"
              className={`btn btn-sm rounded-pill ${btnClass}`}
              style={{
                fontSize: "0.85rem",
                transition: "all 0.2s",
                textDecoration: isHovered ? "line-through" : "none",
              }}
              onClick={() => onRemove(idx)}
              onMouseEnter={() => setHoveredRemoveIdx(idx)}
              onMouseLeave={() => setHoveredRemoveIdx(null)}
              title="Kliknutím odstrániš"
            >
              {val}
            </button>
          );
        })}
        {data.length === 0 && (
          <span className="text-muted small">Žiadne dáta...</span>
        )}
      </div>

      {/* Vstupný formulár s Resetom hneď vedľa tlačidla */}
      <form
        onSubmit={handleAdd}
        className="controls d-flex flex-wrap align-items-center gap-2 m-0"
      >
        <input
          type="number"
          step={step}
          className="form-control"
          style={{ width: "120px" }}
          placeholder={placeholder}
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-info text-white rounded-pill text-nowrap"
        >
          Pridať
        </button>
        <ResetButton onClick={onReset} disabled={isDefault} />
      </form>
    </div>
  );
}

export default DataInputControl;
