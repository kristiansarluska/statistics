// src/components/charts/random-variable/characteristics/FiveNumberSummaryBoxplot.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StyledBoxplot from "../../helpers/StyledBoxplot";
import DataPreviewTable from "../../helpers/DataPreviewTable";

// Farby pre jednotlivé roky z tém aplikácie
const yearColors = {
  Y1960: "var(--bs-secondary)", // Šedá
  Y1980: "var(--bs-info)", // Svetlomodrá
  Y2000: "var(--bs-primary)", // Tmavomodrá
  Y2023: "var(--bs-success)", // Zelená
};

const yearLabels = {
  Y1960: "1960",
  Y1980: "1980",
  Y2000: "2000",
  Y2023: "2023",
};

// Vlastný CSV parser na spracovanie čiarok vnútri úvodzoviek (napr. "Bahamas, The")
const parseCSV = (str) => {
  const result = [];
  let row = [],
    inQuotes = false,
    val = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) {
      row.push(val.trim());
      val = "";
    } else if (char === "\n" && !inQuotes) {
      row.push(val.trim());
      if (row.length > 1) result.push(row);
      row = [];
      val = "";
    } else if (char !== "\r") val += char;
  }
  row.push(val.trim());
  if (row.length > 1) result.push(row);
  return result;
};

const calculateStats = (values) => {
  if (!values?.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const q = (p) => {
    const pos = p * (sorted.length - 1),
      base = Math.floor(pos),
      rest = pos - base;
    return sorted[base + 1] !== undefined
      ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
      : sorted[base];
  };
  const q1 = q(0.25),
    median = q(0.5),
    q3 = q(0.75),
    iqr = q3 - q1;
  const lf = q1 - 1.5 * iqr,
    uf = q3 + 1.5 * iqr;
  const reg = sorted.filter((v) => v >= lf && v <= uf);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    q1,
    median,
    q3,
    whiskerMin: reg.length ? reg[0] : q1,
    whiskerMax: reg.length ? reg[reg.length - 1] : q3,
    outliers: sorted.filter((v) => v < lf || v > uf),
  };
};

const buildEntry = (stats, id) =>
  !stats
    ? {}
    : {
        [`color_${id}`]: yearColors[id],
        [`stats_${id}`]: stats,
        [`min_invisible_${id}`]: stats.whiskerMin,
        [`whisker_bottom_${id}`]: stats.q1 - stats.whiskerMin,
        [`box_bottom_${id}`]: stats.median - stats.q1,
        [`box_top_${id}`]: stats.q3 - stats.median,
        [`whisker_top_${id}`]: stats.whiskerMax - stats.q3,
      };

