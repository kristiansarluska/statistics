// src/utils/correlationMath.js

const normalCDF = (x) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
};

export const generateCorrelatedData = (n, targetR) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    let u1 = Math.random();
    let u2 = Math.random();
    while (u1 === 0) u1 = Math.random();

    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    const x = z1;
    const y = targetR * z1 + Math.sqrt(1 - targetR * targetR) * z2;

    data.push({
      x: x * 15 + 50,
      y: y * 15 + 50,
    });
  }
  return data;
};

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

export const calculateCorrelationSignificance = (r, n) => {
  if (n <= 2) return { tStat: 0, pValue: 1 };

  const safeR = Math.max(Math.min(r, 0.9999), -0.9999);
  const tStat = (safeR * Math.sqrt(n - 2)) / Math.sqrt(1 - safeR * safeR);

  // Aproximácia p-hodnoty cez normálne rozdelenie
  const pValue = 2 * (1 - normalCDF(Math.abs(tStat)));

  return { tStat, pValue };
};
