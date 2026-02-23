// src/components/charts/CSVDistributions.jsx
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import StyledLineChart from "./StyledLineChart";

function CSVDistributions() {
  const [rawData, setRawData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [cdfData, setCdfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverX, setHoverX] = useState(null);

  const CSV_PATH = "/statistics/data/CapitalPopulationShare.csv";
  const COLUMN_NAME = "2024";
  const NUM_BINS = 20;

  useEffect(() => {
    Papa.parse(CSV_PATH, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta && results.meta.fields) {
          setHeaders(results.meta.fields);
        }

        setRawData(results.data);

        const values = results.data
          .map((row) => parseFloat(row[COLUMN_NAME]))
          .filter((v) => !isNaN(v))
          .sort((a, b) => a - b);

        if (values.length === 0) {
          console.error(
            `CSV neobsahuje platné čísla v stĺpci '${COLUMN_NAME}'.`,
          );
          setLoading(false);
          return;
        }

        const min = Math.min(...values);
        const max = Math.max(...values);
        const binWidth = (max - min) / NUM_BINS;
        const bins = Array(NUM_BINS).fill(0);

        values.forEach((v) => {
          const idx = Math.min(Math.floor((v - min) / binWidth), NUM_BINS - 1);
          bins[idx] += 1;
        });

        const pdf = bins.map((count, i) => ({
          x: min + binWidth * (i + 0.5), // Presná hodnota X (bez zaokrúhľovania)
          y: count / values.length,
        }));
        setPdfData(pdf);

        const n = values.length;
        const cdf = values.map((v, i) => ({
          x: v, // Pôvodná hodnota z dátového setu je už číslo
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
            type="pdf"
          />
        </div>

        <div style={{ flex: "1 1 400px" }}>
          <StyledLineChart
            data={cdfData}
            title="Distribučná funkcia (CDF)"
            xLabel="x"
            yLabel="F(x)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
          />
        </div>
      </div>

      <h3>Náhľad dát (prvých 10 riadkov)</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-sm">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rawData.slice(0, 10).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>
                    {row[header] !== undefined && row[header] !== null
                      ? row[header]
                      : "-"}
                  </td>
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
