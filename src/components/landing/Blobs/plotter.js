import * as PIXI from 'pixi.js';

const CHETWOOD_MAIN = PIXI.utils.string2hex('#00d364');

const colours = [
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
  '#ff90c3',
  '#846b2c',
  '#5d5130',
  '#ff5e71',
  '#392b40',
  '#4c363e',
  '#35414c',
  '#0d2332',
  '#141e30',
  '#004c44',
].map(col => PIXI.utils.string2hex(col));

export const DEFAULT_RADII = 18;
const TIMELINE_RADIUS = DEFAULT_RADII * 1.05;

const getRandomColour = () => colours[Math.floor(Math.random() * colours.length)];

class CWCircle {
  constructor(x, y, radius, fill, opacity = 1) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill = fill;
    this.opacity = opacity;

    this.delay = 0;
    this.enterTime = 0;

    this.entered = false;
  }
}

// // Box muller transform to get a normal distribution (https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve)
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

const NUM_TIMELINE_POINTS = 7;

export default (spacingX, spacingY, width, height, angle, center) => {
  const nx = Math.round(width / spacingX);
  const ny = Math.round(height / spacingY);

  // GENERATE and center lattice of points
  const gridList = dedimensionalise(makeGrid(nx, ny, width, height));
  const centeredGrid = gridList.map(point => ({ x: point.x + center.x, y: point.y + center.y }));

  // ROTATE by specified angle
  const rotatedGrid = centeredGrid.map(point => rotatePoint(point, angle, center));

  // DETECT circles too far away from center line
  // Plot a 'center' line
  const centerLineRes = 8; // how many points make up center line -- "resolution"
  const juristiction = (0.5 * height) / centerLineRes; // distance (y-axis) within which a circle is classed as 'belonging to' a line point
  const xMax = width * 0.23; // distance (x-axis) outside of which a circle is discarded
  const centerLine = new Array(centerLineRes).fill(1).map((_, i) => ({
    x: center.x,
    y: height * 0.035 + center.y - height * 0.5 + (i * height * 0.9) / (centerLineRes - 1),
  }));

  const getOutlierFactor = point => {
    // Find line point for y-axis juristiction
    const juristicialLinePoint = centerLine.find(linePoint => Math.abs(linePoint.y - point.y) <= juristiction + 1);
    const outlierFactor = juristicialLinePoint ? Math.min(1, Math.abs(juristicialLinePoint.x - point.x) / xMax) : 1;

    return outlierFactor;
  };

  // FILTER circles that are too far away from the main stream
  // - How far off from the 'mainstream' they are determines if they are shown
  const filteredPoints = rotatedGrid.filter(point => {
    const outlier = getOutlierFactor(point);
    const distFactor = Math.abs(randnBm() - 0.5) * 2;
    return outlier ** 1.15 < 0.45 ? distFactor ** 2.25 > outlier ** 2.75 : false;
  });

  // Set up stuff for producing timeline points periodically
  let currentBreakPoint = 0;
  const breakPoints = new Array(NUM_TIMELINE_POINTS + 1)
    .fill(1)
    .map((_, i) => ({ x: center.x, y: center.y - height * 0.5 + (i * height) / (NUM_TIMELINE_POINTS - 1) }))
    .slice(1);
  const timelinePoints = [];
  let isLeft = true; // start on the left side, alternate

  // Prepare instances of the Circle class
  // First ones are rendered first (although there is some randomness) so have shortest delay
  // Randomize radius
  const gridCircles = filteredPoints.map((point, i) => {
    let isTimelinePoint = false;
    if (point.y > 0 && point.y < height) {
      const nextBreakPos = currentBreakPoint + 1 > breakPoints.length ? height : breakPoints[currentBreakPoint].y;
      // console.log('next breakpoint: ', nextBreakPos);
      if (point.y > nextBreakPos) {
        let goToNext = true;
        if (!isLeft) {
          goToNext = point.x > center.x + 0.25 * xMax;
        } else {
          goToNext = point.x < center.x - 0.1 * xMax;
        }
        if (goToNext) {
          currentBreakPoint += 1;
          isTimelinePoint = true;
          timelinePoints.push(point);
          isLeft = !isLeft;
        }
      }
    }
    const color = isTimelinePoint ? CHETWOOD_MAIN : getRandomColour();
    const radiusFactor = (randnBm() * 0.665 + 0.335) ** 0.1 * (2.66 - 0.5 * getOutlierFactor(point));
    const radius = isTimelinePoint
      ? TIMELINE_RADIUS
      : (Math.abs(randnBm() - 0.6) + 0.25) ** 1.35 * DEFAULT_RADII * radiusFactor;
    const xOffset = ((randnBm() ** 1.3 - 0.5) * ((0.35 * width) / nx) * DEFAULT_RADII) / radius;
    const yOffset = ((randnBm() ** 1.3 - 0.5) * ((0.35 * height) / ny) * DEFAULT_RADII) / radius;

    return new CWCircle(point.x + xOffset, point.y + yOffset, radius, color);
  });

  // const centerCircles = centerLine.map(
  //   (point, i) => new CWCircle(point.x, point.y, DEFAULT_RADII, getSequentialColor(i))
  // );

  return { circles: gridCircles, timelinePoints };
};
