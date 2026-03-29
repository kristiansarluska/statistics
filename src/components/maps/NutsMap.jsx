// src/components/maps/NutsMap.jsx
import React, { useEffect, useRef, useContext, useMemo } from "react";
import { GeoJSON } from "react-leaflet";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import BaseMap from "./helpers/BaseMap";

const SELECTED_COLORS = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];

const getQuantileBreaks = (vals, classes = 5) => {
  if (vals.length === 0) return [];
  const sorted = [...vals].sort((a, b) => a - b);
  const breaks = [];
  for (let i = 1; i <= classes; i++)
    breaks.push(sorted[Math.floor((i / classes) * (sorted.length - 1))]);
  return breaks;
};

const getSelectedColor = (val, breaks) => {
  const i = breaks.findIndex((b) => val <= b);
  return SELECTED_COLORS[
    Math.min(i !== -1 ? i : breaks.length - 1, SELECTED_COLORS.length - 1)
  ];
};

function SequentialLegend({ colorBreaks, label }) {
  if (colorBreaks.length === 0) return null;
  return (
    <>
      <div className="fw-bold mb-1" style={{ fontSize: "0.78rem" }}>
        {label}
      </div>
      {colorBreaks.map((breakVal, i) => {
        const from = i === 0 ? breakVal - 10 : colorBreaks[i - 1];
        return (
          <div key={i} className="d-flex align-items-center gap-1 mb-1">
            <span
              style={{
                display: "inline-block",
                width: 13,
                height: 13,
                background:
                  SELECTED_COLORS[Math.min(i, SELECTED_COLORS.length - 1)],
                border: "1px solid #aaa",
                flexShrink: 0,
              }}
            />
            <span>
              {Number(from).toFixed(1)} – {Number(breakVal).toFixed(1)} r.
            </span>
          </div>
        );
      })}
    </>
  );
}

/**
 * NutsMap — EU NUTS3 choropleth for sampling visualisation.
 *
 * Hover pattern mirrors ChoroplethMap / TTestDashboard:
 *   - onEachFeature closes all tooltips via geoJsonRef before opening a new one
 *   - setHoveredId (stable React setter) called directly — no ref needed
 *   - selectedIds change triggers GeoJSON key change → full remount + fresh onEachFeature
 */
function NutsMap({
  geoJsonData,
  selectedIds,
  hoveredId = null,
  onRegionHover = null,
}) {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const geoJsonRef = useRef(null);

  const legendLabel = t("parameterEstimation.realDataSampling.map.legend");

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const colorBreaks = useMemo(() => {
    if (!geoJsonData || selectedSet.size === 0) return [];
    const vals = geoJsonData.features
      .filter((f) => selectedSet.has(f.properties.nuts_id))
      .map((f) => f.properties.median_age);
    return getQuantileBreaks(vals);
  }, [geoJsonData, selectedSet]);

  const style = (feature) => {
    const { nuts_id, median_age } = feature.properties;
    const isSelected = selectedSet.has(nuts_id);
    const isHovered = nuts_id === hoveredId;
    return {
      fillColor: isSelected
        ? getSelectedColor(median_age, colorBreaks)
        : darkMode
          ? "#2a2a2a"
          : "#e8e8e8",
      fillOpacity: isSelected ? (isHovered ? 1 : 0.85) : 0.4,
      weight: isHovered ? 3 : isSelected ? 1.5 : 0.3,
      color: isHovered
        ? "var(--bs-primary)"
        : isSelected
          ? darkMode
            ? "#fff"
            : "#555"
          : darkMode
            ? "#444"
            : "#bbb",
      opacity: 1,
    };
  };

  useEffect(() => {
    if (!geoJsonRef.current) return;
    geoJsonRef.current.setStyle(style);
    if (hoveredId) {
      geoJsonRef.current.eachLayer((layer) => {
        if (layer.feature?.properties?.nuts_id === hoveredId)
          layer.bringToFront();
      });
    }
  }, [selectedSet, darkMode, colorBreaks, hoveredId]);

  // onEachFeature — GeoJSON remounts when key changes (selectedIds.join or darkMode)
  // so closures are always fresh; stable React setter used directly (no ref needed)
  const onEachFeature = (feature, layer) => {
    const { name, country, median_age, nuts_id } = feature.properties;
    const isSelected = selectedSet.has(nuts_id);
    const tooltipAgeLabel = t(
      "parameterEstimation.realDataSampling.map.tooltipAge",
    );

    layer.bindTooltip(
      `<div class="text-center">
      <strong>${name}</strong><br/>
      <small class="text-muted">${country} · ${nuts_id}</small><br/>
      <span style="color:var(--bs-primary)"><strong>${tooltipAgeLabel} ${median_age} r.</strong></span>
    </div>`,
      { sticky: false, className: "shadow-sm border-0 bg-body text-body" },
    );

    layer.on({
      mouseover: (e) => {
        if (geoJsonRef.current)
          geoJsonRef.current.eachLayer((l) => l.closeTooltip());
        layer.openTooltip(e.latlng);
        if (isSelected) onRegionHover?.(nuts_id);
      },
      mousemove: (e) => layer.openTooltip(e.latlng),
      mouseout: () => {
        layer.closeTooltip();
        onRegionHover?.(null);
      },
    });
  };

  const legend =
    colorBreaks.length > 0 ? (
      <SequentialLegend colorBreaks={colorBreaks} label={legendLabel} />
    ) : null;

  return (
    <BaseMap
      center={[50.5, 10.0]}
      zoom={4}
      minZoom={3}
      maxZoom={10}
      height={420}
      legend={legend}
    >
      {geoJsonData && (
        <GeoJSON
          ref={geoJsonRef}
          key={`${selectedIds.join(",")}-${darkMode ? "d" : "l"}-${i18n.language}`}
          data={geoJsonData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
    </BaseMap>
  );
}

export default NutsMap;
