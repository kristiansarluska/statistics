// src/components/maps/helpers/ChoroplethMap.jsx
import React, { useMemo, useEffect, useRef, useContext } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import BaseMap from "./helpers/BaseMap";

// ── Color helpers ─────────────────────────────────────────────────────────────

const BELOW_SHADES = ["#f7ffee", "#e7f7cf", "#c2ec8c", "#80d040"];
const ABOVE_SHADES = ["#ffecf3", "#ffdad8", "#ffaca9", "#ff8080"];

const getDivergentBreaks = (vals, pivot, maxClasses = 5) => {
  const below = vals.filter((v) => v < pivot).sort((a, b) => a - b);
  const above = vals.filter((v) => v >= pivot).sort((a, b) => a - b);

  const makeBreaks = (arr, n) => {
    if (arr.length === 0) return [];
    const classes = Math.min(n, arr.length);
    const breaks = [];
    for (let i = 1; i <= classes; i++) {
      breaks.push(arr[Math.floor((i / classes) * (arr.length - 1))]);
    }
    return breaks;
  };

  const total = below.length + above.length;
  return {
    belowBreaks: makeBreaks(
      below,
      Math.max(1, Math.round((below.length / total) * maxClasses)),
    ),
    aboveBreaks: makeBreaks(
      above,
      Math.max(1, Math.round((above.length / total) * maxClasses)),
    ),
  };
};

const getColor = (val, pivot, belowBreaks, aboveBreaks) => {
  if (val == null) return null;
  if (val < pivot) {
    const i = belowBreaks.findIndex((b) => val <= b);
    const idx = i !== -1 ? i : belowBreaks.length - 1;
    return (
      BELOW_SHADES.slice(BELOW_SHADES.length - belowBreaks.length)[idx] ??
      BELOW_SHADES.at(-1)
    );
  } else {
    const i = aboveBreaks.findIndex((b) => val <= b);
    const idx = i !== -1 ? i : aboveBreaks.length - 1;
    return (
      ABOVE_SHADES.slice(0, aboveBreaks.length)[idx] ?? ABOVE_SHADES.at(-1)
    );
  }
};

// ── MapBoundsFitter ───────────────────────────────────────────────────────────

function MapBoundsFitter({ geoJsonData, filterKey, filterValue }) {
  const map = useMap();
  useEffect(() => {
    if (!geoJsonData) return;
    const filtered = {
      ...geoJsonData,
      features: geoJsonData.features.filter(
        (f) => f.properties[filterKey] === filterValue,
      ),
    };
    if (filtered.features.length > 0) {
      map.fitBounds(L.geoJSON(filtered).getBounds(), {
        padding: [30, 30],
        animate: true,
      });
    }
  }, [geoJsonData, filterValue, map]);
  return null;
}

// ── Legend ────────────────────────────────────────────────────────────────────

