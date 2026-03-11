// src/components/charts/probability-distributions/continuous/StudentTChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import { studentTPDF, studentTCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function StudentTChart() {
  const { t } = useTranslation();
  const [k, setK] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  const minX = -5;
  const maxX = 5;

  const { dataPDF, dataCDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const step = (maxX - minX) / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : minX + i * step;
      pdf.push({ x, y: studentTPDF(x, k) });
      cdf.push({ x, y: studentTCDF(x, k) });
    }
    return { dataPDF: pdf, dataCDF: cdf };
  }, [k]);

  const maxY_PDF = 0.5;

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
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <label htmlFor="kRangeStudent" className="form-label w-100 text-center">
          {t("components.probabilityCharts.studentT.df")}{" "}
          <span className="parameter-value">{k}</span>
        </label>
        <input
          type="range"
          className="form-range"
          id="kRangeStudent"
          min="1"
          max="30"
          step="1"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
        />
      </div>

      <div className="charts-wrapper w-100">
        <div>
          <StyledLineChart
            data={dataPDF}
            areaValue={currentArea}
            title={t("components.probabilityCharts.pdfTitle")}
            xLabel="t"
            yLabel="f(t; k)"
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
            xLabel="t"
            yLabel="F(t; k)"
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

export default StudentTChart;
