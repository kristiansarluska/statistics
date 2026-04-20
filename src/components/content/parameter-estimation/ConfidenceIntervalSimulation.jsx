import React, { useState, useEffect, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { InlineMath } from "react-katex";
import InfoIcon from "../helpers/InfoIcon";
import StatsBadge from "../helpers/StatsBadge";
import ResetButton from "../../charts/helpers/ResetButton";
import CIDistributionChart from "../../charts/parameter-estimation/CIDistributionChart";
import CIIntervalsChart from "../../charts/parameter-estimation/CIIntervalsChart";
import CIFormulaPanel from "./CIFormulaPanel";
import { buildCI, POP_MEAN, POP_STD } from "../../../utils/ciMath";

const MAX_SAMPLES = 30;

/**
 * @component ConfidenceIntervalSimulation
 * @description Interactive simulation for confidence intervals. Allows users to draw random samples
 * from a real geographic dataset (NUTS3 median age) and visualizes the resulting confidence intervals
 * to demonstrate coverage probability and the effects of various statistical parameters.
 */
function ConfidenceIntervalSimulation() {
  const { t } = useTranslation();
  const [geoJson, setGeoJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cl, setCl] = useState(95);
  const [type, setType] = useState("two");
  const [knowSigma, setKnowSigma] = useState(true);
  const [n, setN] = useState(30);
  const [rawSamples, setRawSamples] = useState([]);
  const [showFormula, setShowFormula] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/NUTS3_median_age_EU.geojson`)
      .then((r) => r.json())
      .then((data) => {
        setGeoJson(data);
        setLoading(false);
        const initRaw = [];
        for (let i = 0; i < 3; i++) {
          const vals = [...data.features]
            .sort(() => Math.random() - 0.5)
            .slice(0, 30)
            .map((f) => f.properties.median_age);
          const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
          const sd = Math.sqrt(
            vals.reduce((a, v) => a + (v - mean) ** 2, 0) / (vals.length - 1),
          );
          initRaw.push({ mean, sd, n: vals.length });
        }
        setRawSamples(initRaw.reverse());
      })
      .catch(() => setLoading(false));
  }, []);

  const computedSamples = useMemo(
    () =>
      rawSamples.map((s) => ({
        ...s,
        ...buildCI(s.mean, s.sd, s.n, cl, type, knowSigma),
      })),
    [rawSamples, cl, type, knowSigma],
  );

  /**
   * @function draw
   * @description Draws a specified number of random samples from the dataset, calculates
   * their arithmetic mean and standard deviation, and prepends them to the state.
   * @param {number} count - The number of samples to generate.
   */
  const draw = (count) => {
    if (!geoJson) return;

    const remaining = MAX_SAMPLES - rawSamples.length;
    const actualCount = Math.min(count, remaining);
    if (actualCount <= 0) return;

    const newRaw = [];
    for (let i = 0; i < count; i++) {
      const vals = [...geoJson.features]
        .sort(() => Math.random() - 0.5)
        .slice(0, n)
        .map((f) => f.properties.median_age);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const sd = Math.sqrt(
        vals.reduce((a, v) => a + (v - mean) ** 2, 0) / (vals.length - 1),
      );
      newRaw.push({ mean, sd, n: vals.length });
    }
    setRawSamples((prev) => [...newRaw.reverse(), ...prev]);
  };

  const total = computedSamples.length;
  const hits = computedSamples.filter((s) => s.hit).length;
  const lastSample = computedSamples[0] ?? null;

  const lastZScore = useMemo(() => {
    if (!lastSample) return null;
    const se = (knowSigma ? POP_STD : lastSample.sd) / Math.sqrt(lastSample.n);
    return (lastSample.mean - POP_MEAN) / se;
  }, [lastSample, knowSigma]);

  const allZScores = useMemo(
    () =>
      computedSamples.slice(0, 40).map((s) => {
        const se = (knowSigma ? POP_STD : s.sd) / Math.sqrt(s.n);
        return (s.mean - POP_MEAN) / se;
      }),
    [computedSamples, knowSigma],
  );

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <div
        className="alert border-0 shadow-sm mt-4 mb-4"
        style={{
          fontSize: "0.9rem",
          backgroundColor: "var(--bs-info-bg-subtle)",
          color: "var(--bs-info-text-emphasis)",
        }}
      >
        <div className="d-flex">
          <div>
            <p className="mb-0">
              <Trans
                i18nKey="parameterEstimation.intervalEstimation.simulation.explanation"
                components={{ bold: <strong /> }}
              />
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4 w-100"
        style={{ maxWidth: 820 }}
      >
        {/* Alpha Control */}
        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 small text-center">
            {t(
              "parameterEstimation.intervalEstimation.simulation.controls.confidence",
            )}
          </label>
          <div className="btn-group">
            {[90, 95, 99].map((v, i, arr) => (
              <button
                key={v}
                type="button"
                className={`btn btn-sm btn-outline-primary px-3 ${
                  cl === v ? "active" : ""
                } ${
                  i === 0
                    ? "rounded-start-pill"
                    : i === arr.length - 1
                      ? "rounded-end-pill"
                      : ""
                }`}
                onClick={() => setCl(v)}
              >
                {v} %
              </button>
            ))}
          </div>
        </div>

        {/* Interval Type Control */}
        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 small text-center">
            {t(
              "parameterEstimation.intervalEstimation.simulation.controls.type",
            )}
          </label>
          <div className="btn-group">
            {[
              [
                "left",
                t(
                  "parameterEstimation.intervalEstimation.simulation.controls.typeLeft",
                ),
              ],
              [
                "two",
                t(
                  "parameterEstimation.intervalEstimation.simulation.controls.typeTwo",
                ),
              ],
              [
                "right",
                t(
                  "parameterEstimation.intervalEstimation.simulation.controls.typeRight",
                ),
              ],
            ].map(([v, label], i, arr) => (
              <button
                key={v}
                type="button"
                className={`btn btn-sm btn-outline-primary px-3 ${
                  type === v ? "active" : ""
                } ${
                  i === 0
                    ? "rounded-start-pill"
                    : i === arr.length - 1
                      ? "rounded-end-pill"
                      : ""
                }`}
                onClick={() => setType(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Variance Control */}
        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 small text-center d-flex align-items-center">
            {t(
              "parameterEstimation.intervalEstimation.simulation.controls.variance",
            )}
            <InfoIcon>
              <Trans
                i18nKey="parameterEstimation.intervalEstimation.simulation.infoZvsT"
                components={{
                  bold: <strong className="text-primary" />,
                  m1: <InlineMath math="s" />,
                  m2: <InlineMath math="\bar{x}" />,
                  m3: <InlineMath math="t" />,
                }}
              />
            </InfoIcon>
          </label>
          <div className="btn-group">
            {[
              [
                true,
                t(
                  "parameterEstimation.intervalEstimation.simulation.controls.varKnown",
                ),
              ],
              [
                false,
                t(
                  "parameterEstimation.intervalEstimation.simulation.controls.varUnknown",
                ),
              ],
            ].map(([v, label], i) => (
              <button
                key={String(v)}
                type="button"
                className={`btn btn-sm btn-outline-primary px-3 ${
                  knowSigma === v ? "active" : ""
                } ${i === 0 ? "rounded-start-pill" : "rounded-end-pill"}`}
                onClick={() => setKnowSigma(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
        {/* N Slider */}
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold small mb-0 text-nowrap">
            n = <span className="parameter-value">{n}</span>
          </label>
          <input
            type="range"
            className="form-range mb-0"
            min={5}
            max={200}
            step={5}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ width: 130 }}
          />
        </div>

        {/* Draw Controls */}
        <div className="btn-group rounded-pill overflow-hidden">
          {[1, 5, 10].map((cnt, i, arr) => {
            const isDisabled = total + cnt > MAX_SAMPLES;

            return (
              <button
                key={cnt}
                type="button"
                className="btn btn-primary btn-sm px-3"
                style={{
                  borderRight:
                    i < arr.length - 1
                      ? "1px solid rgba(255,255,255,0.3)"
                      : "none",
                  opacity: isDisabled ? 0.65 : 1,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (!isDisabled) draw(cnt);
                }}
                title={
                  isDisabled
                    ? t(
                        "parameterEstimation.intervalEstimation.simulation.actions.limitReached",
                        { max: MAX_SAMPLES },
                      )
                    : undefined
                }
              >
                {t(
                  "parameterEstimation.intervalEstimation.simulation.actions.addCount",
                  { count: cnt },
                )}
              </button>
            );
          })}
        </div>
        <span
          className="fw-bold text-success bg-success-subtle px-3 py-1 rounded-pill"
          style={{ fontSize: "0.9rem" }}
        >
          {total}{" "}
          {t(
            "parameterEstimation.intervalEstimation.simulation.actions.samplesCount",
          )}
        </span>

        {/* Reset Button */}
        <ResetButton
          onClick={() => setRawSamples([])}
          disabled={total === 0}
          title={t(
            "parameterEstimation.intervalEstimation.simulation.actions.clearAll",
          )}
        />
      </div>

      {/* Coverage Stats Badge */}
      {total > 0 && (
        <div className="mb-4 text-center">
          <StatsBadge
            items={[
              {
                label: t(
                  "parameterEstimation.intervalEstimation.simulation.coverage.contains",
                ),
                value: `${hits} (${((hits / total) * 100).toFixed(1)} %)`,
                color: "text-success",
              },
              {
                label: t(
                  "parameterEstimation.intervalEstimation.simulation.coverage.notContains",
                ),
                value: `${total - hits} (${(((total - hits) / total) * 100).toFixed(1)} %)`,
                color: "text-danger",
                groupStart: true,
              },
              {
                label: t(
                  "parameterEstimation.intervalEstimation.simulation.coverage.theoretical",
                ),
                value: `${cl} %`,
                color: "text-body",
                groupStart: true,
              },
            ]}
          />
        </div>
      )}

      {/* Charts Section */}
      <div
        className="d-flex flex-column gap-2 w-100 mx-auto"
        style={{ maxWidth: "1000px" }}
      >
        {/* Distribution Chart */}
        <div className="w-100">
          <h6 className="text-center mb-0">
            {t(
              "parameterEstimation.intervalEstimation.simulation.charts.distTitle",
              {
                dist: knowSigma ? "N(0,1)" : `t(${n - 1})`,
                score: knowSigma ? "z" : "t",
              },
            )}
          </h6>
          <div
            className="d-flex gap-3 justify-content-center mb-1"
            style={{ fontSize: "0.8rem" }}
          >
            <span style={{ color: "var(--bs-danger)" }}>
              {t(
                "parameterEstimation.intervalEstimation.simulation.charts.legendCrit",
              )}
            </span>
            <span style={{ color: "var(--bs-success)" }}>
              {t(
                "parameterEstimation.intervalEstimation.simulation.charts.legendLast",
                {
                  score: knowSigma ? "z" : "t",
                },
              )}
            </span>
          </div>

          <CIDistributionChart
            cl={cl}
            type={type}
            knowSigma={knowSigma}
            n={n}
            lastMean={lastSample ? lastSample.mean : null}
            allMeans={computedSamples.map((s) => s.mean)}
            computedSamples={computedSamples}
            t={t}
          />
        </div>

        {/* Intervals Chart */}
        <div className="w-100 mt-2">
          <h6 className="text-center mb-2">
            {t(
              "parameterEstimation.intervalEstimation.simulation.charts.ciTitle",
              { cl, mu: POP_MEAN },
            )}
          </h6>
          <div
            className="d-flex gap-3 justify-content-center mb-2"
            style={{ fontSize: "0.8rem" }}
          >
            <span style={{ color: "var(--bs-success)" }}>
              {t(
                "parameterEstimation.intervalEstimation.simulation.charts.legendContains",
              )}
            </span>
            <span style={{ color: "var(--bs-danger)" }}>
              {t(
                "parameterEstimation.intervalEstimation.simulation.charts.legendNotContains",
              )}
            </span>
            <span style={{ color: "var(--bs-body-color)", opacity: 0.6 }}>
              {t(
                "parameterEstimation.intervalEstimation.simulation.charts.legendMean",
              )}
            </span>
          </div>
          <CIIntervalsChart samples={computedSamples} n={n} t={t} />
        </div>
      </div>

      {/* Formula Toggle Section */}
      <div className="w-100 mt-4 mx-auto" style={{ maxWidth: "1000px" }}>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm rounded-pill px-4 d-block mx-auto mb-1"
          onClick={() => setShowFormula((v) => !v)}
        >
          {showFormula
            ? t(
                "parameterEstimation.intervalEstimation.simulation.formula.hide",
              )
            : t(
                "parameterEstimation.intervalEstimation.simulation.formula.show",
              )}
        </button>
        <div
          style={{
            display: "grid",
            gridTemplateRows: showFormula ? "1fr" : "0fr",
            transition: "grid-template-rows 0.3s ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <CIFormulaPanel
              cl={cl}
              type={type}
              knowSigma={knowSigma}
              lastSample={lastSample}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfidenceIntervalSimulation;
