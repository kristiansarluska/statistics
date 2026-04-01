// src/components/content/helpers/InfoIcon.jsx
import React, { useState, useRef, useEffect } from "react";

function InfoIcon({ children }) {
  const [visible, setVisible] = useState(false); // controls render
  const [animated, setAnimated] = useState(false); // drives CSS transition
  const [tooltipStyle, setTooltipStyle] = useState({});
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);
  const hideTimer = useRef(null);

  const computePosition = () => {
    if (!iconRef.current || !tooltipRef.current) return;
    const icon = iconRef.current.getBoundingClientRect();
    const tooltipW = tooltipRef.current.offsetWidth;
    const viewportW = window.innerWidth;
    const padding = 8;

    let left = icon.left + icon.width / 2 - tooltipW / 2;
    if (left + tooltipW > viewportW - padding)
      left = viewportW - padding - tooltipW;
    if (left < padding) left = padding;

    setTooltipStyle({
      position: "fixed",
      top: icon.bottom + 6,
      left,
      width: "max-content",
      maxWidth: `min(320px, calc(100vw - ${padding * 2}px))`,
    });
  };

  // Recalculate position after tooltip is mounted and has a size
  useEffect(() => {
    if (visible) {
      computePosition();
      // Trigger enter transition on next frame
      requestAnimationFrame(() => setAnimated(true));
    }
  }, [visible]);

  const handleMouseEnter = () => {
    clearTimeout(hideTimer.current);
    setVisible(true);
  };

  const handleMouseLeave = () => {
    // Start exit animation, then unmount after transition completes
    setAnimated(false);
    hideTimer.current = setTimeout(() => setVisible(false), 180);
  };

  return (
    <span
      ref={iconRef}
      className="d-inline-flex align-items-center justify-content-center ms-1"
      style={{
        cursor: "help",
        position: "relative",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        border: `1.5px solid ${animated ? "var(--bs-primary)" : "currentColor"}`,
        fontSize: "11px",
        fontWeight: "bold",
        flexShrink: 0,
        color: animated ? "#fff" : "var(--bs-secondary-color)",
        backgroundColor: animated ? "var(--bs-primary)" : "transparent",
        transition:
          "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      i
      {visible && (
        <div
          ref={tooltipRef}
          className="bg-body border shadow p-3 text-start fw-normal text-body rounded"
          style={{
            ...tooltipStyle,
            fontSize: "0.85rem",
            zIndex: 9999,
            pointerEvents: "none",
            // Fade + subtle slide-down animation
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(-4px)",
            transition: "opacity 0.18s ease, transform 0.18s ease",
          }}
        >
          {children}
        </div>
      )}
    </span>
  );
}

export default InfoIcon;
