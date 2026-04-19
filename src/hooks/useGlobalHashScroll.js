// src/hooks/useGlobalHashScroll.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useGlobalHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace("#", "");
    let attempts = 0;
    let lastY = 0;
    let stableCount = 0;
    const MAX_ATTEMPTS = 40; // 4 seconds total
    const INTERVAL_MS = 100;

    const scrollInterval = setInterval(() => {
      const element = document.getElementById(id);

      if (element) {
        const currentY = element.getBoundingClientRect().top + window.scrollY;

        // Check if element position has stabilized (no layout shift)
        if (Math.abs(currentY - lastY) < 5) {
          stableCount++;
        } else {
          stableCount = 0;
          lastY = currentY;
        }

        // Trigger smooth scroll ONLY ONCE after position is stable for ~200ms (2 ticks)
        if (stableCount >= 2 || attempts >= MAX_ATTEMPTS) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(scrollInterval);
          return;
        }
      }

      if (++attempts >= MAX_ATTEMPTS) clearInterval(scrollInterval);
    }, INTERVAL_MS);

    return () => clearInterval(scrollInterval);
  }, [pathname, hash]);
}
