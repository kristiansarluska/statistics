// src/pages/hypothesisTesting/TTestDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
  ComposedChart,
  Area,
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import { studentTPDF, studentTCDF } from "../../utils/distributions";

// Pomocná funkcia: Výpočet kritickej hodnoty t (inverzná CDF) pomocou bisekcie
const getTCritical = (alpha, df) => {
  const targetCdf = 1 - alpha / 2; // Obojstranný test
  let low = 0;
  let high = 30; // Dostatočne veľká horná hranica pre t-hodnotu
  let mid = 0;

  // 50 iterácií bisekcie pre vysokú presnosť
  for (let i = 0; i < 50; i++) {
    mid = (low + high) / 2;
    const currentCdf = studentTCDF(mid, df);
    if (currentCdf < targetCdf) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return mid;
};

function TTestDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ovládacie prvky
  const [selectedOkres, setSelectedOkres] = useState("Olomouc");
  const [expectedValue, setExpectedValue] = useState(136); // Očakávaná hustota (mu_0)
  const [alpha, setAlpha] = useState(0.05);

  // Načítanie dát
  useEffect(() => {
    const csvUrl = `${import.meta.env.BASE_URL}data/Ol_kraj.csv`;
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
          .filter((row) => row.kod && row.okres)
          .map((row) => {
            const rawPlocha = String(row.plocha || "0").replace(",", ".");
            let plochaVal = parseFloat(rawPlocha);
            if (plochaVal > 10000) plochaVal = plochaVal / 1000000;
            const pocet = parseInt(row.Poc_obyv_SLDB_2021, 10) || 0;

            return {
              nazev: row.nazev,
              okres: row.okres,
              hustota: plochaVal > 0 ? pocet / plochaVal : 0,
              jitter: Math.random(), // Náhodná Y hodnota pre rozmiestnenie bodov
            };
          })
          .filter((row) => row.hustota > 0 && row.hustota < 2000); // Odfiltrovanie extrémov pre vizuálnu prehľadnosť

        setData(parsed);
        setLoading(false);
      },
    });
  }, []);

  const okresy = useMemo(() => {
    return [...new Set(data.map((d) => d.okres))].sort();
  }, [data]);

  // Štatistické výpočty
  const stats = useMemo(() => {
    const districtData = data.filter((d) => d.okres === selectedOkres);
    const n = districtData.length;
    if (n < 2) return null;

    const mean = districtData.reduce((acc, curr) => acc + curr.hustota, 0) / n;
    const variance =
      districtData.reduce(
        (acc, curr) => acc + Math.pow(curr.hustota - mean, 2),
        0,
      ) /
      (n - 1);
    const sd = Math.sqrt(variance);

    const t = (mean - expectedValue) / (sd / Math.sqrt(n));
    const df = n - 1;

    // Využitie našich utilít
    const pValue = 2 * (1 - studentTCDF(Math.abs(t), df));
    const tCrit = getTCritical(alpha, df);

    return { districtData, n, mean, sd, t, df, tCrit, pValue };
  }, [data, selectedOkres, expectedValue, alpha]);

  // Dáta pre graf t-rozdelenia
  const tChartData = useMemo(() => {
    if (!stats) return [];
    const points = [];
    const limit = Math.max(4, Math.abs(stats.t) + 1);

    for (let x = -limit; x <= limit; x += 0.05) {
      points.push({
        x: parseFloat(x.toFixed(2)),
        pdf: studentTPDF(x, stats.df), // Využitie existujúcej PDF funkcie
      });
    }
    return points;
  }, [stats]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  if (!stats) return null;

  const isSignificant = stats.pValue < alpha;

  return (
    <div className="mx-auto w-100" style={{ maxWidth: "1000px" }}>
      <section id="interactive-test" className="scroll-mt-4 mt-5">
        <h2 className="mb-4">Interaktívna ukážka: Jednovýberový t-test</h2>

        {/* Ovládacie prvky */}
        <div className="card shadow-sm mb-4 border-0 bg-light">
          <div className="card-body d-flex flex-wrap gap-4 justify-content-between">
            <div className="flex-grow-1" style={{ minWidth: "200px" }}>
              <label className="form-label fw-bold">
                Výber okresu (Výberový súbor)
              </label>
              <select
                className="form-select shadow-sm"
                value={selectedOkres}
                onChange={(e) => setSelectedOkres(e.target.value)}
              >
                {okresy.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-grow-1" style={{ minWidth: "150px" }}>
              <label className="form-label fw-bold">
                Hladina významnosti (α)
              </label>
              <select
                className="form-select shadow-sm"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
              >
                <option value={0.01}>0.01 (1 %)</option>
                <option value={0.05}>0.05 (5 %)</option>
                <option value={0.1}>0.10 (10 %)</option>
              </select>
            </div>
            <div className="flex-grow-1" style={{ minWidth: "200px" }}>
              <label className="form-label fw-bold">
                Očakávaná hustota (μ₀)
              </label>
              <input
                type="number"
                className="form-control shadow-sm"
                value={expectedValue}
                onChange={(e) =>
                  setExpectedValue(parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </div>

        {/* Vyhodnotenie */}
        <div
          className={`alert ${isSignificant ? "alert-danger" : "alert-success"} shadow-sm border-0 mb-4`}
        >
          <h5 className="alert-heading mb-2">
            Výsledok testovania:{" "}
            {isSignificant ? "Zamietame H₀" : "Nezamietame H₀"}
          </h5>
          <p className="mb-0">
            <strong>P-hodnota: {stats.pValue.toFixed(4)}</strong>{" "}
            {isSignificant ? "<" : "≥"} α ({alpha}).
            <br />
            {isSignificant
              ? `Na hladine významnosti ${alpha} existuje štatisticky významný rozdiel. Priemerná hustota zaľudnenia obcí v okrese ${selectedOkres} (${stats.mean.toFixed(1)} obyv./km²) sa preukázateľne líši od predpokladanej hodnoty ${expectedValue} obyv./km².`
              : `Na hladine významnosti ${alpha} sme nepreukázali štatisticky významný rozdiel. Variabilita v dátach je príliš veľká alebo priemer (${stats.mean.toFixed(1)} obyv./km²) je dostatočne blízko k ${expectedValue} obyv./km².`}
          </p>
        </div>

        {/* Grafy */}
        <div className="row g-4 mb-5">
          {/* Jitter Plot */}
          <div className="col-12">
            <div className="card shadow-sm h-100 border">
              <div className="card-body">
                <h6 className="card-title text-center mb-0">
                  Hustota obcí v okrese vs. Očakávaná hodnota
                </h6>
                <p className="text-center text-muted small mb-3">
                  Zobrazenie variability výberového súboru (Jitter plot)
                </p>
                <div style={{ height: "180px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.3}
                      />
                      <XAxis
                        type="number"
                        dataKey="hustota"
                        name="Hustota"
                        unit=" ob/km²"
                        domain={["auto", "auto"]}
                      />
                      <YAxis
                        type="number"
                        dataKey="jitter"
                        hide={true}
                        domain={[0, 1]}
                      />
                      <RechartsTooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(val, name) =>
                          name === "Hustota" ? [val.toFixed(1), name] : []
                        }
                      />
                      <Scatter
                        name="Obce"
                        data={stats.districtData}
                        fill="var(--bs-primary)"
                        opacity={0.6}
                      />

                      {/* Očakávaná a skutočná hodnota priemeru */}
                      <ReferenceLine
                        x={expectedValue}
                        stroke="var(--bs-danger)"
                        strokeWidth={2}
                        label={{
                          value: `μ₀ = ${expectedValue}`,
                          position: "top",
                          fill: "var(--bs-danger)",
                        }}
                      />
                      <ReferenceLine
                        x={stats.mean}
                        stroke="var(--bs-success)"
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        label={{
                          value: `x̄ = ${stats.mean.toFixed(1)}`,
                          position: "bottom",
                          fill: "var(--bs-success)",
                        }}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Graf Studentovho t-rozdelenia */}
          <div className="col-12">
            <div className="card shadow-sm border">
              <div className="card-body">
                <h6 className="card-title text-center mb-0">
                  Studentovo t-rozdelenie (df = {stats.df}) a Kritický obor
                </h6>
                <p className="text-center text-muted small mb-3">
                  T-štatistika = {stats.t.toFixed(2)} | Kritické t = ±
                  {stats.tCrit.toFixed(2)}
                </p>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={tChartData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="x" type="number" minTickGap={20} />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(val) => val.toFixed(4)}
                        labelFormatter={(val) => `t = ${val}`}
                      />

                      {/* Kritické obory (červené pozadie) */}
                      <ReferenceArea
                        x1={tChartData[0]?.x}
                        x2={-stats.tCrit}
                        fill="var(--bs-danger)"
                        fillOpacity={0.15}
                      />
                      <ReferenceArea
                        x1={stats.tCrit}
                        x2={tChartData[tChartData.length - 1]?.x}
                        fill="var(--bs-danger)"
                        fillOpacity={0.15}
                      />

                      {/* Hustota pravdepodobnosti (Area) */}
                      <Area
                        type="monotone"
                        dataKey="pdf"
                        stroke="var(--bs-secondary)"
                        fill="var(--bs-secondary)"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        isAnimationActive={false}
                      />

                      {/* Čiara pre vypočítanú testovú štatistiku */}
                      <ReferenceLine
                        x={stats.t}
                        stroke={
                          isSignificant
                            ? "var(--bs-danger)"
                            : "var(--bs-success)"
                        }
                        strokeWidth={3}
                        label={{
                          value: `t = ${stats.t.toFixed(2)}`,
                          position: "top",
                          fill: isSignificant
                            ? "var(--bs-danger)"
                            : "var(--bs-success)",
                          fontWeight: "bold",
                        }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TTestDashboard;
