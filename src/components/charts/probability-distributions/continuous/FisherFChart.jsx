// src/components/charts/probability-distributions/continuous/FisherFChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import { fisherFPDF, fisherFCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function FisherFChart() {
  const { t } = useTranslation();
  const [d1, setD1] = useState(5);
  const [d2, setD2] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  const minX = 0;
  const maxX = 5;

  const { dataPDF, dataCDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const step = maxX / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : i * step;
      const safeX = x === 0 ? 0.0001 : x;

      let yPDF = fisherFPDF(safeX, d1, d2);

      if (yPDF > 2.5) yPDF = 2.5;

      pdf.push({ x, y: yPDF });
      cdf.push({ x, y: fisherFCDF(x, d1, d2) });
    }
    return { dataPDF: pdf, dataCDF: cdf };
  }, [d1, d2]);

  const maxY_PDF = useMemo(() => {
    const peak = Math.max(...dataPDF.filter((d) => d.x >= 0.1).map((d) => d.y));
    if (peak > 0.85) {
      return 1.2;
    }
    return 1.0;
  }, [dataPDF]);

  const currentArea = useMemo(() => {
    if (hoverX === null || !dataCDF || dataCDF.length === 0) return null;
    let closest = dataCDF[0];
    let minDiff = Math.abs(dataCDF[0].x - hoverX);
    for (let i = 1; i < dataCDF.length; i++) {
      const diff = Math.abs(dataCDF[i].x - hoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = dataCDF[i];
      }
    }
    return closest.y;
  }, [hoverX, dataCDF]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="d1Range" className="form-label w-100 text-center">
            {t("components.probabilityCharts.fisherF.d1")}{" "}
            <span className="parameter-value">{d1}</span>
          </label>
          <input
            type="range"
            className="form-range"
            id="d1Range"
            min="1"
            max="30"
            step="1"
            value={d1}
            onChange={(e) => setD1(Number(e.target.value))}
          />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="d2Range" className="form-label w-100 text-center">
            {t("components.probabilityCharts.fisherF.d2")}{" "}
            <span className="parameter-value">{d2}</span>
          </label>
          <input
            type="range"
            className="form-range"
            id="d2Range"
            min="1"
            max="30"
            step="1"
            value={d2}
            onChange={(e) => setD2(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="charts-wrapper w-100">
        <div>
          <StyledLineChart
            data={dataPDF}
            areaValue={currentArea}
            title={t("components.probabilityCharts.pdfTitle")}
            xLabel="x"
            yLabel="f(x; d₁, d₂)"
            lineClass="chart-line-primary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            yAxisDomain={[0, maxY_PDF]}
            type="pdf"
            showReferenceArea={true}
          />
        </div>
        <div>
          <StyledLineChart
            data={dataCDF}
            areaValue={currentArea}
            title={t("components.probabilityCharts.cdfTitle")}
            xLabel="x"
            yLabel="F(x; d₁, d₂)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            yAxisDomain={[0, 1.1]}
            type="cdf"
            showReferenceArea={false}
          />
        </div>
      </div>
    </div>
  );
}

export default FisherFChart;
