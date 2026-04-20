// src/hooks/useGlobalHashScroll.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * @function useGlobalHashScroll
 * @description A custom hook that manages scrolling behavior when a URL contains a hash fragment.
 * It implements a "wait-and-stabilize" logic to ensure that even if the page layout shifts
 * (e.g., due to charts or images loading), the browser successfully scrolls to the correct element.
 */
export function useGlobalHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If no hash is present, reset scroll to the top of the page
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace("#", "");
    let attempts = 0;
    let lastY = 0;
    let stableCount = 0;
    const MAX_ATTEMPTS = 40; // Total timeout: 4 seconds (40 * 100ms)
    const INTERVAL_MS = 100;

    /**
     * Interval to poll for the element and check if its position has stabilized.
     * Useful for pages with heavy content that changes layout during initial render.
     */
    const scrollInterval = setInterval(() => {
      const element = document.getElementById(id);

      if (element) {
        const currentY = element.getBoundingClientRect().top + window.scrollY;

        // Check if the element's position has stopped shifting (layout is stable)
        if (Math.abs(currentY - lastY) < 5) {
          stableCount++;
        } else {
          stableCount = 0;
          lastY = currentY;
        }

        // Trigger smooth scroll only after the position is stable for ~200ms (2 ticks)
        if (stableCount >= 2 || attempts >= MAX_ATTEMPTS) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(scrollInterval);
          return;
        }
      }

      // Stop trying after reaching the maximum number of attempts
      if (++attempts >= MAX_ATTEMPTS) clearInterval(scrollInterval);
    }, INTERVAL_MS);

    return () => clearInterval(scrollInterval);
  }, [pathname, hash]);
}
