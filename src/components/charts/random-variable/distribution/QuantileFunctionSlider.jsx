// src/components/charts/random-variable/distribution/QuantileFunctionSlider.jsx
import React, { useState, useEffect, useMemo } from "react";
import { ReferenceLine } from "recharts";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import DataPreviewTable from "../../helpers/DataPreviewTable";
import StatsBadge from "../../../content/helpers/StatsBadge";
import useDebouncedValue from "../../../../hooks/useDebouncedValue";

const QuantileFunctionSlider = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [error, setError] = useState(null);

  const [activeMode, setActiveMode] = useState("slider");
  const [sliderP, setSliderP] = useState(25);

  const [inputX, debouncedInputX, setInputX] = useDebouncedValue("", 0);
  const [hoverX, setHoverX] = useState(null);

  const csvUrl = `${import.meta.env.BASE_URL}data/World_HCI.csv`;

  // Vlastný CSV parser na nahradenie PapaParse
  useEffect(() => {
    fetch(csvUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Chyba siete pri sťahovaní CSV");
        return res.text();
      })
      .then((csvText) => {
        const parseCsvLine = (line) => {
          const result = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
              inQuotes = !inQuotes;
            } else if (line[i] === "," && !inQuotes) {
              result.push(current.trim());
              current = "";
            } else {
              current += line[i];
            }
          }
          result.push(current.trim());
          return result;
        };

        const lines = csvText
          .split(/\r?\n/)
          .filter((line) => line.trim() !== "");
        if (lines.length < 2) throw new Error("CSV neobsahuje dáta.");

        const headers = parseCsvLine(lines[0]);
        const scoreIdx = headers.indexOf("HCI_2025");
        const nameIdx = headers.indexOf("Country.Name");

        if (scoreIdx === -1 || nameIdx === -1) {
          throw new Error("Nesprávny formát hlavičky v CSV.");
        }

        const parsedRows = lines.slice(1).map((line) => {
          const cols = parseCsvLine(line);
          return {
            "Country.Name": cols[nameIdx] || "",
            HCI_2025: cols[scoreIdx] || "",
          };
        });

        const values = parsedRows
          .map((row) => parseFloat(row["HCI_2025"]))
          .filter((val) => !isNaN(val))
          .sort((a, b) => a - b);

        if (values.length > 0) {
          setData(values);
          const sortedRows = parsedRows
            .filter((row) => !isNaN(parseFloat(row["HCI_2025"])))
            .sort(
              (a, b) => parseFloat(a["HCI_2025"]) - parseFloat(b["HCI_2025"]),
            );
          setRawRows(sortedRows);
        } else {
          setError(
            t("components.randomVariableCharts.quantileSlider.errorNoData"),
          );
        }
      })
      .catch((err) => {
        console.error("CSV Fetch Error:", err);
        setError(
          t("components.randomVariableCharts.quantileSlider.errorFetch"),
        );
      });
  }, [t, csvUrl]);

  const tableColumns = useMemo(
    () => [
      {
        key: "Country.Name",
        label: t("components.randomVariableCharts.quantileSlider.countryCol"),
      },
      {
        key: "HCI_2025",
        label: t("components.randomVariableCharts.quantileSlider.scoreCol"),
        render: (val) => <strong>{parseFloat(val).toFixed(2)}</strong>,
      },
    ],
    [t],
  );

  const { chartData, n, minX, maxX } = useMemo(() => {
    const length = data.length;
    if (length === 0) return { chartData: [], n: 0, minX: 0, maxX: 0 };

    const allX = new Set([0, 100]);
    for (let i = 0; i < length; i++) {
      allX.add(((i + 1) / length) * 100);
    }

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

      return { x, y: quantileVal };
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
          msg: t("components.randomVariableCharts.quantileSlider.errorMin", {
            val,
            min: minX.toFixed(2),
          }),
        };
      if (val > maxX)
        return {
          p: null,
          x: null,
          msg: t("components.randomVariableCharts.quantileSlider.errorMax", {
            val,
            max: maxX.toFixed(2),
          }),
        };

      let count = 0;
      for (let i = 0; i < n; i++) {
        if (data[i] <= val) count++;
        else break;
      }
      const p = count / n;
      return { p, x: val, msg: null };
    }
  }, [n, activeMode, sliderP, debouncedInputX, data, minX, maxX, t]);

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

  const badgeItems =
    target && !target.msg
      ? [
          {
            label: t("components.randomVariableCharts.quantileSlider.badgeP"),
            value: `${(target.p * 100).toFixed(1)} %`,
            color: "text-primary",
            groupStart: true,
          },
          {
            label: t("components.randomVariableCharts.quantileSlider.badgeX"),
            value: `${target.x.toFixed(2)}`,
            color: "text-success",
            groupStart: true,
          },
        ]
      : [];

  if (error) return <div className="alert alert-danger p-4 mb-4">{error}</div>;
  if (n === 0)
    return (
      <div className="p-4 text-center">
        {t("components.randomVariableCharts.quantileSlider.loading")}
      </div>
    );

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-5 w-100"
        style={{ maxWidth: "800px" }}
      >
        <div className="d-flex flex-column align-items-center flex-grow-1">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t("components.randomVariableCharts.quantileSlider.labelP")}
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
            {t("components.randomVariableCharts.quantileSlider.labelX")}
          </label>
          <input
            type="number"
            className="form-control text-center shadow-sm"
            value={inputX}
            onChange={(e) => {
              setInputX(e.target.value);
              setActiveMode("input");
            }}
            placeholder={
              target?.x != null
                ? target.x.toFixed(2).replace(".", ",")
                : t(
                    "components.randomVariableCharts.quantileSlider.placeholder",
                  )
            }
            step="any"
            style={{ maxWidth: "150px" }}
          />
        </div>
      </div>

      <div
        className="w-100 mb-4 text-center"
        style={{ maxWidth: "800px", minHeight: "40px" }}
      >
        {target?.msg && (
          <div className="text-danger fw-bold" style={{ fontSize: "0.95rem" }}>
            {target.msg}
          </div>
        )}

        {target && !target.msg && <StatsBadge items={badgeItems} />}
      </div>

      <h6 className="mb-3 text-center">
        {t("components.randomVariableCharts.quantileSlider.title")}
      </h6>

      <div
        className="charts-wrapper w-100 mx-auto mb-5"
        style={{ maxWidth: "800px" }}
      >
        <StyledLineChart
          data={chartData}
          xLabel="p (%)"
          yLabel="HCI+"
          lineType="stepBefore"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={0}
          maxX={100}
          yAxisDomain={[0, 325]}
        >
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

      <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <DataPreviewTable
          data={rawRows}
          columns={tableColumns}
          title={t(
            "components.randomVariableCharts.quantileSlider.dataTableTitle",
          )}
          previewRows={5}
          originalFileUrl={csvUrl}
          originalFileName="World_HCI.csv"
        />
      </div>
    </div>
  );
};

export default QuantileFunctionSlider;