function FiveNumberSummaryBoxplot() {
  const { t } = useTranslation();

  // States
  const [groupBy, setGroupBy] = useState("Continent");
  const [selectedYears, setSelectedYears] = useState(["Y2000", "Y2023"]); // Predvolene zobrazené roky
  const [rawData, setRawData] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Definovanie pevných kategórií na zoraďovanie v grafe
  const continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  const incomeGroups = [
    "Low income",
    "Lower middle income",
    "Upper middle income",
    "High income",
    "Unclassified",
  ];

  const groupOptions = useMemo(
    () => [
      {
        value: "Continent",
        label: t(
          "components.randomVariableCharts.boxplot.groups.continent",
          "Kontinent",
        ),
      },
      {
        value: "Income.Group",
        label: t(
          "components.randomVariableCharts.boxplot.groups.incomeGroup",
          "Príjmová skupina",
        ),
      },
    ],
    [t],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/World_LifeExpectancy.csv`,
        );
        const csvText = await response.text();

        const rows = parseCSV(csvText);
        if (rows.length < 2) return;

        const allRows = [];
        const structuredRows = [];

        // Ignorujeme hlavičku (index 0)
        rows.slice(1).forEach((cols) => {
          if (cols.length < 8 || !cols[0]) return; // Preskočiť prázdne/neúplné riadky

          // Surové riadky pre DataPreviewTable
          allRows.push({
            "Country.Name": cols[0],
            "Country.Code": cols[1],
            Continent: cols[2],
            "Income.Group": cols[3],
            Y1960: cols[4],
            Y1980: cols[5],
            Y2000: cols[6],
            Y2023: cols[7],
          });

          // Dáta pre Boxplot výpočty
          structuredRows.push({
            countryName: cols[0],
            continent: cols[2],
            incomeGroup: cols[3],
            Y1960: parseFloat(cols[4]),
            Y1980: parseFloat(cols[5]),
            Y2000: parseFloat(cols[6]),
            Y2023: parseFloat(cols[7]),
          });
        });

        setRawRows(allRows);
        setRawData(structuredRows);
      } catch (err) {
        console.error("Failed to fetch Boxplot CSV:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleYear = (y) => {
    setSelectedYears((prev) => {
      if (prev.includes(y)) {
        // Nedovolí odkliknúť posledný vybraný rok
        if (prev.length === 1) return prev;
        return prev.filter((val) => val !== y);
      }
      // Zoradíme to podľa času (Y1960, Y1980...)
      return [...prev, y].sort();
    });
  };

  const activeSeries = useMemo(() => {
    return selectedYears.map((id) => ({ id, color: yearColors[id] }));
  }, [selectedYears]);

  const { chartData, scatterData } = useMemo(() => {
    if (!rawData.length) return { chartData: [], scatterData: [] };
    const sData = [];

    // Zistíme, ktorú sadu kategórií použijeme pre os X
    const categories = groupBy === "Continent" ? continents : incomeGroups;

    const cData = categories.map((cat) => {
      // Vráti preložený názov kategórie (ak existuje) inak ponechá anglický
      const translatedCat = t(
        `components.randomVariableCharts.boxplot.categories.${cat.replace(/\s+/g, "")}`,
        cat,
      );
      const entry = { label: translatedCat };

      const rows = rawData.filter((d) =>
        groupBy === "Continent" ? d.continent === cat : d.incomeGroup === cat,
      );

      activeSeries.forEach(({ id }) => {
        const vals = rows.map((d) => d[id]).filter((v) => !isNaN(v));
        const stats = calculateStats(vals);
        Object.assign(entry, buildEntry(stats, id));

        stats?.outliers.forEach((val) =>
          sData.push({
            label: entry.label,
            outlierValue: val,
            seriesId: id,
            color: yearColors[id],
          }),
        );
      });
      return entry;
    });

    return { chartData: cData, scatterData: sData };
  }, [rawData, groupBy, activeSeries, t]);

  const tableColumns = useMemo(
    () => [
      {
        key: "Country.Name",
        label: t(
          "components.randomVariableCharts.boxplot.columns.country",
          "Krajina",
        ),
      },
      {
        key: "Continent",
        label: t(
          "components.randomVariableCharts.boxplot.groups.continent",
          "Kontinent",
        ),
      },
      {
        key: "Income.Group",
        label: t(
          "components.randomVariableCharts.boxplot.groups.incomeGroup",
          "Príjmová skupina",
        ),
      },
      { key: "Y1960", label: "1960" },
      { key: "Y1980", label: "1980" },
      { key: "Y2000", label: "2000" },
      { key: "Y2023", label: "2023" },
    ],
    [t],
  );

  if (isLoading)
    return (
      <div className="p-4 text-center text-muted">
        {t(
          "components.randomVariableCharts.boxplot.loading",
          "Načítavam dáta...",
        )}
      </div>
    );

  return (
    <div className="p-3 p-md-4 rounded-3 shadow-sm border w-100">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-3">
        <h6 className="mb-0 text-nowrap">
          {t(
            "components.randomVariableCharts.boxplot.title",
            "Stredná dĺžka života pri narodení (Svetová banka)",
          )}
        </h6>
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 flex-wrap">
          {/* Prepínač zoskupenia */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted text-nowrap">
              {t(
                "components.randomVariableCharts.boxplot.groupLabel",
                "Zoskupiť podľa:",
              )}
            </span>
            <div className="btn-group shadow-sm" role="group">
              {groupOptions.map(({ value, label }, i, arr) => (
                <button
                  key={value}
                  type="button"
                  className={`btn btn-sm px-3 btn-outline-primary ${groupBy === value ? "active" : ""} ${
                    i === 0
                      ? "rounded-start-pill"
                      : i === arr.length - 1
                        ? "rounded-end-pill"
                        : ""
                  }`}
                  onClick={() => setGroupBy(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist pre roky (Multi-select) */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted text-nowrap">
              {t(
                "components.randomVariableCharts.boxplot.yearLabel",
                "Zobraziť roky:",
              )}
            </span>
            <div
              className="btn-group shadow-sm"
              role="group"
              aria-label="Výber rokov"
            >
              {["Y1960", "Y1980", "Y2000", "Y2023"].map((y, i, arr) => {
                const isActive = selectedYears.includes(y);
                return (
                  <button
                    key={y}
                    type="button"
                    className={`btn btn-sm px-2 ${isActive ? "btn-primary fw-bold" : "btn-outline-primary text-secondary"} ${
                      i === 0
                        ? "rounded-start-pill"
                        : i === arr.length - 1
                          ? "rounded-end-pill"
                          : ""
                    }`}
                    onClick={() => toggleYear(y)}
                    title={isActive ? "Skryť rok" : "Zobraziť rok"}
                  >
                    {/* Vizuálny checklist pomocou ikoniek Bootstrap */}
                    <i
                      className={`bi ${isActive ? "bi-check2-square" : "bi-square"} me-1`}
                    ></i>
                    {yearLabels[y]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legenda farieb pre zobrazené roky */}
      <div className="d-flex gap-4 mb-3 ps-1 flex-wrap border-bottom pb-3">
        {activeSeries.map(({ id, color }) => (
          <span
            key={id}
            className="small d-flex align-items-center gap-2 fw-medium"
          >
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: 3,
                background: color,
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            />
            {yearLabels[id]}
          </span>
        ))}
      </div>

      <StyledBoxplot
        chartData={chartData}
        scatterData={scatterData}
        series={activeSeries}
      />

      <p className="text-muted small mt-2 mb-0 text-center">
        {t(
          "components.randomVariableCharts.boxplot.legendNote",
          "Graf zobrazuje min/max (bez extrémov), Q1, medián a Q3. Bodky reprezentujú extrémne hodnoty (outliery).",
        )}
      </p>

      <DataPreviewTable
        data={rawRows}
        columns={tableColumns}
        title={t(
          "components.randomVariableCharts.boxplot.dataTableTitle",
          "Vstupné dáta (Stredná dĺžka života v rokoch)",
        )}
        previewRows={5}
        downloadUrl={`${import.meta.env.BASE_URL}data/World_LifeExpectancy.csv`}
        downloadFilename="World_LifeExpectancy.csv"
      />
    </div>
  );
}

export default FiveNumberSummaryBoxplot;
