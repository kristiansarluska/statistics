// src/components/charts/CSVDistributions.jsx
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import StyledLineChart from "./StyledLineChart";

function CSVDistributions() {
  const [rawData, setRawData] = useState([]); // <- Zmena: Uložíme celé riadky
  const [headers, setHeaders] = useState([]); // <- Nový stav: Pre hlavičky
  const [pdfData, setPdfData] = useState([]);
  const [cdfData, setCdfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverX, setHoverX] = useState(null);

  const CSV_PATH = "/statistics/data/CapitalPopulationShare.csv";
  const COLUMN_NAME = "2024"; // Stále používame pre grafy
  const NUM_BINS = 20;

  useEffect(() => {
    Papa.parse(CSV_PATH, {
      download: true,
      header: true,
      skipEmptyLines: true, // <- Pridané: Ignoruje prázdne riadky
      complete: (results) => {
        // Uložíme hlavičky
        if (results.meta && results.meta.fields) {
          setHeaders(results.meta.fields);
        }

        // Uložíme surové dáta
        setRawData(results.data);

        // --- Spracovanie pre grafy (zostáva podobné) ---
        const values = results.data
          .map((row) => parseFloat(row[COLUMN_NAME]))
          .filter((v) => !isNaN(v))
          .sort((a, b) => a - b);

        if (values.length === 0) {
          console.error(
            `CSV neobsahuje platné čísla v stĺpci '${COLUMN_NAME}'.`
          );
          setLoading(false);
          return;
        }

        // PDF (histogram) - logika zostáva
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binWidth = (max - min) / NUM_BINS;
        const bins = Array(NUM_BINS).fill(0);
        values.forEach((v) => {
          const idx = Math.min(Math.floor((v - min) / binWidth), NUM_BINS - 1);
          bins[idx] += 1;
        });
        const pdf = bins.map((count, i) => ({
          x: parseFloat((min + binWidth * (i + 0.5)).toFixed(2)),
          y: count / values.length,
        }));
        setPdfData(pdf);

        // CDF - logika zostáva
        const n = values.length;
        const cdf = values.map((v, i) => ({
          x: v,
          y: (i + 1) / n,
        }));
        setCdfData(cdf);

        setLoading(false);
      },
      error: (err) => {
        console.error("CSV load error:", err);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <div>Načítavam údaje…</div>;
  if (!rawData.length || !headers.length)
    return <div>Dáta sa nepodarilo načítať alebo sú prázdne.</div>;

  return (
    <div>
      {/* ... Grafy zostávajú rovnaké ... */}
      <h2>Capital Population Share – {COLUMN_NAME}</h2>

      <div
        className="charts-wrapper"
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        <div style={{ flex: "1 1 400px" }}>
          <StyledLineChart
            data={pdfData}
            title="Pravdepodobnostná funkcia (PDF)"
            xLabel="x"
            yLabel="f(x)"
            lineClass="chart-line-primary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            type="pdf" // <- Pridaj type, ak ho StyledLineChart potrebuje
            // showReferenceArea={false} // <- Explicitne vypni, ak treba
          />
        </div>

        <div style={{ flex: "1 1 400px" }}>
          <StyledLineChart
            data={cdfData}
            title="Distribučná funkcia (CDF)"
            xLabel="x"
            yLabel="F(x)"
            lineClass="chart-line-secondary" // Zmenená trieda pre odlíšenie
            hoverX={hoverX}
            setHoverX={setHoverX}
            // showReferenceArea={false} // <- Explicitne vypni, ak treba
          />
        </div>
      </div>

      {/* --- Upravená Tabuľka --- */}
      <h3>Náhľad dát (prvých 10 riadkov)</h3>
      <div className="table-responsive">
        {" "}
        {/* Pridané pre responzivitu */}
        <table className="table table-striped table-bordered table-sm">
          {" "}
          {/* table-sm pre menšie padding */}
          <thead>
            <tr>
              {/* Dynamické generovanie hlavičiek */}
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Zobrazenie len prvých 10 riadkov */}
            {rawData.slice(0, 10).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Dynamické generovanie buniek pre každý stĺpec */}
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>
                    {row[header] !== undefined && row[header] !== null
                      ? row[header]
                      : "-"}
                  </td> // Zobrazí hodnotu alebo '-'
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CSVDistributions;
