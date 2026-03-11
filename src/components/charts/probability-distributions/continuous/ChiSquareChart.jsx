// src/components/charts/probability-distributions/continuous/ChiSquareChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";
import { chiSquarePDF, chiSquareCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function ChiSquareChart() {
  const { t } = useTranslation();
  const [k, setK] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  const { dataPDF, dataCDF, maxX, maxY_PDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const calculatedMaxX = k + 4 * Math.sqrt(2 * k);
    const step = calculatedMaxX / 200;

    for (let i = 1; i <= 200; i++) {
      const x = i === 200 ? calculatedMaxX : i * step;
      const yPDF = chiSquarePDF(x, k);
      const yCDF = chiSquareCDF(x, k);

      if (!isNaN(yPDF) && isFinite(yPDF)) {
        pdf.push({ x, y: yPDF });
      }
      cdf.push({ x, y: yCDF });
    }

    if (k > 2) {
      pdf.unshift({ x: 0, y: 0 });
      cdf.unshift({ x: 0, y: 0 });
    } else {
      cdf.unshift({ x: 0, y: 0 });
    }

    const calculatedMaxY = Math.max(...pdf.map((p) => p.y), 0);

    return {
      dataPDF: pdf,
      dataCDF: cdf,
      maxX: calculatedMaxX,
      maxY_PDF: calculatedMaxY > 0 ? calculatedMaxY * 1.1 : 0.5,
    };
  }, [k]);

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
        <label htmlFor="kRange" className="form-label w-100 text-center">
          {t("components.probabilityCharts.chiSquare.df")}{" "}
          <span className="parameter-value">{k}</span>
        </label>
        <input
          type="range"
          className="form-range"
          id="kRange"
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
            xLabel="x"
            yLabel="f(x; k)"
            lineClass="chart-line-primary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={0}
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
            yLabel="F(x; k)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={0}
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

export default ChiSquareChart;
