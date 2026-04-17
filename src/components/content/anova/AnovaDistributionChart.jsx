// src/components/content/anova/AnovaDistributionChart.jsx
import React from "react";
import StyledLineChart from "../../charts/helpers/StyledLineChart";

const AnovaDistributionChart = ({ data }) => {
  // Definovanie jednotlivých výberových súborov a farieb podľa tvojho dizajnu
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
    />
  );
};

export default AnovaDistributionChart;