function DivergentLegend({ belowBreaks, aboveBreaks, pivot, label }) {
  const rows = useMemo(() => {
    const out = [];
    const aboveShades = ABOVE_SHADES.slice(0, aboveBreaks.length);
    [...aboveBreaks].reverse().forEach((b, ri) => {
      const i = aboveBreaks.length - 1 - ri;
      out.push({
        color: aboveShades[i],
        label: `${Math.round(b)} – ${Math.round(i === 0 ? pivot : aboveBreaks[i - 1])}`,
      });
    });
    out.push({ color: null, label: `μ₀ = ${pivot}`, isPivot: true });
    const belowShades = [...BELOW_SHADES]
      .slice(0, belowBreaks.length)
      .reverse();
    [...belowBreaks].reverse().forEach((b, ri) => {
      const i = belowBreaks.length - 1 - ri;
      out.push({
        color: belowShades[ri],
        label: `${Math.round(b)} – ${Math.round(i === 0 ? 0 : belowBreaks[i - 1])}`,
      });
    });
    return out;
  }, [belowBreaks, aboveBreaks, pivot]);

  return (
    <>
      <div className="fw-bold mb-1" style={{ fontSize: "0.78rem" }}>
        {label}
      </div>
      {rows.map((row, i) =>
        row.isPivot ? (
          <div
            key={i}
            className="text-muted my-1"
            style={{ borderTop: "1px dashed currentColor", paddingTop: 2 }}
          >
            {row.label}
          </div>
        ) : (
          <div key={i} className="d-flex align-items-center gap-1 mb-1">
            <span
              style={{
                display: "inline-block",
                width: 13,
                height: 13,
                background: row.color,
                border: "1px solid #aaa",
                flexShrink: 0,
              }}
            />
            <span>{row.label}</span>
          </div>
        ),
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function ChoroplethMap({
  geoJsonData,
  attribute,
  filterKey,
  filterValue,
  hoveredObec,
  setHoveredObec,
  pivot,
}) {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);
  const geoJsonRef = useRef(null);

  const { belowBreaks, aboveBreaks } = useMemo(() => {
    if (!geoJsonData) return { belowBreaks: [], aboveBreaks: [] };
    const vals = geoJsonData.features
      .filter((f) => f.properties[filterKey] === filterValue)
      .map((f) => f.properties[attribute])
      .filter((v) => v != null && isFinite(v));
    return getDivergentBreaks(vals, pivot ?? 136);
  }, [geoJsonData, filterValue, attribute, filterKey, pivot]);

  const style = (feature) => {
    const isInDistrict = feature.properties[filterKey] === filterValue;
    const isHovered = feature.properties.kod === hoveredObec;
    const val = feature.properties[attribute];
    let fillColor;
    if (!isInDistrict) fillColor = darkMode ? "#2a2a2a" : "#e0e0e0";
    else if (val == null) fillColor = darkMode ? "#606060" : "#b0b0b0";
    else fillColor = getColor(val, pivot ?? 136, belowBreaks, aboveBreaks);
    return {
      fillColor,
      weight: isHovered ? 2 : isInDistrict ? 1 : 0.5,
      opacity: 1,
      color: isHovered
        ? "var(--bs-primary)"
        : isInDistrict
          ? darkMode
            ? "#333"
            : "#fff"
          : darkMode
            ? "#444"
            : "#ccc",
      fillOpacity: isInDistrict ? 0.85 : 0.25,
    };
  };

  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(style);
      if (hoveredObec) {
        geoJsonRef.current.eachLayer((layer) => {
          if (layer.feature.properties.kod === hoveredObec)
            layer.bringToFront();
        });
      }
    }
  }, [hoveredObec, darkMode, filterValue, belowBreaks, aboveBreaks, pivot]);

  const onEachFeature = (feature, layer) => {
    const isInDistrict = feature.properties[filterKey] === filterValue;
    const val = feature.properties[attribute];
    const valLine = !isInDistrict
      ? `<small class="text-muted">${t("components.choroplethMap.tooltip.outsideDistrict")}</small>`
      : val == null
        ? `<small class="text-muted">${t("components.choroplethMap.tooltip.noData")}</small>`
        : t("components.choroplethMap.tooltip.share", {
            value: val.toFixed(1),
          });

    layer.bindTooltip(
      `<div class="text-center"><strong>${feature.properties.nazev}</strong><br/>${valLine}</div>`,
      { sticky: false, className: "shadow-sm border-0 bg-body text-body" },
    );
    layer.on({
      mouseover: (e) => {
        if (geoJsonRef.current)
          geoJsonRef.current.eachLayer((l) => l.closeTooltip());
        if (isInDistrict) {
          setHoveredObec(feature.properties.kod);
          layer.openTooltip(e.latlng);
        }
      },
      mousemove: (e) => {
        if (isInDistrict) layer.openTooltip(e.latlng);
      },
      mouseout: () => {
        layer.closeTooltip();
        setHoveredObec(null);
      },
    });
  };

  const legend = (
    <DivergentLegend
      belowBreaks={belowBreaks}
      aboveBreaks={aboveBreaks}
      pivot={pivot}
      label={t("components.choroplethMap.legendTitle")}
    />
  );

  return (
    <BaseMap
      center={[49.6, 17.2]}
      zoom={8}
      minZoom={6}
      maxZoom={14}
      maxBounds={[
        [47.5, 11.0],
        [52.0, 23.0],
      ]}
      maxBoundsViscosity={0.8}
      height={450}
      legend={legend}
    >
      {geoJsonData && (
        <GeoJSON
          ref={geoJsonRef}
          key={`${filterValue}-${darkMode ? "dark" : "light"}-${i18n.language}`}
          data={geoJsonData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
      <MapBoundsFitter
        geoJsonData={geoJsonData}
        filterKey={filterKey}
        filterValue={filterValue}
      />
    </BaseMap>
  );
}

export default ChoroplethMap;
