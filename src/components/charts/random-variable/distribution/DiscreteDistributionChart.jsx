// src/components/charts/random-variable/distribution/DiscreteDistributionChart.jsx
import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import StyledBarChart from "../../helpers/StyledBarChart";
import CustomTooltip from "../../helpers/CustomTooltip";
import ResetButton from "../../helpers/ResetButton";
import "../../../../styles/charts.css";

const renderCDFTooltip = ({
  active,
  label,
  data,
  xLabel,
  yLabel,
  minX,
  maxX,
}) => {
  if (active && label !== null && label !== undefined) {
    if (label < minX || label > maxX) return null;

    let cdfValue = 0;
    const sorted = [...data].sort((a, b) => a.x - b.x);
    for (const item of sorted) {
      if (item.x <= label) {
        cdfValue += item.p;
      } else {
        break;
      }
    }

    const correctedValue = Math.round(cdfValue * 10000) / 10000;
    const correctedPayload = [
      {
        value: correctedValue,
        payload: { x: label, y: correctedValue },
      },
    ];

    return (
      <CustomTooltip
        active={active}
        label={label}
        payload={correctedPayload}
        xLabel={xLabel}
        yLabel={yLabel}
      />
    );
  }
  return null;
};

const DEFAULT_COUNTS = ["1", "5", "10", "10", "5", "1"];

function DiscreteDistributionChart() {
  const [hoverX, setHoverX] = useState(null);
  const [counts, setCounts] = useState(DEFAULT_COUNTS);

  const isDefault = counts.every((val, index) => val === DEFAULT_COUNTS[index]);

  const data = useMemo(() => {
    const numericCounts = counts.map((c) => parseInt(c, 10) || 0);
    const sum = numericCounts.reduce((a, b) => a + b, 0);

    return numericCounts.map((count, i) => ({
      x: i,
      p: sum === 0 ? 0 : count / sum,
    }));
  }, [counts]);

  const pmfData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({ x: String(item.x), y: item.p }));
  }, [data]);

  const { minX, maxX } = useMemo(() => {
    if (!data || data.length === 0) return { minX: 0, maxX: 1 };
    const sortedX = data.map((d) => d.x).sort((a, b) => a - b);
    return { minX: sortedX[0], maxX: sortedX[sortedX.length - 1] };
  }, [data]);

  const { cdfPoints, openCircleData, closedCircleData, xTicks } =
    useMemo(() => {
      if (!data || data.length === 0)
        return {
          cdfPoints: [],
          openCircleData: [],
          closedCircleData: [],
          xTicks: [],
        };

      let currentCDF = 0;
      const sortedData = [...data].sort((a, b) => a.x - b.x);

      const points = [];
      const openData = [];
      const closedData = [];
      const ticks = [];

      points.push({ x: minX - 1, y: 0 });
      points.push({ x: minX, y: 0 });
      points.push({ x: minX, y: null });

      openData.push({ x: minX, y: 0 });
      ticks.push(minX);

      sortedData.forEach((item, i) => {
        const x_i = item.x;
        const p_i = item.p;

        currentCDF += p_i;
        const y_val = Math.round(currentCDF * 10000) / 10000;

        closedData.push({ x: x_i, y: y_val });

        const nextX = sortedData[i + 1]?.x;
        const endX = nextX !== undefined ? nextX : x_i + 1;

        points.push({ x: x_i, y: y_val });
        points.push({ x: endX, y: y_val });
        points.push({ x: endX, y: null });

        if (nextX !== undefined) {
          openData.push({ x: endX, y: y_val });
          ticks.push(nextX);
        } else {
          ticks.push(endX);
        }
      });

      const uniqueTicks = Array.from(new Set(ticks.sort((a, b) => a - b)));

      return {
        cdfPoints: points,
        openCircleData: openData,
        closedCircleData: closedData,
        xTicks: uniqueTicks,
      };
    }, [data, minX]);

  const handleChartInteraction = (state) => {
    if (
      state &&
      state.isTooltipActive &&
      state.activeLabel !== undefined &&
      state.activeLabel !== null
    ) {
      const labelNum = Number(state.activeLabel);
      if (!isNaN(labelNum)) {
        setHoverX(String(Math.round(labelNum)));
      }
    }
  };

  const handleReset = () => {
    setCounts([...DEFAULT_COUNTS]);
  };

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky - centrované a kompaktné */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center align-items-end gap-2"
        style={{ width: "100%", maxWidth: "800px" }}
      >
        {counts.map((val, index) => (
          <div key={index} className="d-flex flex-column align-items-center">
            <label
              className="form-label mb-1 fw-bold"
              style={{ fontSize: "0.85rem" }}
            >
              x = {index}
            </label>
            <input
              type="number"
              min="0"
              className="form-control form-control-sm text-center shadow-sm"
              style={{ width: "60px" }}
              value={val}
              onChange={(e) => {
                const newCounts = [...counts];
                newCounts[index] = e.target.value;
                setCounts(newCounts);
              }}
            />
          </div>
        ))}

        <div className="ms-2">
          <ResetButton onClick={handleReset} disabled={isDefault} />
        </div>
      </div>

      {/* Grafy v spoločnom wrapperi */}
      <div className="charts-wrapper w-100">
        <div>
          <h6 className="mb-3 text-center">Pravdepodobnostná funkcia (PMF)</h6>
          <StyledBarChart
            data={pmfData}
            xLabel="x"
            yLabel="P(X=x)"
            yDomain={[0, "auto"]}
            hoverX={hoverX}
            setHoverX={setHoverX}
            showReferenceArea={true}
            referenceAreaX1={String(minX)}
            referenceAreaX2={hoverX}
          />
        </div>

        <div>
          <h6 className="mb-3 text-center">Distribučná funkcia (CDF)</h6>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              onMouseMove={handleChartInteraction}
              onMouseLeave={() => setHoverX(null)}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="x"
                type="number"
                domain={[minX - 0.5, maxX + 1.5]}
                ticks={xTicks}
                label={{ value: "x", position: "insideBottom", offset: -15 }}
              />
              <YAxis
                domain={[0, 1.1]}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                label={{
                  value: "F(x)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                }}
              />
              <Tooltip
                cursor={false}
                content={(props) =>
                  renderCDFTooltip({
                    ...props,
                    data,
                    xLabel: "x",
                    yLabel: "F(x)",
                    minX,
                    maxX,
                  })
                }
              />
              <Line
                data={cdfPoints}
                type="linear"
                dataKey="y"
                stroke="var(--bs-primary)"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                connectNulls={false}
              />
              <Line
                data={openCircleData}
                type="linear"
                dataKey="y"
                stroke="none"
                activeDot={false}
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
                      stroke="var(--bs-primary)"
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
                      fill="var(--bs-primary)"
                      stroke={
                        isHovered ? "var(--bs-body-color, black)" : "none"
                      }
                      strokeWidth={isHovered ? 2 : 0}
                    />
                  );
                }}
              />
              {hoverX !== null && (
                <ReferenceLine
                  x={Number(hoverX)}
                  stroke="var(--bs-danger, red)"
                  strokeDasharray="5 5"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DiscreteDistributionChart;
