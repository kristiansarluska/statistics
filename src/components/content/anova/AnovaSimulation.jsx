// src/components/content/anova/AnovaSimulation.jsx
import React, { useState, useMemo } from "react";
import {
  generateSample,
  calculateKDE,
  calculateANOVA,
} from "../../../utils/anovaMath";
import AnovaControls from "./AnovaControls";
import AnovaDistributionChart from "./AnovaDistributionChart";
import AnovaTable from "./AnovaTable";

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
    createGroup("A", 40, 9, "var-bs-primary"),
    createGroup("B", 50, 4, "var-bs-info"),
    createGroup("C", 60, 6, "var-bs-success"),
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

  const anovaStats = useMemo(() => {
    // Extract raw samples from group objects
    const rawDataGroups = groups.map((g) => g.sample);
    return calculateANOVA(rawDataGroups);
  }, [groups]);

  return (
    <div className="anova-simulation">
      <AnovaControls params={groups} onParamChange={handleParamChange} />
      <AnovaDistributionChart data={chartData} />

      {/* NOVÉ: Vykreslenie ANOVA tabuľky */}
      <AnovaTable stats={anovaStats} />

      {/* Ďalší krok: Post-hoc Tukey graf */}
    </div>
  );
};

export default AnovaSimulation;
