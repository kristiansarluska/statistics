// src/hooks/useFetch.js
import { useState, useEffect } from "react";

/**
 * @hook useFetch
 * @description Generic data-fetching hook that handles loading, error, and success states.
 * Accepts an optional transform function to process the raw response text before storing it.
 * Prevents state updates on unmounted components via an AbortController.
 *
 * @param {string|null} url - URL to fetch from. Pass null to skip fetching.
 * @param {Function} [transform] - Optional function: (text: string) => any.
 *   Applied to the raw response text. Defaults to JSON.parse.
 * @returns {{ data: any, loading: boolean, error: string|null }}
 *
 * @example
 * // Fetch and auto-parse JSON
 * const { data, loading, error } = useFetch("/data/regions.geojson");
 *
 * @example
 * // Fetch and parse CSV with a custom transformer
 * import { parseCSVToObjects } from "../utils/csvParser";
 * const { data, loading, error } = useFetch("/data/stats.csv", parseCSVToObjects);
 */
const useFetch = (url, transform = JSON.parse) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to load ${url}`);
        }
        const text = await response.text();
        setData(transform(text));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("[useFetch] Error:", err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
