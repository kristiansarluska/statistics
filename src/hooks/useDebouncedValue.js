// src/hooks/useDebouncedValue.js
import { useState, useEffect, useRef } from "react";

/**
 * Vlastný hook pre oneskorenú hodnotu s validáciou a korekciou.
 * @param {any} initialValue - Počiatočná hodnota.
 * @param {number} [delay=1000] - Oneskorenie v milisekundách.
 * @returns {[string, any, function(newValue: string, options?: {validator?: function, postValidationAction?: function}): void]}
 * Pole obsahujúce:
 * - inputValue: Aktuálna hodnota v inpute (vždy string).
 * - debouncedValue: Oneskorená (a validovaná/korigovaná) hodnota.
 * - setValue: Funkcia na nastavenie novej hodnoty z inputu.
 */
function useDebouncedValue(initialValue, delay = 1000) {
  // Stav pre hodnotu inputu (vždy string, aby zvládol aj prázdny stav)
  const [inputValue, setInputValue] = useState(String(initialValue));
  // Stav pre oneskorenú hodnotu (môže byť string alebo number, podľa postValidationAction)
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  // Ref pre uloženie poslednej platnej debounced hodnoty
  const lastValidDebouncedValue = useRef(initialValue);
  // Ref pre časovač
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Keď sa komponent odmontuje, zrušíme časovač
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []); // Spustí sa len raz

  /**
   * Nastaví novú hodnotu, spustí debounce a validáciu.
   * @param {string} newValue - Nová hodnota z inputu.
   * @param {object} [options] - Možnosti validácie a korekcie.
   * @param {function(value: string): boolean} [options.validator=(val) => true] - Funkcia na validáciu formátu vstupu. Mala by vrátiť true pre platný formát (vrátane prázdneho stringu, ak je povolený).
   * @param {function(value: any): any} [options.postValidationAction=(val) => val] - Funkcia, ktorá sa aplikuje na hodnotu *po* úspešnej základnej validácii (napr. clamping, konverzia na číslo). Jej výsledok sa nastaví do debouncedValue.
   */
  const setValue = (newValue, options = {}) => {
    const { validator = (val) => true, postValidationAction = (val) => val } =
      options;

    // Vždy aktualizuj okamžitú hodnotu inputu (ako string)
    setInputValue(newValue); // Už je to string z event.target.value

    // Zruš predchádzajúci časovač
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Nastav nový časovač
    debounceTimer.current = setTimeout(() => {
      const trimmedValue = String(newValue).trim(); // Ostriháme medzery

      // Špeciálna logika pre prázdny string: nechaj input prázdny, nemen debouncedValue
      if (trimmedValue === "") {
        // Input zostane prázdny (už je nastavený cez setInputValue vyššie)
        // Neaktualizuj debouncedValue ani lastValidDebouncedValue
        // Graf bude používať poslednú platnú hodnotu z 'debouncedValue' stavu
        return; // Ukonči spracovanie
      }

      // Validácia formátu až po uplynutí času
      if (validator(trimmedValue)) {
        // Skús aplikovať post-validačnú akciu (napr. clamping, konverzia na číslo)
        // Použijeme try-catch pre prípad, že by postValidationAction zlyhala (napr. pri parseFloat)
        try {
          const correctedValue = postValidationAction(trimmedValue);

          setDebouncedValue(correctedValue); // Nastav debounced hodnotu (môže byť string alebo number)
          lastValidDebouncedValue.current = correctedValue; // Ulož ako poslednú platnú

          // Ak sa hodnota po korekcii zmenila oproti *ostrihanému* vstupu, aktualizuj aj input
          // Porovnávame ako stringy
          if (String(correctedValue) !== trimmedValue) {
            setInputValue(String(correctedValue));
          }
        } catch (error) {
          console.error("Error during postValidationAction:", error);
          // Akcia zlyhala, vráť input na poslednú platnú hodnotu
          setInputValue(String(lastValidDebouncedValue.current));
        }
      } else {
        // Ak validácia formátu zlyhala (a vstup nie je prázdny), vráť inputValue na poslednú platnú hodnotu
        setInputValue(String(lastValidDebouncedValue.current));
        // DebouncedValue zostáva na poslednej platnej hodnote
      }
    }, delay);
  };

  // Vrátime pole: [hodnota pre input (string), oneskorená hodnota, funkcia na nastavenie]
  return [inputValue, debouncedValue, setValue];
}

export default useDebouncedValue;
