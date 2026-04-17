// src/components/content/anova/AnovaDistributionChart.jsx
import React, { useState } from "react";
import StyledLineChart from "../../charts/helpers/StyledLineChart";

const AnovaDistributionChart = ({ data }) => {
  // Track X-axis hover position for vertical reference line
  const [hoverX, setHoverX] = useState(null);

  // Define groups and their matching styling
  const series = [
    { key: "A", name: "Skupina A", color: "var(--bs-primary)" },
    { key: "B", name: "Skupina B", color: "var(--bs-info)" },
    { key: "C", name: "Skupina C", color: "var(--bs-success)" },
  ];

  return (
    <StyledLineChart
      data={data}
      title="Distribúcia výberových súborov (KDE)"
      xLabel="Hodnota"
      yLabel="Hustota"
      series={series}
      hoverX={hoverX}
      setHoverX={setHoverX}
    />
  );
};

export default AnovaDistributionChart;
