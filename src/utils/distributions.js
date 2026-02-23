// src/utils/distributions.js

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
