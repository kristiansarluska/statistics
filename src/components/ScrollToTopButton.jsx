// src/components/ScrollToTopButton.jsx
import React, { useState, useEffect } from "react";
import "../styles/scrollToTop.css";

/**
 * @component ScrollToTopButton
 * @description A floating action button that appears when the user scrolls down
 * within the main content wrapper. Provides a smooth scroll-to-top animation.
 * Target container is specifically "page-content-wrapper" due to the application's sidebar layout.
 */
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // ID of the scrollable container defined in the main Layout
  const scrollContainerId = "page-content-wrapper";

  /**
   * Evaluates the scroll position and toggles button visibility.
   */
  const toggleVisibility = () => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (scrollContainer) {
      if (scrollContainer.scrollTop > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  /**
   * Triggers a smooth scroll animation to the top of the content container.
   */
  const scrollToTop = () => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Set up event listener on the specific scrollable wrapper
  useEffect(() => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", toggleVisibility);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`btn btn-primary rounded-circle p-2 scroll-to-top ${
        isVisible ? "show" : ""
      }`}
      aria-label="Scroll to top"
    >
      <img
        src={`${import.meta.env.BASE_URL}assets/images/scroll-to-top-arrow.png`}
        alt="Up arrow"
        className="scroll-to-top-arrow"
      />
    </button>
  );
}

export default ScrollToTopButton;
