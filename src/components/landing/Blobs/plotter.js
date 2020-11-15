import * as PIXI from 'pixi.js';

const colours_old = ['#ff0000', '#00ff00', '#ff00ff', '#aa0000', '#00ffff'].map(
  col => console.log('Translating colour to hex: ', col, PIXI.utils.string2hex(col)) || PIXI.utils.string2hex(col)
);

const CHETWOOD_MAIN = '#00d364';

const colours = [
  CHETWOOD_MAIN,
  '#2b2d39',
  '#302b37',
  '#302b37',
  '#0b0d1f',
  '#72433a',
  '#024a44',
  '#0b0d1e',
  '#563c34',
  '#5b2927',
  '#344753',
  '#252737',
  '#af563c',
  '#271220',
  '#0a0c1e',
  '#171c30',
  '#2d3038',
  '#4e5758',
  '#392b40',
  '#008247',
].map(col => PIXI.utils.string2hex(col));

const DEFAULT_RADII = 20;

const getRandomColour = () => colours[Math.floor(Math.random() * colours.length)];
const getSequentialColor = index => {
  const maxColId = colours.length - 1;
  const id = index > maxColId ? index % maxColId : index;
  return colours[id];
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

// // Box muller transform to get a normal distribution (https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve)
// function randnBm() {
//   let u = 0;
//   let v = 0;
//   while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
//   while (v === 0) v = Math.random();
//   let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
//   num = num / 10.0 + 0.5; // Translate to 0 -> 1
//   if (num > 1 || num < 0) return randnBm(); // resample between 0 and 1
//   return num;
// }

// const getRandomDistr = (min, max, skew) => {
//   let u = 0;
//   let v = 0;
//   while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
//   while (v === 0) v = Math.random();
//   let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

//   num = num / 10.0 + 0.5; // Translate to 0 -> 1
//   if (num > 1 || num < 0) num = randnBm(min, max, skew); // resample between 0 and 1 if out of range
//   num **= skew; // Skew
//   num *= max - min; // Stretch to fill range
//   num += min; // offset to min
//   return num;
// };

// // Plots blobs of random sizes and colours along a line
// const plotNormal = (n, startX, startY, width, length) => {
//   const plotPos = { x: startX, y: startY };
//   const dy = length / n;

//   const points = Array(n)
//     .fill(1)
//     .map((_, i) => ({ x: plotPos.x, y: plotPos.y + i * dy }));

//   return points.map((point, i) => {
//     const offset = randnBm() * width - width * 0.5;
//     return new CWCircle(point.x + offset, point.y, DEFAULT_RADII, getSequentialColor(i));
//   });
// };

// Create a grid of n x n points to fit a plane (2D array)
const makeGrid = (nx, ny, width, height) => {
  const xSpacing = width / nx;
  const ySpacing = height / ny;
  const centerOffsetX = -xSpacing * (nx - 1) * 0.5;
  const centerOffsetY = -ySpacing * (ny - 1) * 0.5;

  const row = Array(nx).fill({ x: 0, y: 0 }); // a row of nx columns
  const rows = Array(ny).fill([...row]); // an array of ny rows
  return rows.map((currentRow, yIndex) =>
    currentRow.map((_, xIndex) => ({ x: centerOffsetX + xIndex * xSpacing, y: centerOffsetY + yIndex * ySpacing }))
  );
};

// Turn a 2D array into a 1D one
const dedimensionalise = grid2d => grid2d.reduce((grid1d, row) => [...grid1d, ...row], []);

// Rotate a point about a center - https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
const rotatePoint = (point, angle, center = { x: 0, y: 0 }) => {
  const { x: cx, y: cy } = center;
  const { x, y } = point;
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * (x - cx) + sin * (y - cy) + cx;
  const ny = cos * (y - cy) - sin * (x - cx) + cy;
  return { x: nx, y: ny };
};

export default (nx, ny, width, height, angle, center) => {
  // Create and center lattice
  const gridList = dedimensionalise(makeGrid(nx, ny, width, height));
  const centeredGrid = gridList.map(point => ({ x: point.x + center.x, y: point.y + center.y }));

  // Rotate by specified angle
  const rotatedGrid = centeredGrid.map(point => rotatePoint(point, angle, center));

  // Convert to Circle class instances
  const gridCircles = rotatedGrid.map(
    (point, i) => new CWCircle(point.x, point.y, DEFAULT_RADII, getSequentialColor(i))
  );

  // Filter out circles too far away from center line
  // Plot center line
  const centerLineRes = 7; // how many points make up center line -- "resolution"
  const juristiction = height / centerLineRes; // distance (y-axis) within which a circle is classed as 'belonging to' a line point
  const xMax = width * 0.25; // distance (x-axis) outside of which a circle is discarded
  const centerLine = new Array(centerLineRes).fill(1).map((point, i) => (i * height) / (centerLineRes - 1));
  const filteredCircles = gridCircles.filter(point => {
    // Find line point for y-axis juristiction
    const juristicialLinePoint = centerLine.find(linePoint => Math.abs(linePoint.y - point.y) < juristiction);
    return juristicialLinePoint ? Math.abs(linePoint.x - point.x) <= xMax : false;
  });

  return filteredCircles;
};
