// src/components/charts/probability-distributions/continuous/UniformContinuousChart.jsx
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useId,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import CustomTooltip from "../../helpers/CustomTooltip";
import StyledLineChart from "../../helpers/StyledLineChart";
import { getAxisConfig } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function UniformContinuousChart() {
  const { t } = useTranslation();
  const [a, setA] = useState(12);
  const [b, setB] = useState(20);
  const [hoverX, setHoverX] = useState(null);
  const [animated, setAnimated] = useState(true);

  const prevDataRef = useRef([]);
  const sliderRef = useRef(null); // Ref pre zachytenie kliknutí na slider
  const gradientId = useId();

  const minX = 0;
  const maxX = 30;
  const step = 1;

  const handleAChange = (e) => {
    const value = Math.min(Number(e.target.value), b - step);
    setA(value);
  };

  const handleBChange = (e) => {
    const value = Math.max(Number(e.target.value), a + step);
    setB(value);
  };

  // Spracovanie kliknutia priamo na dráhu slidera
  const handleTrackClick = (e) => {
    if (!sliderRef.current) return;

    // Ignorujeme kliknutie, ak užívateľ klikol priamo na bežca (input)
    // aby sme nenarušili plynulé ťahanie
    if (e.target.tagName.toLowerCase() === "input") return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;

    // Výpočet kliknutej hodnoty z percenta
    const clickedValue = Math.round(minX + percent * (maxX - minX));
    const safeValue = Math.max(minX, Math.min(maxX, clickedValue));

    const distA = Math.abs(safeValue - a);
    const distB = Math.abs(safeValue - b);

    // Posunieme toho bežca, ktorý je bližšie ku kliknutiu
    if (distA < distB) {
      setA(Math.min(safeValue, b - step));
    } else if (distB < distA) {
      setB(Math.max(safeValue, a + step));
    } else {
      if (safeValue < a) setA(Math.min(safeValue, b - step));
      else setB(Math.max(safeValue, a + step));
    }
  };

  const getPercent = useCallback(
    (value) => Math.round(((value - minX) / (maxX - minX)) * 100),
    [minX, maxX],
  );

  const hoverPercent = useMemo(() => {
    if (hoverX === null) return 0;
    if (maxX <= minX) return 0;
    const percent = ((hoverX - minX) / (maxX - minX)) * 100;
    return Math.max(0, Math.min(100, percent));
  }, [hoverX, minX, maxX]);

  const {
    chartData,
    areaData,
    openCircleData,
    closedCircleData,
    dataCDF,
    hoverData,
  } = useMemo(() => {
    const height = 1 / (b - a);
    const epsilon = 1e-7;

    const lData = [
      { x: minX, y: 0 },
      { x: a - epsilon, y: 0 },
      { x: a, y: null },
      { x: a, y: height },
      { x: b, y: height },
      { x: b, y: null },
      { x: b + epsilon, y: 0 },
      { x: maxX, y: 0 },
    ];

    const aData = [
      { x: minX, y: 0 },
      { x: a, y: 0 },
      { x: a, y: height },
      { x: b, y: height },
      { x: b, y: 0 },
      { x: maxX, y: 0 },
    ];

    const cData = [
      { x: a, y: height },
      { x: b, y: height },
    ];

    const oData = [
      { x: a, y: 0 },
      { x: b, y: 0 },
    ];

    const cdf = [];
    const hData = [];
    const numPoints = 300;
    const stepSize = (maxX - minX) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const x = i === numPoints ? maxX : minX + i * stepSize;
      let y = 0;
      if (x >= b) {
        y = 1;
      } else if (x > a) {
        y = (x - a) / (b - a);
      }
      cdf.push({ x, y });
      hData.push({ x, y: 0 });
    }

    return {
      chartData: lData,
      areaData: aData,
      openCircleData: oData,
      closedCircleData: cData,
      dataCDF: cdf,
      hoverData: hData,
    };
  }, [a, b, minX, maxX]);

  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(chartData)) {
      setAnimated(true);
      prevDataRef.current = chartData;
    } else {
      setAnimated(false);
    }
  }, [chartData, hoverX]);

  const maxY = useMemo(() => {
    const density = 1 / (b - a);
    return (Math.floor(density * 10) + 1) / 10;
  }, [a, b]);

  const xConfig = getAxisConfig(maxX, minX, maxX, minX);
  const yConfig = getAxisConfig(maxY, 0, maxY, 0);

  const handleChartInteraction = (state) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const currentX = state.activePayload[0].payload.x;
      if (hoverX !== currentX) setHoverX(currentX);
    } else if (
      state &&
      state.activeLabel !== undefined &&
      state.activeLabel !== null
    ) {
      const roundedX = parseFloat(state.activeLabel.toFixed(2));
      if (hoverX !== roundedX) setHoverX(roundedX);
    }
  };

  const hoverY = useMemo(() => {
    if (hoverX === null) return null;
    if (hoverX >= a && hoverX <= b) {
      return 1 / (b - a);
    }
    return 0;
  }, [hoverX, a, b]);

  const currentArea = useMemo(() => {
    if (hoverX === null || !dataCDF || dataCDF.length === 0) return null;
    let closest = dataCDF[0];
    let minDiff = Math.abs(dataCDF[0].x - hoverX);
    for (let i = 1; i < dataCDF.length; i++) {
      const diff = Math.abs(dataCDF[i].x - hoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = dataCDF[i];
      }
    }
    return closest.y;
  }, [hoverX, dataCDF]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      <div
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="d-flex justify-content-between w-100 mb-2">
          <span>
            {t("components.probabilityCharts.uniformContinuous.lowerA")}{" "}
            <span className="parameter-value">{a}</span>
          </span>
          <span>
            {t("components.probabilityCharts.uniformContinuous.upperB")}{" "}
            <span className="parameter-value">{b}</span>
          </span>
        </div>
        <div
          className="dual-slider-container"
          ref={sliderRef}
          onClick={handleTrackClick}
          style={{ cursor: "pointer" }}
        >
          <input
            type="range"
            min={minX}
            max={maxX}
            step={step}
            value={a}
            onChange={handleAChange}
            className="dual-slider-input"
            style={{ zIndex: a > maxX - 100 ? "5" : "3" }}
          />
          <input
            type="range"
            min={minX}
            max={maxX}
            step={step}
            value={b}
            onChange={handleBChange}
            className="dual-slider-input"
            style={{ zIndex: "4" }}
          />
          <div
            className="dual-slider-track"
            style={{ pointerEvents: "none" }}
          ></div>
          <div
            className="dual-slider-range"
            style={{
              left: `${getPercent(a)}%`,
              width: `${getPercent(b) - getPercent(a)}%`,
              pointerEvents: "none",
            }}
          ></div>
        </div>

        <div className="text-center mt-3 small text-muted w-100">
          f(x) = 1 / ({b} - {a < 0 ? `(${a})` : a}) = {(1 / (b - a)).toFixed(4)}
        </div>
      </div>

      <div className="charts-wrapper w-100">
        <div>
          <h6 className="mb-3 text-center">
            {t("components.probabilityCharts.pdfTitle")}
          </h6>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              onMouseMove={handleChartInteraction}
              onTouchMove={handleChartInteraction}
              onTouchStart={handleChartInteraction}
              onClick={handleChartInteraction}
              onMouseLeave={() => setHoverX(null)}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset={`${hoverPercent}%`}
                    stopColor="var(--bs-primary)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset={`${hoverPercent}%`}
                    stopColor="transparent"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="x"
                type="number"
                domain={xConfig.domain}
                ticks={xConfig.ticks}
                allowDecimals={true}
                label={{ value: "x", position: "insideBottom", offset: -15 }}
                tickFormatter={xConfig.formatTick}
                allowDuplicatedCategory={false}
              />
              <YAxis
                label={{
                  value: "f(x)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                }}
                tickFormatter={yConfig.formatTick}
                domain={yConfig.domain}
                ticks={yConfig.ticks}
                allowDataOverflow={false}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    xLabel="x"
                    yLabel="f(x)"
                    overrideY={hoverY}
                    areaValue={currentArea}
                  />
                }
                cursor={false}
                animationDuration={50}
              />

              <Line
                data={hoverData}
                type="linear"
                dataKey="y"
                stroke="none"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />

              {hoverX !== null && (
                <Area
                  data={areaData}
                  type="linear"
                  dataKey="y"
                  fill={`url(#${gradientId})`}
                  stroke="none"
                  isAnimationActive={false}
                  activeDot={false}
                  style={{ pointerEvents: "none" }}
                />
              )}

              {hoverX !== null && (
                <ReferenceLine
                  x={hoverX}
                  stroke="var(--bs-danger, red)"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  ifOverflow="extendDomain"
                />
              )}

              <Line
                data={chartData}
                type="linear"
                dataKey="y"
                className="chart-line-primary"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={animated}
                animationDuration={animated ? 700 : 0}
                connectNulls={false}
              />

              <Line
                data={openCircleData}
                type="linear"
                dataKey="y"
                stroke="none"
                activeDot={false}
                isAnimationActive={animated}
                animationDuration={animated ? 700 : 0}
                dot={(props) => {
                  const { cx, cy, index } = props;
                  if (cx == null || cy == null) return null;
                  return (
                    <circle
                      key={`open-${index}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="var(--bs-body-bg, white)"
                      stroke="var(--bs-primary, #0d6efd)"
                      strokeWidth={2}
                    />
                  );
                }}
              />

              <Line
                data={closedCircleData}
                type="linear"
                dataKey="y"
                stroke="none"
                activeDot={false}
                isAnimationActive={animated}
                animationDuration={animated ? 700 : 0}
                dot={(props) => {
                  const { cx, cy, index, payload } = props;
                  if (cx == null || cy == null) return null;
                  const isHovered =
                    hoverX !== null && Number(hoverX) === payload.x;
                  return (
                    <circle
                      key={`closed-${index}`}
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 5 : 4}
                      fill="var(--bs-primary, #0d6efd)"
                      stroke={
                        isHovered ? "var(--bs-body-color, black)" : "none"
                      }
                      strokeWidth={isHovered ? 2 : 0}
                      style={{ transition: "all 0.2s ease" }}
                    />
                  );
                }}
              />

              {hoverX !== null && hoverY !== null && (
                <ReferenceDot
                  x={hoverX}
                  y={hoverY}
                  r={5}
                  fill="var(--bs-primary)"
                  stroke="var(--bs-body-color, black)"
                  strokeWidth={2}
                  isFront={true}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h6 className="mb-3 text-center">
            {t("components.probabilityCharts.cdfTitle")}
          </h6>
          <StyledLineChart
            data={dataCDF}
            areaValue={currentArea}
            xLabel="x"
            yLabel="F(x)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            yAxisDomain={[0, 1.1]}
            type="cdf"
            showReferenceArea={false}
          />
        </div>
      </div>
    </div>
  );
}

export default UniformContinuousChart;
