// src/utils/distributions.js

// Ticks calculation helper for charts, ensuring nice round numbers and appropriate spacing
export const getAxisConfig = (
  dataMax,
  explicitMin = "auto",
  explicitMax = "auto",
  dataMin = 0,
) => {
  let min =
    explicitMin !== null && explicitMin !== "auto" ? explicitMin : dataMin;
  let max =
    explicitMax !== null && explicitMax !== "auto" ? explicitMax : dataMax || 0;

  // Odstránenie mikroskopických odchýlok a chýb plávajúcej desatinnej čiarky
  max = Number(Number(max).toPrecision(10));
  min = Number(Number(min).toPrecision(10));

  // Ak sa hodnota veľmi blíži k celému číslu (napr. 10.001 pre rovnomerné rozdelenie), zaokrúhlime ju na rovné číslo.
  if (explicitMax === "auto" || explicitMax === null) {
    if (Math.abs(Math.round(max) - max) < 0.05 && max > 1) {
      max = Math.round(max);
    }
  }

  if (max === 0 && min === 0) max = 1;

  const range = max - min;
  let step = 1;

  // Rozhodovací strom pre ideálny "krok" (step) medzi číslami na osi
  if (range === 0) {
    step = 0.1;
  } else if (range > 10) {
    if (range <= 25) step = 5;
    else if (range <= 50) step = 10;
    else if (range <= 100) step = 20;
    else if (range <= 250) step = 50;
    else step = Math.ceil(range / 50) * 10; // Univerzálny fallback pre veľmi veľké čísla
  } else if (range >= 3) {
    if (range <= 4) step = 0.5;
    else if (range <= 7) step = 1;
    else step = 2; // Pre rozpätie 8-10 bude krok 2
  } else if (range >= 0.5) {
    if (range <= 0.7) step = 0.1;
    else if (range <= 1.5) step = 0.2;
    else if (range <= 2.5) step = 0.5;
    else step = 0.5;
  } else {
    // Pre veľmi malé čísla (napr. os Y pri hodnote 0.04) prispôsobíme rád
    const magnitude = Math.pow(10, Math.floor(Math.log10(range)));
    const normalized = range / magnitude;
    if (normalized <= 1.5) step = 0.2 * magnitude;
    else if (normalized <= 3) step = 0.5 * magnitude;
    else if (normalized <= 7) step = 1 * magnitude;
    else step = 2 * magnitude;
  }

  let niceMax = max;
  let niceMin = min;

  if (explicitMax === "auto" || explicitMax === null) {
    // Vypočítanie pekného maxima na základe kroku (napr. 45.29 pri kroku 10 sa zaokrúhli presne na 50)
    niceMax = Math.ceil(Number(((max - 1e-7) / step).toPrecision(10))) * step;
  }

  if (explicitMin === "auto" || explicitMin === null) {
    niceMin = Math.floor(Number(((min + 1e-7) / step).toPrecision(10))) * step;
  }

  // Vygenerovanie presných bodov (ticks) pre mriežku a os
  const ticks = [];
  let startTick = Math.floor(Number((niceMin / step).toPrecision(10))) * step;

  for (let t = startTick; t <= niceMax + 1e-9; t += step) {
    if (t >= niceMin - 1e-9) {
      ticks.push(Number(t.toPrecision(10)));
    }
  }

  // Vypočítanie potrebných desatinných miest pre popisky
  let decimals = 0;
  const stepStr = Number(step.toPrecision(10)).toString();
  if (stepStr.includes(".")) {
    if (stepStr.includes("e-")) {
      decimals = parseInt(stepStr.split("e-")[1], 10);
    } else {
      decimals = stepStr.split(".")[1].length;
    }
  }

  return {
    domain: [niceMin, niceMax],
    ticks: ticks,
    formatTick: (val) => {
      if (val === null || val === undefined) return "";
      return Number(Number(val).toFixed(decimals));
    },
  };
};

// Error function approximation
export function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429;
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

// hodnoty pre Chí kvadrát rozdelenie
const g = 7;
const p = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

// PDF – hustota normálneho rozdelenia
export function normalPDF(x, mean = 0, sd = 1) {
  return (
    (1 / (sd * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * Math.pow((x - mean) / sd, 2))
  );
}

// CDF – distribučná funkcia normálneho rozdelenia
export function normalCDF(x, mean = 0, sd = 1) {
  return 0.5 * (1 + erf((x - mean) / (sd * Math.sqrt(2))));
}

//  --- Gamma funkcia (Lanczosova aproximácia) ---
function gamma(z) {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  } else {
    z -= 1;
    let x = p[0];
    for (let i = 1; i < g + 2; i++) {
      x += p[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
}

export function chiSquarePDF(x, k) {
  // k = stupne voľnosti
  if (x <= 0 || k <= 0) {
    return 0; // PDF je definovaná len pre x > 0 a k > 0
  }
  const k_half = k / 2;
  const numerator = Math.pow(x, k_half - 1) * Math.exp(-x / 2);
  const denominator = Math.pow(2, k_half) * gamma(k_half);

  // Ošetrenie delenia nulou alebo neplatných hodnôt Gamma funkcie
  if (denominator === 0 || isNaN(denominator) || !isFinite(denominator)) {
    // Pre veľmi malé k/2 môže gamma(k/2) byť problematické
    // Môžeme vrátiť 0 alebo vyhodiť chybu, podľa potreby
    // Vrátenie 0 je bezpečnejšie pre graf
    return 0;
  }

  const result = numerator / denominator;
  // Ošetrenie prípadov, kedy výsledok nie je platné číslo
  if (isNaN(result) || !isFinite(result)) {
    return 0;
  }

  return result;
}

// Helper for combinations (n choose k)
export const getCombinations = (n, k) => {
  if (k === 0 || k === n) return 1;
  let c = 1;
  for (let i = 1; i <= k; i++) {
    c = (c * (n - i + 1)) / i;
  }
  return c;
};

// Binomial Probability Mass Function (PMF)
export const binomialPMF = (k, n, p) => {
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  return getCombinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

// Pomocná funkcia pre faktoriál
export const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Pravdepodobnostná funkcia Poissonovho rozdelenia (PMF)
export const poissonPMF = (k, lambda) => {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

// Exponenciálne rozdelenie (PDF)
export const exponentialPDF = (x, lambda) => {
  if (x < 0) return 0;
  return lambda * Math.exp(-lambda * x);
};

// Hustota pravdepodobnosti Studentovho t-rozdelenia (PDF)
export const studentTPDF = (x, k) => {
  const numerator = gamma((k + 1) / 2);
  const denominator = Math.sqrt(k * Math.PI) * gamma(k / 2);
  const base = 1 + (x * x) / k;
  const exponent = -(k + 1) / 2;
  return (numerator / denominator) * Math.pow(base, exponent);
};

// Hustota pravdepodobnosti Fisherovho F-rozdelenia (PDF)
export const fisherFPDF = (x, d1, d2) => {
  if (x <= 0) return 0;

  const num1 = gamma((d1 + d2) / 2);
  const den1 = gamma(d1 / 2) * gamma(d2 / 2);
  const factor1 = Math.pow(d1 / d2, d1 / 2);
  const factor2 = Math.pow(x, d1 / 2 - 1);
  const factor3 = Math.pow(1 + (d1 * x) / d2, -(d1 + d2) / 2);

  const result = (num1 / den1) * factor1 * factor2 * factor3;
  return isNaN(result) || !isFinite(result) ? 0 : result;
};
