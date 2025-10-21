// src/components/ScrollToTopButton.jsx
import React, { useState, useEffect } from "react";
import "../styles/scrollToTop.css"; // Vytvoríme tento CSS súbor

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Získame referenciu na hlavný obsahový kontajner
  // Predpokladáme, že má ID 'page-content-wrapper' podľa tvojho Layout.jsx a bootstrap.css
  const scrollContainerId = "page-content-wrapper";

  // Funkcia na kontrolu pozície scrollbaru
  const toggleVisibility = () => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (scrollContainer) {
      if (scrollContainer.scrollTop > 200) {
        // Zobrazí sa po prescrollovaní 200px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  // Funkcia na plynulé scrollovanie hore
  const scrollToTop = () => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth", // Plynulá animácia
      });
    }
  };

  useEffect(() => {
    const scrollContainer = document.getElementById(scrollContainerId);
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", toggleVisibility);
    }

    // Cleanup funkcia na odstránenie listenera
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, []); // Spustí sa len raz po mountnutí komponentu

  return (
    <button
      type="button"
      onClick={scrollToTop}
      // Použijeme Bootstrap triedy pre štýl a pozíciu
      className={`btn btn-primary rounded-circle p-2 scroll-to-top ${
        isVisible ? "show" : ""
      }`}
      aria-label="Scroll to top" // Pre prístupnosť
    >
      {/* Použijeme obrázok šípky */}
      <img
        src={`${import.meta.env.BASE_URL}assets/images/scroll-to-top-arrow.png`}
        alt="Up arrow"
        className="scroll-to-top-arrow" // Pridáme triedu pre prípadné štýlovanie ikony
      />
    </button>
  );
}

export default ScrollToTopButton;
