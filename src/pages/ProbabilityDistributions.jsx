import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import NormalDistributionChart from "../components/charts/NormalDistributionChart";
import NormalCDFChart from "../components/charts/NormalCDFChart";
import CSVDistributions from "../components/charts/CSVDistributions";
import "../styles/charts.css";

function ProbabilityDistributions() {
  const { t } = useTranslation();

  // vstupy pre oba grafy
  const [meanInput, setMeanInput] = useState(0);
  const [sdInput, setSdInput] = useState(1);

  // debounced hodnota pre grafy
  const [mean, setMean] = useState(0);
  const [sd, setSd] = useState(1);

  const lastValidMean = useRef(mean);
  const lastValidSd = useRef(sd);
  const debounceTimer = useRef(null);

  const handleMeanChange = (value) => {
    setMeanInput(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setMean(num);
        lastValidMean.current = num;
      } else {
        setMean(lastValidMean.current); // fallback
      }
    }, 1000);
  };

  const handleSdChange = (value) => {
    setSdInput(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const num = parseFloat(value);
      if (!isNaN(num) && num > 0) {
        setSd(num);
        lastValidSd.current = num;
      } else {
        setSd(lastValidSd.current); // fallback
      }
    }, 1000);
  };

  // hover hodnota pre oba grafy
  const [hoverX, setHoverX] = useState(null);

  return (
    <>
      <h1>{t("topics.probabilityDistributions")}</h1>
      <p>{t("topics.probabilityDistributions.description")}</p>

      <div className="controls">
        <label>
          μ (stred):
          <input
            type="number"
            value={meanInput}
            step="0.5"
            onChange={(e) => handleMeanChange(e.target.value)}
          />
        </label>
        <label>
          σ (smerodajná odchýlka):
          <input
            type="number"
            value={sdInput}
            step="0.1"
            min="0.1"
            onChange={(e) => handleSdChange(e.target.value)}
          />
        </label>
      </div>

      <div className="charts-wrapper">
        <NormalDistributionChart
          mean={mean}
          sd={sd}
          hoverX={hoverX}
          setHoverX={setHoverX}
        />
        <NormalCDFChart
          mean={mean}
          sd={sd}
          hoverX={hoverX}
          setHoverX={setHoverX}
        />
      </div>
      <CSVDistributions />
      <div></div>
    </>
  );
}

export default ProbabilityDistributions;
