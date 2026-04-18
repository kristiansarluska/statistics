// src/pages/hypothesisTesting/TTestDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { studentTPDF, studentTCDF } from "../../utils/distributions";
import ResetButton from "../../components/charts/helpers/ResetButton";
import ChoroplethMap from "../../components/maps/ChoroplethMap";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import StatsBadge from "../../components/content/helpers/StatsBadge";
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
  const { t } = useTranslation();
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
    const tVal = (mean - expectedValue) / (sd / Math.sqrt(n));
    const df = n - 1;
    const pValue = 2 * (1 - studentTCDF(Math.abs(tVal), df));
    const tCrit = getTCritical(alpha, df);
    return { districtData, n, mean, sd, t: tVal, df, tCrit, pValue };
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

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  if (!stats) return null;

  const isSignificant = stats.pValue < alpha;
  const isDefaultExpected = expectedValue === DEFAULT_EXPECTED_VALUE;

  const statsBadgeItems = [
    { label: "n", value: stats.n, color: "text-body", groupStart: true },
    {
      label: "x̄",
      value: `${stats.mean.toFixed(2)} %`,
      color: "text-primary",
      groupStart: false,
    },
    {
      label: "s",
      value: stats.sd.toFixed(2),
      color: "text-warning",
      groupStart: false,
    },
    {
      label: "t-statistics",
      value: stats.t.toFixed(4),
      color: isSignificant ? "text-danger" : "text-success",
      groupStart: true,
    },
    {
      label: "p-value",
      value: stats.pValue.toFixed(4),
      color: isSignificant ? "text-danger" : "text-success",
      groupStart: false,
    },
  ];

  return (
    <section id="interactive-test" className="mb-5">
      <h2 className="mb-4 fw-bold">
        {t("hypothesisTesting.tTestDashboard.title")}
      </h2>

      <p className="mb-4">
        <Trans
          i18nKey="hypothesisTesting.tTestDashboard.description"
          components={{ m: <InlineMath math="\mu_0" /> }}
        />
      </p>

      {/* CONTROLS */}
      <div className="controls mb-4 d-flex flex-wrap justify-content-center align-items-start gap-5 w-100">
        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 text-center small">
            {t("hypothesisTesting.tTestDashboard.controls.district")}
          </label>
          <select
            className="form-select shadow-sm"
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

        {/* EXPECTED VALUE */}
        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 text-center small">
            {t("hypothesisTesting.tTestDashboard.controls.expectedValue")}
            <span className="text-primary ms-2">
              {expectedValue.toFixed(2)} %
            </span>
          </label>
          <div
            className="d-flex align-items-center gap-2"
            style={{ maxWidth: "260px", width: "100%" }}
          >
            <input
              type="range"
              className="form-range"
              min="15"
              max="30"
              step="0.01"
              value={expectedValue}
              onChange={(e) => setExpectedValue(parseFloat(e.target.value))}
            />
            <ResetButton
              onClick={() => setExpectedValue(DEFAULT_EXPECTED_VALUE)}
              disabled={isDefaultExpected}
            />
          </div>
        </div>

        {/* SIGNIFICANCE LEVEL */}
        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 text-center small">
            {t("hypothesisTesting.tTestDashboard.controls.alpha")}
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

      {/* STATS SUMMARY */}
      <div className="text-center mt-5 mb-3">
        <StatsBadge items={statsBadgeItems} />
      </div>

      {/* CHARTS */}
      <div
        className="charts-wrapper w-100 mb-4"
        style={{ alignItems: "flex-end" }}
      >
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

      {/* MAP */}
      <ChoroplethMap
        geoJsonData={geoJson}
        attribute="podiel_nad65"
        filterKey="okres"
        filterValue={selectedOkres}
        hoveredObec={hoveredObec}
        setHoveredObec={setHoveredObec}
        pivot={expectedValue}
      />

      {/* INTERPRETIVE NOTE */}
      <div className="alert alert-secondary border-0 shadow-sm mb-4 small">
        <Trans
          i18nKey="hypothesisTesting.tTestDashboard.interpretiveNote"
          components={{ bold: <strong /> }}
        />
      </div>

      {/* CALCULATION BREAKDOWN */}
      <div className="mb-4">
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill px-4 mx-auto d-block"
          type="button"
          onClick={() => setCalcOpen((v) => !v)}
        >
          {calcOpen
            ? t("hypothesisTesting.tTestDashboard.calcToggle.hide")
            : t("hypothesisTesting.tTestDashboard.calcToggle.show")}
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

      {/* TEST RESULT ALERT */}
      <div
        className={`alert ${isSignificant ? "alert-danger" : "alert-success"} shadow-sm border-0 mb-3`}
      >
        <h5 className="alert-heading mb-2">
          {t("hypothesisTesting.tTestDashboard.alert.title")}{" "}
          {isSignificant
            ? t("hypothesisTesting.tTestDashboard.alert.reject")
            : t("hypothesisTesting.tTestDashboard.alert.failToReject")}
        </h5>
        <p className="mb-0">
          <Trans
            i18nKey="hypothesisTesting.tTestDashboard.alert.pValue"
            values={{ value: stats.pValue.toFixed(4), alpha }}
            components={{
              bold: <strong />,
              sign: <>{isSignificant ? "<" : "≥"}</>,
            }}
          />
          <br />
          {isSignificant
            ? t("hypothesisTesting.tTestDashboard.alert.significantText", {
                alpha,
                district: selectedOkres,
                mean: stats.mean.toFixed(2),
                expected: expectedValue,
              })
            : t("hypothesisTesting.tTestDashboard.alert.insignificantText", {
                alpha,
                mean: stats.mean.toFixed(2),
                expected: expectedValue,
              })}
        </p>
      </div>
    </section>
  );
}

export default TTestDashboard;
