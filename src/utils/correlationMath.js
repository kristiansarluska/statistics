// src/utils/correlationMath.js

// Generates a random number from a standard normal distribution (Box-Muller transform)
const randomNormal = () => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// Generates array of objects {x, y} with a specific target correlation 'r'
export const generateCorrelatedData = (n, r) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const z1 = randomNormal();
    const z2 = randomNormal();

    // Transform independent normals to correlated normals
    const x = z1;
    const y = r * z1 + Math.sqrt(1 - r * r) * z2;

    // Scale and shift for visualization purposes (mean ~50, stdDev ~15)
    data.push({
      x: x * 15 + 50,
      y: y * 15 + 50,
    });
  }
  return data;
};

// Calculates Pearson correlation coefficient for given dataset
export const calculatePearson = (data) => {
  const n = data.length;
  if (n === 0) return 0;

  const sumX = data.reduce((acc, val) => acc + val.x, 0);
  const sumY = data.reduce((acc, val) => acc + val.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let num = 0,
    denX = 0,
    denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = data[i].x - meanX;
    const dy = data[i].y - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
};

// Calculates T-statistic for correlation significance test
export const calculateTStatistic = (r, n) => {
  if (Math.abs(r) === 1) return Infinity;
  return (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);
};
