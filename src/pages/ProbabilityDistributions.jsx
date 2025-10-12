import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NormalDistributionChart from "../components/charts/NormalDistributionChart";
import NormalCDFChart from "../components/charts/NormalCDFChart";
import CSVDistributions from "../components/charts/CSVDistributions";
import "../styles/charts.css";

function ProbabilityDistributions() {
  const { t } = useTranslation();
  const location = useLocation();

  // vstupy pre oba grafy
  const [meanInput, setMeanInput] = useState(0);
  const [sdInput, setSdInput] = useState(1);

  // debounced hodnoty pre grafy
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

  // --- scroll na hash po navigácii ---
  useEffect(() => {
    // run only for this page
    if (!location.pathname.startsWith("/probability-distributions")) return;

    if (location.hash) {
      const id = location.hash.replace("#", "");
      // small delay to ensure element is rendered
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // fallback: scroll to top if ID not found
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 50);
    } else {
      // no hash — scroll to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <h1 id="page-title">{t("topics.probabilityDistributions")}</h1>

      <h2 id="motivation">Motivácia</h2>
      <p>{t("topics.probabilityDistributions.description")}</p>

      <h2 id="pdf-cdf">Pravdepodobnostná a distribučná funkcia</h2>
      <p>Placeholder text pre vysvetlenie rozdielu medzi PDF a CDF.</p>

      <h2 id="discrete-vs-continuous">Diskrétna a spojitá veličina</h2>
      <p>
        Placeholder text pre rozdiel medzi diskrétnou a spojitou náhodnou
        veličinou.
      </p>

      <h2 id="discrete-distributions">Diskrétne rozdelenia</h2>
      <p>Placeholder text o diskrétnych pravdepodobnostných rozdeleniach.</p>

      <h3 id="bernoulli">Alternatívne rozdelenie</h3>
      <p>Placeholder text pre alternatívne (Bernoulliho) rozdelenie.</p>

      <h3 id="uniform-discrete">Rovnomerné rozdelenie</h3>
      <p>Placeholder text pre diskrétne rovnomerné rozdelenie.</p>

      <h3 id="binomial">Binomické rozdelenie</h3>
      <p>Placeholder text pre binomické rozdelenie.</p>

      <h3 id="poisson">Poissonovo rozdelenie</h3>
      <p>Placeholder text pre Poissonovo rozdelenie.</p>

      <h2 id="continuous-distributions">Spojité rozdelenia</h2>
      <p>Placeholder text o spojitých pravdepodobnostných rozdeleniach.</p>

      <h3 id="exponential">Exponenciálne rozdelenie</h3>
      <p>Placeholder text pre exponenciálne rozdelenie.</p>

      <h3 id="normal">Normálne rozdelenie</h3>
      <p>Placeholder text pre normálne rozdelenie.</p>

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

      <h4 id="chi-square">Chí kvadrát rozdelenie</h4>
      <p>Placeholder text pre chí-kvadrát rozdelenie.</p>

      <h4 id="student-t">Studentovo t rozdelenie</h4>
      <p>Placeholder text pre Studentovo t rozdelenie.</p>

      <h4 id="fisher-f">Fisherovo F rozdelenie</h4>
      <p>Placeholder text pre Fisherovo F rozdelenie.</p>
    </>
  );
}

export default ProbabilityDistributions;
