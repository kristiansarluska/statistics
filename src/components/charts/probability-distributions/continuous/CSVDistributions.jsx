// src/components/charts/probability-distributions/continuous/CSVDistributions.jsx
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import StyledLineChart from "../../helpers/StyledLineChart";

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
        const n = values.length;

        // 1. KDE (Kernel Density Estimation) for a smooth PDF
        const mean = values.reduce((sum, v) => sum + v, 0) / n;
        const variance =
          values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);

        // Silverman's Rule of Thumb for optimal bandwidth
        const bandwidth = 0.5 * stdDev * Math.pow(n, -0.2);

        const kernelDensity = (x) => {
          return (
            values.reduce((sum, v) => {
              const u = (x - v) / bandwidth;
              return (
                sum + (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u)
              );
            }, 0) /
            (n * bandwidth)
          );
        };

        // 2. Generate identical 200-point grid for perfect sync
        const NUM_POINTS = 200;
        const step = (max - min) / NUM_POINTS;

        const pdf = [];
        const cdf = [];

        for (let i = 0; i <= NUM_POINTS; i++) {
          const x = i === NUM_POINTS ? max : min + i * step; // No floating-point errors at the end

          pdf.push({ x, y: kernelDensity(x) });

          // Empirical CDF
          const countLessEqual = values.filter((v) => v <= x).length;
          cdf.push({ x, y: countLessEqual / n });
        }

        setPdfData(pdf);
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
