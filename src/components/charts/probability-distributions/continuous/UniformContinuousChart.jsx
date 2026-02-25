import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import CustomTooltip from "../../helpers/CustomTooltip";
import { getAxisConfig } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function UniformContinuousChart() {
  const [a, setA] = useState(-5);
  const [b, setB] = useState(5);
  const [hoverX, setHoverX] = useState(null);
  const [animated, setAnimated] = useState(true);
  const prevDataRef = useRef([]);

  const minX = -10;
  const maxX = 10;
  const step = 1;

  const handleAChange = (e) => {
    const value = Math.min(Number(e.target.value), b - step);
    setA(value);
  };

  const handleBChange = (e) => {
    const value = Math.max(Number(e.target.value), a + step);
    setB(value);
  };

  const getPercent = useCallback(
    (value) => Math.round(((value - minX) / (maxX - minX)) * 100),
    [minX, maxX],
  );

  const { chartData, openCircleData, closedCircleData } = useMemo(() => {
    const height = 1 / (b - a);

    const lData = [
      { x: minX, y: 0 },
      { x: a, y: 0 },
      { x: a, y: null },
      { x: a, y: height },
      { x: b, y: height },
      { x: b, y: null },
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

    return { chartData: lData, openCircleData: oData, closedCircleData: cData };
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
    let closestPoint = chartData[0];
    let minDiff = Math.abs(chartData[0].x - hoverX);
    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].y === null) continue;
      const diff = Math.abs(chartData[i].x - hoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = chartData[i];
      } else if (diff === minDiff) {
        if (chartData[i].y > closestPoint.y) {
          closestPoint = chartData[i];
        }
      }
    }
    return closestPoint.y;
  }, [chartData, hoverX]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      <div
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="d-flex justify-content-between mb-2">
          <span>
            Dolná (a): <strong>{a}</strong>
          </span>
          <span>
            Horná (b): <strong>{b}</strong>
          </span>
        </div>

        <div className="dual-slider-container">
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

          <div className="dual-slider-track"></div>
          <div
            className="dual-slider-range"
            style={{
              left: `${getPercent(a)}%`,
              width: `${getPercent(b) - getPercent(a)}%`,
            }}
          ></div>
        </div>

        <div className="text-center mt-3 small text-muted w-100">
          f(x) = 1 / ({b} - {a < 0 ? `(${a})` : a}) = {(1 / (b - a)).toFixed(4)}
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <div className="chart-container">
          <div className="chart-title">{`Spojité rovnomerné rozdelenie U(${a}, ${b})`}</div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              onMouseMove={handleChartInteraction}
              onTouchMove={handleChartInteraction}
              onTouchStart={handleChartInteraction}
              onClick={handleChartInteraction}
              onMouseLeave={() => setHoverX(null)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={xConfig.domain}
                ticks={xConfig.ticks}
                allowDecimals={true}
                label={{ value: "x", position: "insideBottom", offset: -15 }}
                className="chart-axis"
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
                className="chart-axis"
                tickFormatter={yConfig.formatTick}
                domain={yConfig.domain}
                ticks={yConfig.ticks}
                allowDataOverflow={false}
              />
              <Tooltip
                content={<CustomTooltip xLabel="x" yLabel="f(x)" />}
                cursor={false}
                animationDuration={50}
              />

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
      </div>
    </div>
  );
}

export default UniformContinuousChart;
