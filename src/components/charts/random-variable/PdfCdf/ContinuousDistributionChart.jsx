// src/components/charts/random-variable/PdfCdf/ContinuousDistributionChart.jsx
import React, { useState, useMemo } from "react";
import { Area, Line } from "recharts";
import StyledLineChart from "../../helpers/StyledLineChart";
import { normalPDF, normalCDF } from "../../../../utils/distributions";
import ResetButton from "../../helpers/ResetButton";

function ContinuousDistributionChart() {
  const [hoverX, setHoverX] = useState(null);
  const [measurements, setMeasurements] = useState([]);

  // GNSS parametre: stredná hodnota (0m), smerodajná odchýlka (2.5m)
  const m = 0;
  const s = 2.5;

  const minX = m - 4 * s;
  const maxX = m + 4 * s;

  const addMeasurements = (count) => {
    const newMeasurements = [];
    for (let i = 0; i < count; i++) {
      let u = 0,
        v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      // Box-Mullerova transformácia pre generovanie normálneho rozdelenia
      let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      newMeasurements.push(num * s + m);
    }
    setMeasurements((prev) => [...prev, ...newMeasurements]);
  };

  const handleReset = () => setMeasurements([]);

  const { dataPDF, dataCDF } = useMemo(() => {
    const step = (maxX - minX) / 200;
    const pdf = [];
    const cdf = [];

    const total = measurements.length;

    // Nastavenie histogramu (40 stĺpcov/binov)
    const numBins = 40;
    const binWidth = (maxX - minX) / numBins;
    const bins = Array(numBins).fill(0);

    if (total > 0) {
      measurements.forEach((val) => {
        if (val >= minX && val <= maxX) {
          const binIdx = Math.min(
            Math.floor((val - minX) / binWidth),
            numBins - 1,
          );
          bins[binIdx]++;
        }
      });
    }

    let sortedM = [];
    if (total > 0) {
      sortedM = [...measurements].sort((a, b) => a - b);
    }

    // Výpočet hodnôt pre oba grafy
    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : minX + i * step;

      let histY = null;
      if (total > 0) {
        const binIdx = Math.min(Math.floor((x - minX) / binWidth), numBins - 1);
        // Normalizácia počtu na hustotu pravdepodobnosti
        histY = bins[binIdx] / (total * binWidth);
      }

      pdf.push({ x, y: normalPDF(x, m, s), histY });
      cdf.push({ x, y: normalCDF(x, m, s), ecdfY: null });
    }

    // Rýchly výpočet empirickej CDF (schodovitá línia)
    if (total > 0) {
      let mIdx = 0;
      for (let i = 0; i <= 200; i++) {
        const x = cdf[i].x;
        while (mIdx < total && sortedM[mIdx] <= x) {
          mIdx++;
        }
        cdf[i].ecdfY = mIdx / total;
      }
    }

    return { dataPDF: pdf, dataCDF: cdf };
  }, [minX, maxX, measurements]);

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h5 className="mb-3">
        Simulácia odchýlky GNSS merania (Zákon veľkých čísel)
      </h5>
      <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
        Generovanie náhodných chýb GPS prijímača. Teoretické rozdelenie (modrá
        krivka) má strednú hodnotu <strong>0 m</strong> a smerodajnú odchýlku{" "}
        <strong>2.5 m</strong>. Sledujte, ako sa empirický histogram (sivá
        plocha) a empirická distribučná funkcia (prerušovaná čiara) s rastúcim
        počtom meraní postupne približujú k dokonalým teoretickým krivkám.
      </p>

      <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
        <button
          className="btn btn-primary rounded-pill btn-sm text-nowrap"
          onClick={() => addMeasurements(1)}
        >
          + 1 meranie
        </button>
        <button
          className="btn btn-primary rounded-pill btn-sm text-nowrap"
          onClick={() => addMeasurements(10)}
        >
          + 10 meraní
        </button>
        <button
          className="btn btn-primary rounded-pill btn-sm text-nowrap"
          onClick={() => addMeasurements(100)}
        >
          + 100 meraní
        </button>

        <div
          className="ms-2 fw-bold text-success bg-success-subtle px-3 py-1 rounded-pill"
          style={{ fontSize: "0.9rem" }}
        >
          Spolu: {measurements.length}
        </div>

        <div className="ms-auto">
          <ResetButton
            onClick={handleReset}
            disabled={measurements.length === 0}
          />
        </div>
      </div>

      <div className="charts-wrapper">
        <div>
          <StyledLineChart
            data={dataPDF}
            hoverX={hoverX}
            setHoverX={setHoverX}
            title="Pravdepodobnostná funkcia (PDF)"
            xLabel="Odchýlka (m)"
            yLabel="f(x)"
            lineClass="chart-line-primary"
            minX={minX}
            maxX={maxX}
            type="pdf"
            showReferenceArea={true}
          >
            {measurements.length > 0 && (
              <Area
                dataKey="histY"
                type="stepBefore"
                fill="var(--bs-gray-400)"
                fillOpacity={0.25}
                stroke="var(--bs-gray-400)"
                strokeWidth={1}
                isAnimationActive={false}
                activeDot={false}
              />
            )}
          </StyledLineChart>
        </div>

        <div>
          <StyledLineChart
            data={dataCDF}
            hoverX={hoverX}
            setHoverX={setHoverX}
            title="Distribučná funkcia (CDF)"
            xLabel="Odchýlka (m)"
            yLabel="F(x)"
            minX={minX}
            maxX={maxX}
            type="cdf"
          >
            {measurements.length > 0 && (
              <>
                {/* Nová plocha pod empirickou CDF */}
                <Area
                  dataKey="ecdfY"
                  type="stepBefore"
                  fill="var(--bs-gray-400)"
                  fillOpacity={0.15}
                  stroke="none"
                  isAnimationActive={false}
                  activeDot={false}
                />
                {/* Zvýraznená plná línia */}
                <Line
                  dataKey="ecdfY"
                  type="stepBefore"
                  stroke="var(--bs-gray-400)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  // strokeDasharray odstránené pre neprerušovanú líniu
                  isAnimationActive={false}
                />
              </>
            )}
          </StyledLineChart>
        </div>
      </div>
    </div>
  );
}

export default ContinuousDistributionChart;
