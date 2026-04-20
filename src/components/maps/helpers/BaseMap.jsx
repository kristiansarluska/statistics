// src/components/maps/helpers/BaseMap.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ThemeContext } from "../../../context/ThemeContext";

/**
 * @component BaseMap
 * @description A shared, reusable Leaflet map wrapper used as the foundation for all choropleth
 * and interactive maps in the application. It automatically handles dark/light mode tile layers,
 * provides a custom fullscreen toggle, and offers a standardized slot for a map legend.
 * @param {Object} props
 * @param {number[]} [props.center=[50.5, 10.0]] - Initial geographical center of the map [latitude, longitude].
 * @param {number} [props.zoom=4] - Initial zoom level.
 * @param {number} [props.minZoom=3] - Minimum allowed zoom level.
 * @param {number} [props.maxZoom=14] - Maximum allowed zoom level.
 * @param {number[][]} [props.maxBounds] - Optional pan constraints representing [[South, West], [North, East]].
 * @param {number} [props.maxBoundsViscosity=0.8] - How strongly the map bounces back when panning outside `maxBounds` (0-1).
 * @param {boolean} [props.scrollWheelZoom=true] - Whether zooming with the mouse wheel is enabled.
 * @param {number|string} [props.height=420] - Map container height in pixels or standard CSS units.
 * @param {React.ReactNode} [props.legend] - React element to be rendered in the bottom-left overlay map legend slot.
 * @param {React.ReactNode} props.children - Additional Leaflet components (like GeoJSON layers, markers) to render inside the map.
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

  // Switch base tiles based on the global theme context
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
      {/* Remove Leaflet's default focus outline for a cleaner UI */}
      <style>{`.leaflet-interactive:focus { outline: none; }`}</style>

      <div
        ref={wrapperRef}
        className={`rounded border overflow-hidden shadow-sm position-relative mt-4${isFullscreen ? " bg-body" : ""}`}
        style={{ height: isFullscreen ? "100vh" : height, width: "100%" }}
      >
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
          title={isFullscreen ? "Close" : "Fullscreen"}
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
          {/* Key forces remounting when theme changes to ensure tiles render correctly */}
          <TileLayer key={tileUrl} url={tileUrl} attribution="&copy; CartoDB" />
          {children}
        </MapContainer>
      </div>
    </>
  );
}

export default BaseMap;
