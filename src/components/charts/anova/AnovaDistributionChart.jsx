// src/components/charts/anova/AnovaDistributionChart.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../helpers/StyledLineChart";

function AnovaDistributionChart({ data, groups, minX, maxX }) {
  const [hoverX, setHoverX] = useState(null);
  const { t } = useTranslation();

  const series = groups.map((g) => ({
    key: g.name,
    name: `${g.name}`,
    color: g.color,
  }));

  return (
    <StyledLineChart
      data={data}
      xLabel={t("components.anovaSimulation.distributionChart.xAxis")}
      yLabel={t("components.anovaSimulation.distributionChart.yAxis")}
      series={series}
      hoverX={hoverX}
      setHoverX={setHoverX}
      minX={minX}
      maxX={maxX}
    />
  );
}

export default AnovaDistributionChart;
