// src/components/charts/helpers/ResetButton.jsx
import React, { useState } from "react";

/**
 * @component ResetButton
 * @description A circular action button that triggers a 360-degree rotation animation
 * when clicked. Typically used for resetting simulation states or clearing filters.
 * @param {Object} props
 * @param {Function} props.onClick - Click handler function.
 * @param {boolean} props.disabled - Disables the button and its animation.
 * @param {string} [props.title="Reset"] - Tooltip text for the button.
 * @param {string} [props.className=""] - Additional CSS classes.
 */
function ResetButton({ onClick, disabled, title = "Reset", className = "" }) {
  // Tracking cumulative rotation to ensure smooth continuous spinning on repeated clicks
  const [rotation, setRotation] = useState(0);

  /**
   * Prevents interaction if disabled and updates rotation state
   * before firing the original onClick callback.
   */
  const handleClick = (e) => {
    if (disabled) return;

    // Shift rotation by -360 degrees to trigger the CSS transition
    setRotation((prev) => prev - 360);

    if (onClick) onClick(e);
  };

  return (
    <button
      type="button" // Explicitly "button" to prevent accidental form submissions
      className={`btn btn-primary d-flex align-items-center justify-content-center rounded-5 ${className}`}
      onClick={handleClick}
      disabled={disabled}
      title={title}
      style={{ width: "38px", height: "38px", padding: 0, flexShrink: 0 }}
    >
      <img
        src={`${import.meta.env.BASE_URL}assets/images/reset.png`}
        alt="Reset"
        style={{
          width: "18px",
          height: "18px",
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.5s ease-in-out",
        }}
      />
    </button>
  );
}

export default ResetButton;
