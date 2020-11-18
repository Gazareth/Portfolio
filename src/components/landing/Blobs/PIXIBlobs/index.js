import React from 'react';

import { Stage, Container } from 'react-pixi-fiber';
import CirclesController from './Circle';
import Rectangle from './Rectangle';
import timelineBoxes, { timelineInfo } from './Timeline/timelineBoxes';
import CWStageController from './CWStageController';
import plotter from './plotter';

import { getBreakPoint, getResponsiveValue } from './Constants';

const ScreenSizeMode = getBreakPoint(window.innerWidth);
const GlobalScale = Math.min(window.innerWidth / 2560, 1) ** 0.65; // getResponsiveValue(window.innerWidth, ScreenSizeMode, 'globalScale');
console.log('Got global scale!', GlobalScale);

const TIMELINE_GAP = 275; // distance in pixels between each timeline point
const TIMELINE_POINTS = timelineInfo.length;

const APP_DIMENSIONS = {
  width: Math.min(window.innerWidth * 0.9, 2048),
  height: TIMELINE_GAP * TIMELINE_POINTS,
};

const STAGE_DIMENSIONS = {
  width: APP_DIMENSIONS.width,
  height: Math.min(window.innerHeight * 0.8, APP_DIMENSIONS.height),
};

const APP_CENTER = {
  x: APP_DIMENSIONS.width * 0.5,
  y: APP_DIMENSIONS.height * 0.5,
};

const STAGE_OPTIONS = {
  backgroundColor: 0x202020,
  width: STAGE_DIMENSIONS.width,
  height: STAGE_DIMENSIONS.height,
  antialias: true,
  forceCanvas: true,
  // forceFXAA: true,
  // resolution: 2,
};

const BLOBSTREAM_WIDTH = Math.min(Math.max(APP_DIMENSIONS.width * 0.35, 350), 500);
const BLOBSTREAM_HEIGHT = APP_DIMENSIONS.height * 0.9;

const BG_PROPS = {
  ...APP_DIMENSIONS,
  fill: 0x202020,
};

const CACHED = !true;
const BLOBS_LOCAL_STORAGE_KEY = 'cw-blobs-data';

const blobPointInfo = CACHED
  ? JSON.parse(window.localStorage.getItem(BLOBS_LOCAL_STORAGE_KEY))
  : plotter(50, APP_DIMENSIONS.width, APP_DIMENSIONS.height, BLOBSTREAM_WIDTH, APP_CENTER, 45);

// console.log('BlobsCached', blobPointInfo, blobPointInfo.circles);
// console.log('Blobs Plotted', plotter(50, BLOBSTREAM_WIDTH, BLOBSTREAM_HEIGHT, APP_CENTER, 45));

if (!CACHED) {
  window.localStorage.setItem(BLOBS_LOCAL_STORAGE_KEY, JSON.stringify(blobPointInfo));
}

// const blobs = plotter(15, 15, STAGE_OPTIONS.width * 0.7, STAGE_OPTIONS.height * 0.7, 45, APP_CENTER);
// const blobs = plotter(12, 2, STAGE_OPTIONS.width * 0.85, STAGE_OPTIONS.height * 0.65, 0, APP_CENTER);

// const app = new PIXI.Application(STAGE_OPTIONS);

const Blobs = () => (
  // <Stage app={app}>
  <Stage options={STAGE_OPTIONS}>
    <Container
      scale={GlobalScale}
      pivot={{ x: APP_DIMENSIONS.width / 2, y: APP_DIMENSIONS.height / 2 }}
      position={{
        x: APP_DIMENSIONS.width * 0.5, // * GlobalScale,
        y: APP_DIMENSIONS.height * 0.5 - APP_DIMENSIONS.height * 0.5 * (1 - GlobalScale),
      }}
    >
      {/* <Rectangle {...BG_PROPS} /> */}
      <CirclesController circles={blobPointInfo.circles} />
      {timelineBoxes({
        stageWidth: STAGE_DIMENSIONS.width,
        stageHeight: STAGE_DIMENSIONS.height,
        timelinePointsInfo: blobPointInfo.timelinePoints,
      })}
    </Container>
    <CWStageController
      globalScale={GlobalScale}
      stageWidth={STAGE_DIMENSIONS.width}
      stageHeight={STAGE_DIMENSIONS.height}
    />
  </Stage>
);

export default Blobs;
