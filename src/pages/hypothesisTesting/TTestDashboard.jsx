// src/pages/hypothesisTesting/TTestDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import { studentTPDF, studentTCDF } from "../../utils/distributions";
import StyledLineChart from "../../components/charts/helpers/StyledLineChart";
import ResetButton from "../../components/charts/helpers/ResetButton";
import ChoroplethMap from "../../components/maps/helpers/ChoroplethMap";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

// CZ national mean for podiel_nad65 (computed from SLDB 2021, ArcČR 4.3)
const DEFAULT_EXPECTED_VALUE = 20.56;

const getTCritical = (alpha, df) => {
  const targetCdf = 1 - alpha / 2;
  let low = 0,
    high = 30,
    mid = 0;
  for (let i = 0; i < 50; i++) {
    mid = (low + high) / 2;
    studentTCDF(mid, df) < targetCdf ? (low = mid) : (high = mid);
  }
  return mid;
};

function TTestDashboard() {
  const [data, setData] = useState([]);
  const [geoJson, setGeoJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOkres, setSelectedOkres] = useState("Bruntál");
  const [expectedValue, setExpectedValue] = useState(DEFAULT_EXPECTED_VALUE);
  const [alpha, setAlpha] = useState(0.05);
  const [hoverX, setHoverX] = useState(null);
  const [hoveredObec, setHoveredObec] = useState(null);
  const [calcOpen, setCalcOpen] = useState(false);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/MS_kraj.json`,
        );
        if (!response.ok) throw new Error("Nepodarilo sa načítať GeoJSON");
        const geojsonData = await response.json();

        const validFeatures = [];
        const parsed = [];

        geojsonData.features.forEach((feature) => {
          const props = feature.properties;
          if (!props.kod || !props.okres) return;

          const pocet = props.Poc_obyv_SLDB_2021 ?? null;
          const nad65 = props.poc_obyv_nad_65 ?? null;
          const podiel_nad65 =
            pocet > 0 && nad65 != null ? (nad65 / pocet) * 100 : null;

          if (podiel_nad65 !== null) {
            parsed.push({
              kod: props.kod,
              nazev: props.nazev,
              okres: props.okres,
              podiel_nad65,
              jitter: Math.random(),
            });
          }
          feature.properties.podiel_nad65 = podiel_nad65;
          validFeatures.push(feature);
        });

        setData(parsed);
        setGeoJson({ ...geojsonData, features: validFeatures });
        setLoading(false);
      } catch (error) {
        console.error("Chyba pri spracovaní dát:", error);
        setLoading(false);
      }
    };

    fetchGeoJSON();
  }, []);

  const okresy = useMemo(
    () => [...new Set(data.map((d) => d.okres))].sort(),
    [data],
  );

  const stats = useMemo(() => {
    const districtData = data.filter((d) => d.okres === selectedOkres);
    const n = districtData.length;
    if (n < 2) return null;
    const mean =
      districtData.reduce((acc, curr) => acc + curr.podiel_nad65, 0) / n;
    const variance =
      districtData.reduce(
        (acc, curr) => acc + Math.pow(curr.podiel_nad65 - mean, 2),
        0,
      ) /
      (n - 1);
    const sd = Math.sqrt(variance);
    const t = (mean - expectedValue) / (sd / Math.sqrt(n));
    const df = n - 1;
    const pValue = 2 * (1 - studentTCDF(Math.abs(t), df));
    const tCrit = getTCritical(alpha, df);
    return { districtData, n, mean, sd, t, df, tCrit, pValue };
  }, [data, selectedOkres, expectedValue, alpha]);

  const tChartData = useMemo(() => {
    if (!stats) return [];
    const points = [];
    const limit = Math.max(4, Math.abs(stats.t) + 1);
    for (let x = -limit; x <= limit; x += 0.05) {
      points.push({ x: parseFloat(x.toFixed(2)), y: studentTPDF(x, stats.df) });
    }
    return points;
  }, [stats]);

  const highlightedPoint = useMemo(() => {
    return stats?.districtData.find((d) => d.kod === hoveredObec) || null;
  }, [stats, hoveredObec]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  if (!stats) return null;

  const isSignificant = stats.pValue < alpha;
  const isDefaultExpected = expectedValue === DEFAULT_EXPECTED_VALUE;

  return (
    <section id="interactive-test" className="scroll-mt-4 mt-5">
      <h2 className="mb-4">Interaktívna ukážka</h2>

      <p className="mb-4">
        V predchádzajúcich častiach sme prešli všeobecným postupom testovania
        hypotéz a formulovali sme konkrétne hypotézy pre podiel obyvateľov nad
        65 rokov v obciach Moravskoslezského kraja. Teraz si celý proces môžeš
        vyskúšať interaktívne — vyber okres, nastav referenčnú hodnotu{" "}
        <InlineMath math="\mu_0" /> a sleduj, ako sa mení výsledok testu aj
        vizualizácia rozdelenia.
      </p>

      {/* Controls */}
      <div className="controls mb-4 d-flex flex-wrap justify-content-center align-items-start gap-5 w-100">
        <div className="d-flex flex-column align-items-center">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            Výber okresu:
          </label>
          <select
            className="form-select text-left shadow-sm"
            value={selectedOkres}
            onChange={(e) => setSelectedOkres(e.target.value)}
            style={{
              maxWidth: "200px",
              height: "38px",
              border: "1px solid var(--bs-border-color)!important",
              borderRadius: "0.375rem",
            }}
          >
            {okresy.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex flex-column align-items-center">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            Očakávaný podiel nad 65 rokov (μ₀):
          </label>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              className="form-control text-center shadow-sm"
              value={expectedValue}
              onChange={(e) =>
                setExpectedValue(parseFloat(e.target.value) || 0)
              }
              step="any"
              style={{ maxWidth: "150px", height: "38px" }}
            />
            <ResetButton
              onClick={() => setExpectedValue(DEFAULT_EXPECTED_VALUE)}
              disabled={isDefaultExpected}
            />
          </div>
        </div>

        <div className="d-flex flex-column align-items-center">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            Hladina významnosti (α):
          </label>
          <div className="btn-group" role="group">
            {[0.01, 0.05, 0.1].map((val, index, arr) => (
              <button
                key={val}
                type="button"
                className={`btn btn-sm px-3 btn-outline-primary ${alpha === val ? "active" : ""} ${index === 0 ? "rounded-start-pill" : index === arr.length - 1 ? "rounded-end-pill" : ""}`}
                onClick={() => setAlpha(val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert */}
      <div
        className={`alert ${isSignificant ? "alert-danger" : "alert-success"} shadow-sm border-0 mb-5`}
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
            ? `Na hladine významnosti ${alpha} existuje štatisticky významný rozdiel. Priemerný podiel obyvateľov nad 65 rokov v obciach okresu ${selectedOkres} (${stats.mean.toFixed(2)} %) sa preukázateľne líši od celoštátnej referenčnej hodnoty ${expectedValue} %.`
            : `Na hladine významnosti ${alpha} sme nepreukázali štatisticky významný rozdiel. Variabilita v dátach je príliš veľká alebo priemer (${stats.mean.toFixed(2)} %) je dostatočne blízko k referenčnej hodnote ${expectedValue} %.`}
        </p>
      </div>

      {/* Live calculation breakdown */}
      <div className="mb-4">
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill px-4 mx-auto d-block"
          type="button"
          onClick={() => setCalcOpen((v) => !v)}
        >
          {calcOpen ? "Skryť výpočet ▲" : "Zobraziť výpočet ▼"}
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateRows: calcOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 0.35s ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              className="card shadow-sm border-0 mx-auto mt-3"
              style={{ maxWidth: "620px" }}
            >
              <div className="card-body">
                <h6 className="card-subtitle mb-3 text-muted text-center">
                  Výpočet t-štatistiky pre okres {selectedOkres}
                </h6>
                <div className="text-center mb-2">
                  <BlockMath math="t = \frac{\bar{x} - \mu_0}{\dfrac{s}{\sqrt{n}}}" />
                </div>
                <div className="text-center mb-3">
                  <BlockMath
                    math={`t = \\frac{${stats.mean.toFixed(2)} - ${expectedValue}}{\\dfrac{${stats.sd.toFixed(2)}}{\\sqrt{${stats.n}}}} = \\frac{${(stats.mean - expectedValue).toFixed(2)}}{${(stats.sd / Math.sqrt(stats.n)).toFixed(4)}} = ${stats.t.toFixed(4)}`}
                  />
                </div>
                <div className="row text-center small text-muted g-2">
                  {[
                    {
                      math: `\\bar{x} = ${stats.mean.toFixed(2)}`,
                      label: "výb. priemer (%)",
                    },
                    {
                      math: `\\mu_0 = ${expectedValue}`,
                      label: "ref. hodnota (%)",
                    },
                    {
                      math: `s = ${stats.sd.toFixed(2)}`,
                      label: "smer. odch.",
                    },
                    { math: `n = ${stats.n}`, label: "počet obcí" },
                  ].map(({ math, label }) => (
                    <div key={label} className="col-6 col-sm-3">
                      <InlineMath math={math} />
                      <div>{label}</div>
                    </div>
                  ))}
                </div>

                <hr className="my-3" />

                <h6 className="card-subtitle mb-2 text-muted text-center">
                  Výpočet p-hodnoty
                </h6>
                <div className="text-center mb-2">
                  <BlockMath math="p = 2 \cdot P(T_{df} > |t|) = 2 \cdot (1 - F_{t}(|t|))" />
                </div>
                <div className="text-center mb-3">
                  <BlockMath
                    math={`p = 2 \\cdot (1 - F_{${stats.df}}(${Math.abs(stats.t).toFixed(4)})) = ${stats.pValue.toFixed(4)}`}
                  />
                </div>
                <p className="small text-muted text-center mb-3">
                  kde <InlineMath math={`F_{${stats.df}}`} /> je distribučná
                  funkcia Studentovho t-rozdelenia s{" "}
                  <InlineMath math={`${stats.df}`} /> stupňami voľnosti.
                </p>

                <hr className="my-3" />

                <div
                  className={`rounded p-2 text-center small ${isSignificant ? "bg-danger-subtle" : "bg-success-subtle"}`}
                >
                  <div
                    className={`fw-bold mb-1 ${isSignificant ? "text-danger" : "text-success"}`}
                  >
                    {isSignificant
                      ? `p = ${stats.pValue.toFixed(4)} < α = ${alpha} → zamietame H₀`
                      : `p = ${stats.pValue.toFixed(4)} ≥ α = ${alpha} → nezamietame H₀`}
                  </div>
                  <div className="text-muted">
                    Ekvivalentne:{" "}
                    <InlineMath
                      math={`|t| = ${Math.abs(stats.t).toFixed(4)}`}
                    />
                    {isSignificant ? " > " : " ≤ "}
                    <InlineMath
                      math={`t_{\\alpha/2} = ${stats.tCrit.toFixed(4)}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts — side by side on desktop */}
      <div className="charts-wrapper w-100" style={{ alignItems: "flex-end" }}>
        <div className="chart-container">
          <div className="chart-title">Variabilita v okrese</div>

          <div className="d-flex justify-content-center gap-4 mb-1">
            <span className="small d-flex align-items-center gap-1">
              <svg width="18" height="10">
                <line
                  x1="0"
                  y1="5"
                  x2="18"
                  y2="5"
                  stroke="var(--bs-danger)"
                  strokeWidth="2"
                />
              </svg>
              <span style={{ color: "var(--bs-danger)" }}>
                μ₀ = {expectedValue} %
              </span>
            </span>
            <span className="small d-flex align-items-center gap-1">
              <svg width="18" height="10">
                <line
                  x1="0"
                  y1="5"
                  x2="4"
                  y2="5"
                  stroke="var(--bs-success)"
                  strokeWidth="2"
                />
                <line
                  x1="7"
                  y1="5"
                  x2="11"
                  y2="5"
                  stroke="var(--bs-success)"
                  strokeWidth="2"
                />
                <line
                  x1="14"
                  y1="5"
                  x2="18"
                  y2="5"
                  stroke="var(--bs-success)"
                  strokeWidth="2"
                />
              </svg>
              <span style={{ color: "var(--bs-success)" }}>
                x̄ = {stats.mean.toFixed(2)} %
              </span>
            </span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              onMouseLeave={() => setHoveredObec(null)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="podiel_nad65"
                name="Podiel nad 65"
                domain={["auto", "auto"]}
                className="chart-axis"
                tickFormatter={(v) => `${v.toFixed(1)} %`}
                label={{
                  value: "podiel obyv. nad 65 (%)",
                  position: "insideBottom",
                  offset: -15,
                }}
              />
              <YAxis
                type="number"
                dataKey="jitter"
                domain={[0, 1]}
                tick={false}
                axisLine={false}
                tickLine={false}
                width={45}
                label={{
                  value: " ",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                }}
              />

              <RechartsTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const d = payload[0].payload;
                    return (
                      <div
                        className="bg-body text-body border rounded shadow-sm p-2"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <div className="fw-bold">{d.nazev}</div>
                        <div className="text-primary mt-1">
                          Podiel nad 65: {d.podiel_nad65.toFixed(2)} %
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Obce"
                data={stats.districtData}
                fill="var(--bs-primary)"
                opacity={0.6}
                onMouseOver={(payload) => setHoveredObec(payload?.kod ?? null)}
              />

              {/* Zvýraznený biely bod pre hover z mapy */}
              {highlightedPoint && (
                <ReferenceDot
                  x={highlightedPoint.podiel_nad65}
                  y={highlightedPoint.jitter}
                  r={6}
                  fill="#ffffff"
                  stroke="var(--bs-primary)"
                  strokeWidth={2}
                  isFront={true}
                />
              )}

              <ReferenceLine
                x={expectedValue}
                stroke="var(--bs-danger)"
                strokeWidth={2}
              />
              <ReferenceLine
                x={stats.mean}
                stroke="var(--bs-success)"
                strokeDasharray="3 3"
                strokeWidth={2}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="chart-title">{`Studentovo t-rozdelenie (df = ${stats.df})`}</div>

          <div className="d-flex justify-content-center gap-4 mb-1">
            <span className="small d-flex align-items-center gap-1">
              <svg width="18" height="10">
                <line
                  x1="0"
                  y1="5"
                  x2="18"
                  y2="5"
                  stroke={
                    isSignificant ? "var(--bs-danger)" : "var(--bs-success)"
                  }
                  strokeWidth="2"
                />
              </svg>
              <span
                style={{
                  color: isSignificant
                    ? "var(--bs-danger)"
                    : "var(--bs-success)",
                }}
              >
                t = {stats.t.toFixed(2)}
              </span>
            </span>
            <span className="small d-flex align-items-center gap-1">
              <svg width="18" height="10">
                <rect
                  x="0"
                  y="0"
                  width="18"
                  height="10"
                  fill="var(--bs-danger)"
                  fillOpacity="0.15"
                />
              </svg>
              <span className="text-muted">kritická oblasť (α/2)</span>
            </span>
          </div>

          <StyledLineChart
            data={tChartData}
            title=""
            xLabel="t"
            yLabel="f(t)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={tChartData[0]?.x}
            maxX={tChartData[tChartData.length - 1]?.x}
            type="pdf"
            showReferenceArea={false}
          >
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
            <ReferenceLine
              x={stats.t}
              stroke={isSignificant ? "var(--bs-danger)" : "var(--bs-success)"}
              strokeWidth={2}
              label={{
                value: `t = ${stats.t.toFixed(2)}`,
                position: "top",
                fill: isSignificant ? "var(--bs-danger)" : "var(--bs-success)",
                fontWeight: "bold",
              }}
            />
          </StyledLineChart>
        </div>
      </div>

      <ChoroplethMap
        geoJsonData={geoJson}
        attribute="podiel_nad65"
        filterKey="okres"
        filterValue={selectedOkres}
        hoveredObec={hoveredObec}
        setHoveredObec={setHoveredObec}
        pivot={expectedValue}
      />
    </section>
  );
}

export default TTestDashboard;
