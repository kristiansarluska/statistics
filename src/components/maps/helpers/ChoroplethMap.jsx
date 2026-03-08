// src/components/maps/helpers/ChoroplethMap.jsx
import React, { useMemo, useEffect, useState, useRef, useContext } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ThemeContext } from "../../../context/ThemeContext";

// Robustnejší Kvantilový algoritmus pre rovnomerné využitie farieb
const getQuantileBreaks = (data, numClasses) => {
  if (!data || data.length === 0) return [];
  const sorted = [...data].sort((a, b) => a - b);
  const breaks = [];
  for (let i = 1; i <= numClasses; i++) {
    const p = i / numClasses;
    const idx = Math.floor(p * (sorted.length - 1));
    breaks.push(sorted[idx]);
  }
  return breaks;
};

// Zabezpečí automatický zoom na aktuálne vybraný okres
const MapBoundsFitter = ({ geoJsonData, filterKey, filterValue }) => {
  const map = useMap();
  useEffect(() => {
    if (geoJsonData) {
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
}) {
  const wrapperRef = useRef(null);
  const geoJsonRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Napojenie na tvoj globálny ThemeContext
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && wrapperRef.current) {
      wrapperRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const tileUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const colors = ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"];

  const breaks = useMemo(() => {
    if (!geoJsonData) return [];
    const vals = geoJsonData.features
      .filter((f) => f.properties[filterKey] === filterValue)
      .map((f) => f.properties[attribute])
      .filter((v) => v !== undefined && v !== null);

    return getQuantileBreaks(vals, colors.length);
  }, [geoJsonData, filterValue, colors.length, attribute, filterKey]);

  // Dynamická štýlovacia funkcia
  const style = (feature) => {
    const isSelected = feature.properties[filterKey] === filterValue;
    const isHovered = feature.properties.kod === hoveredObec;
    const val = feature.properties[attribute];

    let fillColor = darkMode ? "#333" : "#e0e0e0";
    if (isSelected && val != null) {
      const idx = breaks.findIndex((b) => val <= b);
      fillColor = idx !== -1 ? colors[idx] : colors[colors.length - 1];
    }

    return {
      fillColor,
      weight: isHovered ? 2 : isSelected ? 1 : 0.5,
      opacity: 1,
      color: isHovered
        ? "#ffffff"
        : isSelected
          ? darkMode
            ? "#222"
            : "#fff"
          : darkMode
            ? "#555"
            : "#ccc",
      fillOpacity: isSelected ? 0.85 : 0.3,
    };
  };

  // Efektívna aktualizácia štýlov bez prekresľovania celého DOM stromu (podpora Hoveru z grafu)
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(style);
      // Vytiahnutie hoverovanej obce do popredia, aby ju neprekrývali okraje susedov
      if (hoveredObec) {
        geoJsonRef.current.eachLayer((layer) => {
          if (layer.feature.properties.kod === hoveredObec) {
            layer.bringToFront();
          }
        });
      }
    }
  }, [hoveredObec, darkMode, filterValue, breaks]);

  const onEachFeature = (feature, layer) => {
    const isSelected = feature.properties[filterKey] === filterValue;
    let tooltipContent = `<div class="text-center"><strong>${feature.properties.nazev}</strong><br/>`;
    if (isSelected && feature.properties[attribute] != null) {
      tooltipContent += `Hustota: ${feature.properties[attribute].toFixed(1)} ob/km²</div>`;
    } else {
      tooltipContent += `<small class="text-muted">Mimo vybraný okres</small></div>`;
    }

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      className: "shadow-sm border-0 bg-body text-body",
    });

    layer.on({
      mouseover: () => {
        if (isSelected) setHoveredObec(feature.properties.kod);
      },
      mouseout: () => setHoveredObec(null),
    });
  };

  const maxBounds = [
    [47.5, 11.0],
    [52.0, 23.0],
  ];

  return (
    <div
      ref={wrapperRef}
      className={`rounded border overflow-hidden mt-4 shadow-sm position-relative ${isFullscreen ? "bg-body" : ""}`}
      style={{ height: isFullscreen ? "100vh" : "450px", width: "100%" }}
    >
      <button
        onClick={toggleFullscreen}
        className={`btn btn-sm ${darkMode ? "btn-dark border-secondary" : "btn-light border"} shadow-sm position-absolute d-flex align-items-center justify-content-center`}
        style={{
          top: "10px",
          right: "10px",
          zIndex: 1000,
          width: "32px",
          height: "32px",
          padding: 0,
        }}
        title="Zobraziť na celú obrazovku"
      >
        {isFullscreen ? (
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h3.5V.5A.5.5 0 0 1 5.5 0zm4 0a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V.5h-3.5a.5.5 0 0 1-.5-.5zm-4 16a.5.5 0 0 1-.5-.5v-4a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1H3.5v3.5a.5.5 0 0 1-.5.5zm4 0a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10.5 16v-4a.5.5 0 0 1 1 0v3.5h3.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
          </svg>
        ) : (
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <path
              fillRule="evenodd"
              d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"
            />
          </svg>
        )}
      </button>

      <MapContainer
        center={[49.6, 17.2]}
        zoom={8}
        minZoom={6}
        maxZoom={14}
        maxBounds={maxBounds}
        maxBoundsViscosity={0.8}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer key={tileUrl} url={tileUrl} attribution="&copy; CartoDB" />
        {geoJsonData && (
          <GeoJSON
            ref={geoJsonRef}
            key={`${filterValue}-${darkMode ? "dark" : "light"}`} // hoveredObec už tu nie je, aby neblikala mapa
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
  );
}

export default ChoroplethMap;
