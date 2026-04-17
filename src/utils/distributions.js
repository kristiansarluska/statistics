// src/utils/distributions.js

/**
 * Generates human-readable "pretty" ticks for chart axes.
 */
export const getAxisConfig = (maxValue, userMin, userMax, dataMin = 0) => {
  const min = userMin !== null ? userMin : dataMin;
  const max =
    userMax !== null && typeof userMax === "number" ? userMax : maxValue;

  const range = max - min;
  if (range === 0)
    return {
      domain: [min, max + 1],
      ticks: [min, max + 1],
      formatTick: (v) => v,
    };

  // Calculate a nice step size
  const targetTicks = 5;
  const rawStep = range / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalizedStep = rawStep / magnitude;

  let niceStep;
  if (normalizedStep < 1.5) niceStep = 1;
  else if (normalizedStep < 3) niceStep = 2;
  else if (normalizedStep < 7) niceStep = 5;
  else niceStep = 10;

  const step = niceStep * magnitude;

  // Generate ticks starting from the first multiple of step below or at min
  const startTick = Math.floor(min / step) * step;
  const ticks = [];
  for (let tick = startTick; tick <= max + step * 0.5; tick += step) {
    if (tick >= min) ticks.push(Number(tick.toFixed(10))); // avoid floating point errors
  }

  return {
    domain: [
      min,
      userMax !== null ? userMax : Math.max(max, ticks[ticks.length - 1]),
    ],
    ticks: ticks,
    formatTick: (val) => {
      if (val === 0) return "0";
      const absVal = Math.abs(val);
      if (absVal < 0.001 || absVal >= 10000) return val.toExponential(1);
      // Dynamic precision based on step magnitude
      const precision =
        step < 1 ? Math.max(0, Math.ceil(-Math.log10(step))) : 0;
      return val.toFixed(precision);
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

export function chiSquareCDF(x, k) {
  if (x <= 0 || k <= 0) return 0;
  const s = k / 2;
  const z = x / 2;

  // Výpočet pomocou nekonečného radu pre neúplnú gama funkciu
  let sum = 1 / s;
  let term = 1 / s;
  for (let i = 1; i < 200; i++) {
    term = (term * z) / (s + i);
    sum += term;
    if (term < 1e-12) break; // Zastavíme, keď je ďalší príspevok zanedbateľný
  }

  const result = ((Math.exp(-z) * Math.pow(z, s)) / gamma(s)) * sum;
  return isNaN(result) || !isFinite(result) ? 0 : result;
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

// Exponenciálne rozdelenie (CDF)
export const exponentialCDF = (x, lambda) => {
  if (x < 0) return 0;
  return 1 - Math.exp(-lambda * x);
};

// Hustota pravdepodobnosti Studentovho t-rozdelenia (PDF)
export const studentTPDF = (x, k) => {
  const numerator = gamma((k + 1) / 2);
  const denominator = Math.sqrt(k * Math.PI) * gamma(k / 2);
  const base = 1 + (x * x) / k;
  const exponent = -(k + 1) / 2;
  return (numerator / denominator) * Math.pow(base, exponent);
};

// Distribučná funkcia Studentovho t-rozdelenia (CDF) - Numerická integrácia
export const studentTCDF = (x, k) => {
  if (x === 0) return 0.5;
  const isNegative = x < 0;
  const absX = Math.abs(x);

  // Simpsonovo pravidlo pre výpočet integrálu od 0 po |x|
  const n = 100; // Počet krokov (musí byť párne)
  const h = absX / n;
  let sum = studentTPDF(0, k) + studentTPDF(absX, k);

  for (let i = 1; i < n; i++) {
    const t = i * h;
    sum += (i % 2 === 0 ? 2 : 4) * studentTPDF(t, k);
  }

  const integral = (h / 3) * sum;
  const result = 0.5 + integral;

  // Využívame symetriu rozdelenia
  return isNegative ? 1 - result : result;
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

// Cumulative Distribution Function for Fisher's F-distribution (Numerical Integration)
export const fisherFCDF = (x, d1, d2) => {
  if (x <= 0) return 0;

  const n = 100; // Number of integration steps (must be even)
  const h = x / n;

  // For d1 < 2, PDF goes to infinity at x=0, so we start slightly above 0
  let sum = fisherFPDF(1e-5, d1, d2) + fisherFPDF(x, d1, d2);

  for (let i = 1; i < n; i++) {
    const t = i * h;
    sum += (i % 2 === 0 ? 2 : 4) * fisherFPDF(t, d1, d2);
  }

  const result = (h / 3) * sum;
  // Clamp to 1 to prevent floating point inaccuracies from exceeding 100%
  return Math.min(result, 1);
};

// Pridaj do src/utils/distributions.js

// Generovanie náhodného čísla z normálneho rozdelenia (Box-Muller)
export const randomNormal = (mean, stdDev) => {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
};

// Hustota pravdepodobnosti normálneho rozdelenia (PDF)
export const normalPdf = (x, mean, stdDev) => {
  const variance = stdDev * stdDev;
  return (
    (1 / Math.sqrt(2 * Math.PI * variance)) *
    Math.exp(-Math.pow(x - mean, 2) / (2 * variance))
  );
};

// Pridaj na koniec súboru src/utils/distributions.js

// Kvantily štandardizovaného normálneho rozdelenia (Z-skóre) pre bežné hladiny významnosti
export const getZCriticalValue = (confidenceLevel) => {
  if (confidenceLevel === 0.9) return 1.645;
  if (confidenceLevel === 0.95) return 1.96;
  if (confidenceLevel === 0.99) return 2.576;
  return 1.96; // default 95%
};

// Aproximácia kvantilu Studentovho t-rozdelenia
// Pre presné akademické účely sa často používa aproximácia cez Z-skóre pre n > 30,
// a pre menšie n presnejší výpočet. Tu je zjednodušená presná tabuľková interpolácia/aproximácia.
export const getTCriticalValue = (confidenceLevel, df) => {
  const z = getZCriticalValue(confidenceLevel);
  if (df <= 0) return z;

  // Aproximácia Cornish-Fisher / Peizer-Pratt pre t-kvantil
  // Pre vysoké stupne voľnosti sa t blíži k Z
  if (df > 120) return z;

  const z2 = z * z;
  const z3 = z2 * z;
  const z5 = z3 * z2;

  // Zlepšená aproximácia pre menšie vzorky
  return z + (z3 + z) / (4 * df) + (5 * z5 + 16 * z3 + 3 * z) / (96 * df * df);
};
