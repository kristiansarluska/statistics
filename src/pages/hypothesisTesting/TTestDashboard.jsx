// src/pages/hypothesisTesting/TTestDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { studentTPDF, studentTCDF } from "../../utils/distributions";
import ResetButton from "../../components/charts/helpers/ResetButton";
import ChoroplethMap from "../../components/maps/helpers/ChoroplethMap";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

// Sub-components
import VariabilityScatterChart from "../../components/charts/hypothesis-testing/VariabilityScatterChart";
import TDistributionChart from "../../components/charts/hypothesis-testing/TDistributionChart";
import TTestCalculation from "../../components/content/hypothesis-testing/TTestCalculation";

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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }
  if (!stats) return null;

  const isSignificant = stats.pValue < alpha;
  const isDefaultExpected = expectedValue === DEFAULT_EXPECTED_VALUE;

  return (
    <section id="interactive-test" className="mb-5">
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
          <label className="form-label fw-bold mb-2 text-center small">
            Výber okresu:
          </label>
          <select
            className="form-select text-left shadow-sm"
            value={selectedOkres}
            onChange={(e) => setSelectedOkres(e.target.value)}
            style={{ maxWidth: "200px", height: "38px" }}
          >
            {okresy.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 text-center small">
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
          <label className="form-label fw-bold mb-2 text-center small">
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
            <TTestCalculation
              stats={stats}
              expectedValue={expectedValue}
              alpha={alpha}
              selectedOkres={selectedOkres}
              isSignificant={isSignificant}
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-wrapper w-100" style={{ alignItems: "flex-end" }}>
        <VariabilityScatterChart
          data={stats.districtData}
          expectedValue={expectedValue}
          mean={stats.mean}
          hoveredObec={hoveredObec}
          setHoveredObec={setHoveredObec}
        />
        <TDistributionChart
          data={tChartData}
          tValue={stats.t}
          tCrit={stats.tCrit}
          df={stats.df}
          isSignificant={isSignificant}
        />
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
