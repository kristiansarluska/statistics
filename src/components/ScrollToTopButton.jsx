// src/components/ScrollToTopButton.jsx
import React, { useState, useEffect } from "react";
import "../styles/scrollToTop.css";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollContainerId = "page-content-wrapper";

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

  const scrollToTop = () => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

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
