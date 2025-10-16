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
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-x * x);
  return sign * y;
}

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
