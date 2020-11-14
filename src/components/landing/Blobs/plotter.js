import * as PIXI from 'pixi.js';

const colours = ['#ff0000', '#00ff00', '#ff00ff', '#aa0000', '#00ffff'].map(
  col => console.log('Translating colour to hex: ', col, PIXI.utils.string2hex(col)) || PIXI.utils.string2hex(col)
);

const getRandomColour = () => colours[Math.floor(Math.random() * colours.length)];

// Box muller transform to get a normal distribution (https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve)
function randnBm() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randnBm(); // resample between 0 and 1
  return num;
}

const getRandomDistr = (min, max, skew) => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randnBm(min, max, skew); // resample between 0 and 1 if out of range
  num **= skew; // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
};

class CWCircle {
  constructor(x, y, radius, fill) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill = fill;

    this.delay = 0;
    this.enterTime = 0;

    this.entered = false;
  }
}

const DEFAULT_RADII = 10;

// Plots blobs of random sizes and colours along a line
export default (n, startX, startY, width, length) => {
  const plotPos = { x: startX, y: startY };
  const dy = length / n;

  const points = Array(n)
    .fill(1)
    .map((_, i) => ({ x: plotPos.x, y: plotPos.y + i * dy }));

  return points.map(point => {
    const offset = randnBm() * width - width * 0.5;
    return new CWCircle(point.x + offset, point.y, DEFAULT_RADII, getRandomColour());
  });
};
