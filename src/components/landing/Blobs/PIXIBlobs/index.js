import React, { useContext, useState, useMemo } from 'react';

import { Stage, Container } from 'react-pixi-fiber';
import CirclesController from './Circle';
import Rectangle from './Rectangle';
import timelineBoxes from './Timeline/timelineBoxes';
import plotter from './plotter';

const STAGE_DIMENSIONS = {
  width: window.innerWidth * 0.7,
  height: 2000,
};

const STAGE_CENTER = {
  x: STAGE_DIMENSIONS.width * 0.5,
  y: STAGE_DIMENSIONS.height * 0.5,
};

const STAGE_OPTIONS = {
  backgroundColor: 0x111111,
  width: STAGE_DIMENSIONS.width,
  height: STAGE_DIMENSIONS.height,
  antialias: true,
  // forceFXAA: true,
  // resolution: 2,
};

const BLOBSTREAM_WIDTH = Math.min(Math.max(STAGE_DIMENSIONS.width * 0.85, 1000), 1200);
const BLOBSTREAM_HEIGHT = STAGE_DIMENSIONS.height * 0.9;

const BG_PROPS = {
  ...STAGE_DIMENSIONS,
  fill: 0x202020,
};

const blobPointInfo = plotter(50, 50, BLOBSTREAM_WIDTH, BLOBSTREAM_HEIGHT, 45, STAGE_CENTER);
// const blobs = plotter(15, 15, STAGE_OPTIONS.width * 0.7, STAGE_OPTIONS.height * 0.7, 45, STAGE_CENTER);
// const blobs = plotter(12, 2, STAGE_OPTIONS.width * 0.85, STAGE_OPTIONS.height * 0.65, 0, STAGE_CENTER);

export const Blobs = () => (
  <Stage options={STAGE_OPTIONS}>
    <Container>
      <Rectangle {...BG_PROPS} />
      <CirclesController blobs={blobPointInfo} />
      {timelineBoxes({
        stageWidth: STAGE_DIMENSIONS.width,
        stageHeight: STAGE_DIMENSIONS.height,
        timelinePointsInfo: blobPointInfo.timelinePoints,
      })}
    </Container>
  </Stage>
);
