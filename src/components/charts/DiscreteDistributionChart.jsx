import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../styles/charts.css"; // Predpokladáme, že štýly sú tu

// --- Render funkcie pre krúžky ---
const renderOpenCircle = (props) => {
  const { cx, cy, fill } = props; // Použijeme fill pre farbu OKRAJA
  // console.log("Open Circle:", cx, cy); // Debug
  return (
    <circle cx={cx} cy={cy} r={5} fill="white" stroke={fill} strokeWidth={2} />
  );
};
const renderClosedCircle = (props) => {
  const { cx, cy, fill } = props; // Použijeme fill pre farbu VÝPLNE
  // console.log("Closed Circle:", cx, cy); // Debug
  return <circle cx={cx} cy={cy} r={5} fill={fill} />;
};
// --- Predvolené dáta ---
const defaultData = [
  { x: 0, p: 0.03125 },
  { x: 1, p: 0.15625 },
  { x: 2, p: 0.3125 },
  { x: 3, p: 0.3125 },
  { x: 4, p: 0.15625 },
  { x: 5, p: 0.03125 },
];

// --- Vlastný Tooltip pre Scatter (voliteľné) ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    // payload[0].payload obsahuje {x: ..., y: ...}
    const point = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          padding: "5px",
          border: "1px solid var(--bs-gray-400)",
          borderRadius: "3px",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ margin: 0 }}>{`x: ${point.x}`}</p>
        {/* Zobrazíme y s rozumným počtom desatinných miest */}
        <p style={{ margin: 0 }}>{`F(x): ${point.y.toFixed(5)}`}</p>
      </div>
    );
  }
  return null;
};

function DiscreteDistributionChart({ data = defaultData }) {
  // --- PMF dáta ---
  const pmfData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({ x: String(item.x), y: item.p }));
  }, [data]);

  // --- Definícia minX a maxX ---
  const { minX, maxX } = useMemo(() => {
    if (!data || data.length === 0) return { minX: 0, maxX: 1 };
    const sortedX = data.map((d) => d.x).sort((a, b) => a - b);
    return { minX: sortedX[0], maxX: sortedX[sortedX.length - 1] };
  }, [data]);

  // --- Pomocné zoradené dáta pre CustomStepDot ---
  const sortedDataForDot = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort((a, b) => a.x - b.x);
  }, [data]);

  // --- CDF dáta, krúžky, ticks ---
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
      const points = []; // Body pre Line type="stepAfter"
      const openData = [];
      const closedData = [];
      const ticks = [];

      // Použijeme minX a maxX definované vyššie
      const localMinX = minX;
      const localMaxX = maxX;

      // 1. Začiatok čiary
      points.push({ x: localMinX - 1, y: 0 }); // Segment pred minX
      points.push({ x: localMinX, y: 0 }); // Bod na (minX, 0)
      closedData.push({ x: localMinX, y: 0 }); // Zatvorený krúžok na (minX, 0)
      ticks.push(localMinX);

      // 2. Body pre schody a krúžky
      sortedData.forEach((item, i) => {
        const x_i = item.x;
        const p_i = item.p;
        const y_before = currentCDF;

        // Otvorený krúžok na začiatku skoku (dole)
        openData.push({ x: x_i, y: y_before });

        // Aktualizácia CDF
        currentCDF += p_i;
        const y_after = currentCDF;

        // Zatvorený krúžok na vrchole skoku
        closedData.push({ x: x_i, y: y_after });

        // Body pre čiaru stepAfter
        points.push({ x: x_i, y: y_after }); // Bod, kde čiara skočí hore
        const nextX = sortedData[i + 1]?.x;
        const endX = nextX ?? x_i + 1;
        points.push({ x: endX, y: y_after }); // Bod, ktorý definuje koniec horizontálneho segmentu

        if (nextX !== undefined) {
          ticks.push(nextX);
        } else {
          ticks.push(endX);
        }
      });

      // 3. Koniec čiary
      points.push({ x: localMaxX + 2, y: currentCDF }); // Potiahnutie doprava

      // Odstránime prvý otvorený krúžok na (minX, 0)
      if (
        openData.length > 0 &&
        openData[0].x === localMinX &&
        openData[0].y === 0
      ) {
        openData.shift();
      }

      // Unikátne ticky
      const uniqueTicks = Array.from(new Set(ticks.sort((a, b) => a - b)));

      return {
        cdfPoints: points,
        openCircleData: openData,
        closedCircleData: closedData,
        xTicks: uniqueTicks,
      };
    }, [data, minX, maxX]); // Pridané minX, maxX

  if (!data || data.length === 0) {
    return <div>Chýbajú dáta pre diskrétne rozdelenie.</div>;
  }

  return (
    <div className="charts-wrapper">
      {/* PMF Graf */}
      <div>
        <h3>Pravdepodobnostná funkcia (PMF)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={pmfData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              interval={0}
              label={{ value: "x", position: "insideBottom", offset: -15 }}
            />
            <YAxis
              label={{
                value: "P(X=x)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
              }}
              domain={[0, "auto"]}
            />
            <Tooltip cursor={{ fill: "rgba(206, 206, 206, 0.2)" }} />
            <Bar dataKey="y" fill="var(--bs-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CDF Graf */}
      <div>
        <h3>Distribučná funkcia (CDF)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={cdfPoints} // Dáta pre čiaru idú sem
            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x" // dataKey pre čiaru
              type="number"
              domain={[minX - 0.5, maxX + 1.5]} // Doména podľa vypočítaných minX, maxX
              ticks={xTicks} // Použijeme vypočítané ticks
              allowDuplicatedCategory={false}
              label={{ value: "x", position: "insideBottom", offset: -15 }}
            />
            <YAxis
              label={{
                value: "F(x)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
              }}
              domain={[0, "auto"]}
            />
            {/* Tooltip pre čiaru - môže byť užitočný */}
            <Tooltip />
            <Line
              type="stepAfter" // Kľúčové: stepAfter
              dataKey="y"
              stroke="var(--bs-primary)" // Farba čiary
              fill="var(--bs-primary)" // Farba pre zatvorené krúžky (aj keď ich kreslí Scatter)
              strokeWidth={2}
              dot={false} // Vypneme defaultné bodky
              isAnimationActive={false}
            />
            {/* Poradie: Otvorené -> Zatvorené */}
            <Scatter
              name="Open"
              data={openCircleData} // Samostatné dáta pre otvorené
              fill="var(--bs-primary)" // Farba OKRAJA
              shape={renderOpenCircle}
              isAnimationActive={false}
              // Tooltip môžeme dať aj sem, ak chceme info len pri hoveri nad krúžkom
              // Alebo necháme hlavný Tooltip hore
            />
            <Scatter
              name="Closed"
              data={closedCircleData} // Samostatné dáta pre zatvorené
              fill="var(--bs-primary)" // Farba VÝPLNE
              shape={renderClosedCircle}
              isAnimationActive={false}
              // Tooltip aj sem
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DiscreteDistributionChart;
