// src/components/maps/helpers/ChoroplethMap.jsx
import React, { useMemo, useEffect, useState, useRef, useContext } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ThemeContext } from "../../../context/ThemeContext";

// Divergent quantile breaks anchored at a pivot value.
// Returns { belowBreaks, aboveBreaks, belowCount, aboveCount }
const getDivergentBreaks = (vals, pivot, maxClasses = 5) => {
  const below = vals.filter((v) => v < pivot).sort((a, b) => a - b);
  const above = vals.filter((v) => v >= pivot).sort((a, b) => a - b);

  const makeBreaks = (arr, n) => {
    if (arr.length === 0) return [];
    const classes = Math.min(n, arr.length);
    const breaks = [];
    for (let i = 1; i <= classes; i++) {
      const idx = Math.floor((i / classes) * (arr.length - 1));
      breaks.push(arr[idx]);
    }
    return breaks;
  };

  // Scale number of classes proportionally, min 1
  const totalWithData = below.length + above.length;
  const belowClasses = Math.max(
    1,
    Math.round((below.length / totalWithData) * maxClasses),
  );
  const aboveClasses = Math.max(
    1,
    Math.round((above.length / totalWithData) * maxClasses),
  );

  return {
    belowBreaks: makeBreaks(below, belowClasses),
    aboveBreaks: makeBreaks(above, aboveClasses),
    belowCount: below.length,
    aboveCount: above.length,
  };
};

// Red shades (light → dark) for below-pivot
// Green shades light→dark (above pivot)
const GREEN_SHADES = ["#f7ffee", "#e7f7cf", "#c2ec8c", "#80d040"];
// Red shades light→dark (above → below pivot, i.e. closest to pivot = lightest)
const RED_SHADES = ["#ffecf3", "#ffdad8", "#ffaca9", "#ff8080"];

const getColor = (val, pivot, belowBreaks, aboveBreaks) => {
  if (val == null) return null; // no-data
  if (val < pivot) {
    const idx = belowBreaks.findIndex((b) => val <= b);
    const i = idx !== -1 ? idx : belowBreaks.length - 1;
    // Map to available red shades — use last N shades so darkest = closest to pivot
    const shades = RED_SHADES.slice(RED_SHADES.length - belowBreaks.length);
    return shades[i] ?? RED_SHADES[RED_SHADES.length - 1];
  } else {
    const idx = aboveBreaks.findIndex((b) => val <= b);
    const i = idx !== -1 ? idx : aboveBreaks.length - 1;
    const shades = GREEN_SHADES.slice(0, aboveBreaks.length);
    return shades[i] ?? GREEN_SHADES[GREEN_SHADES.length - 1];
  }
};

const MapBoundsFitter = ({ geoJsonData, filterKey, filterValue }) => {
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
      const layer = L.geoJSON(filtered);
      map.fitBounds(layer.getBounds(), { padding: [30, 30], animate: true });
    }
  }, [geoJsonData, filterValue, map]);
  return null;
};

function ChoroplethMap({
  geoJsonData,
  attribute,
  filterKey,
  filterValue,
  hoveredObec,
  setHoveredObec,
  pivot, // expectedValue from dashboard
}) {
  const wrapperRef = useRef(null);
  const geoJsonRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && wrapperRef.current) {
      wrapperRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const tileUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  // Compute divergent breaks for selected district
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
    if (!isInDistrict) {
      fillColor = darkMode ? "#2a2a2a" : "#e0e0e0"; // outside
    } else if (val == null) {
      fillColor = darkMode ? "#606060" : "#b0b0b0"; // no data — distinct mid-grey
    } else {
      fillColor = getColor(val, pivot ?? 136, belowBreaks, aboveBreaks);
    }

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

    let valLine;
    if (!isInDistrict) {
      valLine = `<small class="text-muted">Mimo vybraný okres</small>`;
    } else if (val == null) {
      valLine = `<small class="text-muted">Bez dát</small>`;
    } else {
      valLine = `Hustota: ${val.toFixed(1)} ob/km²`;
    }

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

  // Legend rows
  const legendRows = useMemo(() => {
    const rows = [];

    // Above pivot — from darkest (highest) down to lightest (closest to pivot)
    const aboveShades = GREEN_SHADES.slice(0, aboveBreaks.length);
    aboveBreaks
      .slice()
      .reverse()
      .forEach((breakVal, ri) => {
        const i = aboveBreaks.length - 1 - ri;
        const from = i === 0 ? (pivot ?? 136) : aboveBreaks[i - 1];
        rows.push({
          color: aboveShades[i],
          label: `${Math.round(breakVal)} – ${Math.round(from)}`,
        });
      });

    // Pivot separator
    rows.push({ color: null, label: `μ₀ = ${pivot ?? 136}`, isPivot: true });

    // Below pivot — from lightest (closest to pivot) down to darkest (lowest)
    const belowShades = [...RED_SHADES].slice(0, belowBreaks.length).reverse();
    belowBreaks
      .slice()
      .reverse()
      .forEach((breakVal, ri) => {
        const i = belowBreaks.length - 1 - ri;
        const from = i === 0 ? 0 : belowBreaks[i - 1];
        rows.push({
          color: belowShades[ri],
          label: `${Math.round(breakVal)} – ${Math.round(from)}`,
        });
      });

    return rows;
  }, [belowBreaks, aboveBreaks, pivot]);

  return (
    <>
      <style>{`.leaflet-interactive:focus { outline: none; }`}</style>
      <div
        ref={wrapperRef}
        className={`rounded border overflow-hidden mt-4 shadow-sm position-relative${isFullscreen ? " bg-body" : ""}`}
        style={{ height: isFullscreen ? "100vh" : "450px", width: "100%" }}
      >
        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className={`btn btn-sm ${darkMode ? "btn-dark border-secondary" : "btn-light border"} shadow-sm position-absolute d-flex align-items-center justify-content-center`}
          style={{
            top: 10,
            right: 10,
            zIndex: 1000,
            width: 32,
            height: 32,
            padding: 0,
          }}
          title="Zobraziť na celú obrazovku"
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-14v3h3v2h-5V5h2z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          )}
        </button>

        {/* Legend */}
        <div
          className="position-absolute bg-body border rounded shadow-sm px-2 py-1"
          style={{
            bottom: 20,
            left: 10,
            zIndex: 1000,
            fontSize: "0.72rem",
            minWidth: 140,
          }}
        >
          <div className="fw-bold mb-1" style={{ fontSize: "0.78rem" }}>
            Hustota (ob/km²)
          </div>
          {legendRows.map((row, i) =>
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
          {/* No-data */}
          <div
            className="d-flex align-items-center gap-1 mt-1"
            style={{
              borderTop: "1px solid var(--bs-border-color)",
              paddingTop: 4,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 13,
                height: 13,
                background: darkMode ? "#606060" : "#b0b0b0",
                border: "1px solid #aaa",
                flexShrink: 0,
              }}
            />
            <span className="text-muted">Bez dát</span>
          </div>
        </div>

        <MapContainer
          center={[49.6, 17.2]}
          zoom={8}
          minZoom={6}
          maxZoom={14}
          maxBounds={[
            [47.5, 11.0],
            [52.0, 23.0],
          ]}
          maxBoundsViscosity={0.8}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer key={tileUrl} url={tileUrl} attribution="&copy; CartoDB" />
          {geoJsonData && (
            <GeoJSON
              ref={geoJsonRef}
              key={`${filterValue}-${darkMode ? "dark" : "light"}`}
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
        </MapContainer>
      </div>
    </>
  );
}

export default ChoroplethMap;
