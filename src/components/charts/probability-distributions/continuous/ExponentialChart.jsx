// src/components/charts/probability-distributions/continuous/ExponentialChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import {
  exponentialPDF,
  exponentialCDF,
} from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function ExponentialChart() {
  const { t } = useTranslation();
  const [lambda, setLambda] = useState(1);
  const [hoverX, setHoverX] = useState(null);

  const minX = 0;
  const maxX = 10;

  const { dataPDF, dataCDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const step = maxX / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : i * step;
      pdf.push({ x, y: exponentialPDF(x, lambda) });
      cdf.push({ x, y: exponentialCDF(x, lambda) });
    }
    return { dataPDF: pdf, dataCDF: cdf };
  }, [lambda]);

  const maxY_PDF = useMemo(() => {
    return (Math.floor(lambda * 1.1 * 10) + 1) / 10;
  }, [lambda]);

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
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <label
          htmlFor="lambdaRangeExp"
          className="form-label w-100 text-center"
        >
          {t("components.probabilityCharts.poisson.paramLambda")}{" "}
          <span className="parameter-value">{lambda.toFixed(1)}</span>
        </label>
        <input
          type="range"
          className="form-range"
          id="lambdaRangeExp"
          min="0.1"
          max="5"
          step="0.1"
          value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
        />
      </div>

      <div className="charts-wrapper w-100">
        <div>
          <StyledLineChart
            data={dataPDF}
            areaValue={currentArea}
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
            yAxisDomain={[0, 1.1]}
            type="cdf"
            showReferenceArea={false}
          />
        </div>
      </div>
    </div>
  );
}

export default ExponentialChart;
