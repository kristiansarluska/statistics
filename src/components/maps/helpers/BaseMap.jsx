// src/components/maps/helpers/BaseMap.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ThemeContext } from "../../../context/ThemeContext";

/**
 * Shared Leaflet shell used by all choropleth maps.
 *
 * Props:
 *   center              — [lat, lng] initial centre
 *   zoom                — initial zoom level
 *   minZoom / maxZoom   — zoom constraints (defaults: 3 / 14)
 *   maxBounds           — [[s,w],[n,e]] optional pan constraint
 *   maxBoundsViscosity  — 0–1 (default 0.8)
 *   scrollWheelZoom     — default false
 *   height              — map height in px (default 420)
 *   legend              — ReactNode rendered in bottom-left overlay
 *   children            — Leaflet components (GeoJSON, MapBoundsFitter, …)
 */
function BaseMap({
  center = [50.5, 10.0],
  zoom = 4,
  minZoom = 3,
  maxZoom = 14,
  maxBounds,
  maxBoundsViscosity = 0.8,
  scrollWheelZoom = true,
  height = 420,
  legend,
  children,
}) {
  const { darkMode } = useContext(ThemeContext);
  const wrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tileUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

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

  const containerProps = {
    center,
    zoom,
    minZoom,
    maxZoom,
    scrollWheelZoom,
    style: { height: "100%", width: "100%" },
    ...(maxBounds && { maxBounds, maxBoundsViscosity }),
  };

  return (
    <>
      {/* Remove Leaflet's default focus outline */}
      <style>{`.leaflet-interactive:focus { outline: none; }`}</style>

      <div
        ref={wrapperRef}
        className={`rounded border overflow-hidden shadow-sm position-relative mt-4${isFullscreen ? " bg-body" : ""}`}
        style={{ height: isFullscreen ? "100vh" : height, width: "100%" }}
      >
        {/* Fullscreen toggle — matches Leaflet zoom control style */}
        <button
          onClick={toggleFullscreen}
          className="d-flex align-items-center justify-content-center"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            width: 26,
            height: 26,
            padding: 0,
            background: "#fff",
            border: "2px solid rgba(0,0,0,0.25)",
            borderRadius: 4,
            cursor: "pointer",
            color: "#333",
          }}
          title={isFullscreen ? "Zatvoriť" : "Celá obrazovka"}
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

        {/* Legend slot — bottom-left overlay, rendered only when provided */}
        {legend && (
          <div
            className="position-absolute bg-body border rounded shadow-sm px-2 py-1"
            style={{
              bottom: 20,
              left: 10,
              zIndex: 1000,
              fontSize: "0.72rem",
              minWidth: 130,
            }}
          >
            {legend}
          </div>
        )}

        <MapContainer {...containerProps}>
          <TileLayer key={tileUrl} url={tileUrl} attribution="&copy; CartoDB" />
          {children}
        </MapContainer>
      </div>
    </>
  );
}

export default BaseMap;
