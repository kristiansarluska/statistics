import { normalCDF, studentTCDF } from "./distributions";

export const POP_MEAN = 46.2226;
export const POP_STD = 3.7576;

const binSearch = (fn, p, lo, hi) => {
  let mid;
  for (let i = 0; i < 80; i++) {
    mid = (lo + hi) / 2;
    fn(mid) < p ? (lo = mid) : (hi = mid);
  }
  return mid;
};

export const invNorm = (p) => binSearch((x) => normalCDF(x), p, -6, 6);
export const invT = (p, df) => binSearch((x) => studentTCDF(x, df), p, 0, 30);

export const getCrit = (cl, type, knowSigma, df) => {
  const alpha = { 90: 0.1, 95: 0.05, 99: 0.01 }[cl];
  const p = type === "two" ? 1 - alpha / 2 : 1 - alpha;
  return knowSigma ? invNorm(p) : invT(p, df);
};

export const buildCI = (mean, sd, n, cl, type, knowSigma) => {
  const se = (knowSigma ? POP_STD : sd) / Math.sqrt(n);
  const crit = getCrit(cl, type, knowSigma, n - 1);
  const lower = type === "right" ? -Infinity : mean - crit * se;
  const upper = type === "left" ? Infinity : mean + crit * se;
  const hit =
    (lower === -Infinity || lower <= POP_MEAN) &&
    (upper === Infinity || POP_MEAN <= upper);
  return { lower, upper, hit, crit, se };
};
