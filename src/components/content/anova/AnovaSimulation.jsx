// src/components/content/anova/AnovaSimulation.jsx
import React, { useState, useMemo } from "react";
import { generateSample, calculateKDE } from "../../../utils/anovaMath";
import AnovaControls from "./AnovaControls";
import AnovaDistributionChart from "./AnovaDistributionChart";

const SAMPLE_SIZE = 30;
const X_MIN = 0;
const X_MAX = 100;
const KDE_BANDWIDTH = 4;

const createGroup = (name, mean, std, color) => {
  const sample = generateSample(mean, std, SAMPLE_SIZE);
  return {
    name,
    mean,
    std,
    color,
    sample,
    kde: calculateKDE(sample, KDE_BANDWIDTH, X_MIN, X_MAX),
  };
};

const AnovaSimulation = () => {
  const [groups, setGroups] = useState([
    createGroup("A", 40, 5, "var-bs-primary"),
    createGroup("B", 50, 5, "var-bs-info"),
    createGroup("C", 60, 5, "var-bs-success"),
  ]);

  const handleParamChange = (index, key, value) => {
    setGroups((prev) => {
      const updatedGroups = [...prev];
      const group = { ...updatedGroups[index], [key]: value };

      // Only regenerate sample and KDE for the modified group
      const newSample = generateSample(group.mean, group.std, SAMPLE_SIZE);
      const newKde = calculateKDE(newSample, KDE_BANDWIDTH, X_MIN, X_MAX);

      updatedGroups[index] = { ...group, sample: newSample, kde: newKde };
      return updatedGroups;
    });
  };

  // Merging existing KDE data for Recharts (computationally cheap)
  const chartData = useMemo(() => {
    return groups[0].kde.map((point, i) => ({
      x: point.x,
      A: groups[0].kde[i].y,
      B: groups[1].kde[i].y,
      C: groups[2].kde[i].y,
    }));
  }, [groups]);

  return (
    <div className="anova-simulation">
      <AnovaControls params={groups} onParamChange={handleParamChange} />
      <AnovaDistributionChart
        data={chartData}
        colors={groups.map((g) => g.color)}
      />
      {/* Next: ANOVA Table and Tukey Chart will go here */}
    </div>
  );
};

export default AnovaSimulation;
