// src/components/charts/anova/AnovaDistributionChart.jsx
import React, { useState } from "react";
import StyledLineChart from "../helpers/StyledLineChart";

const AnovaDistributionChart = ({ data, groups, minX, maxX }) => {
  const [hoverX, setHoverX] = useState(null);

  const series = groups.map((g) => ({
    key: g.name,
    name: `Skupina ${g.name}`,
    color: g.color,
  }));

  return (
    <StyledLineChart
      data={data}
      xLabel="Teplota (°C)"
      yLabel="Hustota pravdepodobnosti"
      series={series}
      hoverX={hoverX}
      setHoverX={setHoverX}
      minX={minX}
      maxX={maxX}
    />
  );
};

export default AnovaDistributionChart;
