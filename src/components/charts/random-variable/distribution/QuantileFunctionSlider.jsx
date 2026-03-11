// src/components/charts/random-variable/distribution/QuantileFunctionSlider.jsx
import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { ReferenceLine } from "recharts";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import BackgroundArea from "../../helpers/BackgroundArea";
import DataPreviewTable from "../../helpers/DataPreviewTable";
import useDebouncedValue from "../../../../hooks/useDebouncedValue";

const QuantileFunctionSlider = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [error, setError] = useState(null);

  const [activeMode, setActiveMode] = useState("slider");
  const [sliderP, setSliderP] = useState(50);

  const [inputX, debouncedInputX, setInputX] = useDebouncedValue("", 0);
  const [hoverX, setHoverX] = useState(null);

  const csvUrl = `${import.meta.env.BASE_URL}data/CapitalPopulationShare.csv`;

  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Extrakcia číselných hodnôt pre výpočty grafu
        const values = results.data
          .map((row) => parseFloat(row["2024"]))
          .filter((val) => !isNaN(val))
          .sort((a, b) => a - b);

        if (values.length > 0) {
          setData(values);
          // Uložíme si riadky, pričom ich zoradíme podľa hodnoty podielu (vzostupne)
          const sortedRows = [...results.data]
            .filter((row) => !isNaN(parseFloat(row["2024"])))
            .sort((a, b) => parseFloat(a["2024"]) - parseFloat(b["2024"]));
          setRawRows(sortedRows);
        } else {
          setError(
            t("components.randomVariableCharts.quantileSlider.errorNoData"),
          );
        }
      },
      error: (err) => {
        console.error("PapaParse chyba:", err);
        setError(
          t("components.randomVariableCharts.quantileSlider.errorFetch"),
        );
      },
    });
  }, [t, csvUrl]);

  // Definícia stĺpcov pre tabuľku - upravený kľúč na Country_Name
  const tableColumns = useMemo(
    () => [
      {
        key: "Country_Name",
        label: t("components.randomVariableCharts.quantileSlider.countryCol"),
      },
      {
        key: "2024",
        label: t("components.randomVariableCharts.quantileSlider.shareCol"),
        render: (val) => <strong>{parseFloat(val).toFixed(2)} %</strong>,
      },
    ],
    [t],
  );

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
        {target && !target.msg && (
          <div
            className="px-4 py-2 rounded-pill bg-body-tertiary border shadow-sm d-inline-block text-nowrap"
            style={{ fontSize: "0.95rem" }}
          >
            <span className="text-muted me-2">
              {t("components.randomVariableCharts.quantileSlider.resultLabel")}
            </span>
            {t("components.randomVariableCharts.quantileSlider.resultProb")}
            <strong
              className="text-primary d-inline-block text-start ms-1 text-nowrap"
              style={{ width: "85px" }}
            >
              p = {(target.p * 100).toFixed(1)} %
            </strong>{" "}
            {t(
              "components.randomVariableCharts.quantileSlider.resultCorresponds",
            )}
            <strong
              className="text-primary d-inline-block text-start ms-1 text-nowrap"
              style={{ width: "100px" }}
            >
              x = {target.x.toFixed(2)} %
            </strong>
          </div>
        )}
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

      <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <DataPreviewTable
          data={rawRows}
          columns={tableColumns}
          title={t(
            "components.randomVariableCharts.quantileSlider.dataTableTitle",
          )}
          previewRows={5}
          downloadUrl={csvUrl}
          downloadFilename="CapitalPopulationShare.csv"
        />
      </div>
    </div>
  );
};

export default QuantileFunctionSlider;
