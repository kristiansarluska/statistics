// src/components/charts/probability-distributions/continuous/NormalChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import { normalPDF, normalCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function NormalChart() {
  const { t } = useTranslation();
  const [mean, setMean] = useState(0);
  const [sd, setSd] = useState(1);
  const [hoverX, setHoverX] = useState(null);

  const m = Number(mean);
  const s = Number(sd);

  const minX = -15;
  const maxX = 15;

  const { dataPDF, dataCDF } = useMemo(() => {
    const step = (maxX - minX) / 500;
    const pdf = [];
    const cdf = [];

    for (let i = 0; i <= 500; i++) {
      const x = i === 500 ? maxX : minX + i * step;
      pdf.push({ x, y: normalPDF(x, m, s) });
      cdf.push({ x, y: normalCDF(x, m, s) });
    }

    return { dataPDF: pdf, dataCDF: cdf };
  }, [m, s, minX, maxX]);

  const maxY_PDF = useMemo(() => {
    if (!dataPDF || dataPDF.length === 0) return 1;
    const maxVal = Math.max(...dataPDF.map((p) => p.y), 0);
    return (Math.floor(maxVal * 1.1 * 10) + 1) / 10;
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
      <div className="controls mb-4 row justify-content-center gx-4 gy-3 w-100 mx-0">
        <div className="col-10 col-sm-5 col-md-4 col-lg-3 d-flex flex-column align-items-center">
          <label
            htmlFor="meanRangeNormal"
            className="form-label fw-bold mb-2 text-center small"
          >
            {t("components.probabilityCharts.normal.mean")}
            <span className="parameter-value">{m.toFixed(1)}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="meanRangeNormal"
            min="-10"
            max="10"
            step="0.5"
            value={m}
            onChange={(e) => setMean(Number(e.target.value))}
          />
        </div>

        <div className="col-10 col-sm-5 col-md-4 col-lg-3 d-flex flex-column align-items-center">
          <label
            htmlFor="sdRangeNormal"
            className="form-label fw-bold mb-2 text-center small"
          >
            {t("components.probabilityCharts.normal.sd")}
            <span className="parameter-value">{s.toFixed(1)}</span>
          </label>
          <input
            type="range"
            className="form-range w-100 mb-0"
            id="sdRangeNormal"
            min="0.1"
            max="5"
            step="0.1"
            value={s}
            onChange={(e) => setSd(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="charts-wrapper w-100">
        <div>
          <StyledLineChart
            data={dataPDF}
            areaValue={currentArea} //
            title={t("components.probabilityCharts.pdfTitle")}
            xLabel="x"
            yLabel="f(x)"
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
            yLabel="F(x)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            type="cdf"
            showReferenceArea={false}
          />
        </div>
      </div>
    </div>
  );
}

export default NormalChart;
