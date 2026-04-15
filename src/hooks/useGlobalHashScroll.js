//src/hooks/useGlobalHashScroll.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useGlobalHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If no hash, scroll to top on route change
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace("#", "");
    let attempts = 0;

    // Retry scrolling while heavy components (charts, math) render
    const scrollInterval = setInterval(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Stop checking once successfully scrolled
        clearInterval(scrollInterval);
      }

      // Stop trying after 1.5 seconds to prevent infinite loops
      if (attempts >= 15) {
        clearInterval(scrollInterval);
      }
      attempts++;
    }, 100);

    return () => clearInterval(scrollInterval);
  }, [pathname, hash]);
}
