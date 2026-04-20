// src/hooks/useDebouncedValue.js
import { useState, useEffect, useRef } from "react";

/**
 * @function useDebouncedValue
 * @description A custom hook for managing a debounced value with built-in validation and correction logic.
 * Primarily used for text inputs that drive expensive operations like chart re-renders.
 * It maintains an immediate string state for the input field and a delayed, validated state for the application logic.
 * @param {any} initialValue - The starting value for both input and debounced states.
 * @param {number} [delay=1000] - Debounce delay in milliseconds.
 * @returns {[string, any, Function]} An array containing:
 * - inputValue: The current raw string in the input field.
 * - debouncedValue: The processed, validated, and delayed value.
 * - setValue: Function to update the input and trigger the debounce timer.
 */
function useDebouncedValue(initialValue, delay = 1000) {
  // Immediate state for the input element (always stored as string)
  const [inputValue, setInputValue] = useState(String(initialValue));

  // Delayed state used for logic/charts (can be string or number)
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Reference to persist the last known valid state for rollbacks
  const lastValidDebouncedValue = useRef(initialValue);

  // Timer reference to manage the debounce lifecycle
  const debounceTimer = useRef(null);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  /**
   * @function setValue
   * @description Updates the immediate input state and starts a debounce timer to process the value.
   * @param {string} newValue - Raw value from the input event.
   * @param {Object} [options={}] - Configuration for validation and post-processing.
   * @param {Function} [options.validator] - Function returning boolean to check format validity.
   * @param {Function} [options.postValidationAction] - Function to transform/clamp the value after successful validation.
   */
  const setValue = (newValue, options = {}) => {
    const { validator = (val) => true, postValidationAction = (val) => val } =
      options;

    // Always update the raw input state immediately
    setInputValue(newValue);

    // Clear any existing pending debounce timers
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a new timer to process the input after the delay
    debounceTimer.current = setTimeout(() => {
      const trimmedValue = String(newValue).trim();

      // Handle empty input: keep the input field empty but do not update debounced logic.
      // This allows the user to clear the field without breaking the dependent charts.
      if (trimmedValue === "") {
        return;
      }

      // Perform format validation
      if (validator(trimmedValue)) {
        try {
          // Apply post-validation logic (e.g., converting to number, clamping to range)
          const correctedValue = postValidationAction(trimmedValue);

          setDebouncedValue(correctedValue);
          lastValidDebouncedValue.current = correctedValue;

          // If the corrected value differs from the user's raw input (e.g., due to clamping),
          // sync the input field back to the corrected value.
          if (String(correctedValue) !== trimmedValue) {
            setInputValue(String(correctedValue));
          }
        } catch (error) {
          console.error("Error during postValidationAction:", error);
          // Rollback input to the last valid state if processing fails
          setInputValue(String(lastValidDebouncedValue.current));
        }
      } else {
        // Rollback input if validation fails
        setInputValue(String(lastValidDebouncedValue.current));
      }
    }, delay);
  };

  return [inputValue, debouncedValue, setValue];
}

export default useDebouncedValue;
