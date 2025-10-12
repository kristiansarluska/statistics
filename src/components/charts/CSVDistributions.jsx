import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import StyledLineChart from "./StyledLineChart";

function CSVDistributions() {
  const [data, setData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [cdfData, setCdfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverX, setHoverX] = useState(null);

  const CSV_PATH = "/statistics/data/CapitalPopulationShare.csv"; // súbor v public/data/
  const COLUMN_NAME = "2024";
  const NUM_BINS = 20;

  useEffect(() => {
    Papa.parse(CSV_PATH, {
      download: true,
      header: true,
      complete: (results) => {
        const values = results.data
          .map((row) => parseFloat(row[COLUMN_NAME]))
          .filter((v) => !isNaN(v))
          .sort((a, b) => a - b);

        if (values.length === 0) {
          console.error("CSV neobsahuje žiadne platné čísla.");
          setLoading(false);
          return;
        }

        setData(values.map((v) => ({ value: v })));

        // PDF (histogram)
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

        // CDF
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
            xLabel="Hodnota"
            yLabel="Pravdepodobnosť"
            lineClass="chart-line-primary"
            hoverX={hoverX}
            setHoverX={setHoverX}
          />
        </div>

        <div style={{ flex: "1 1 400px" }}>
          <StyledLineChart
            data={cdfData}
            title="Distribučná funkcia (CDF)"
            xLabel="Hodnota"
            yLabel="Kumulatívna pravdepodobnosť"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
          />
        </div>
      </div>

      <h3>Náhľad dát</h3>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Hodnota</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CSVDistributions;
