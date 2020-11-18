import React, { useState, useCallback } from 'react';

import { Stage, Container } from 'react-pixi-fiber';
import { Global } from 'components/common/Layout/styles';
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

const BLOBSTREAM_WIDTH = Math.min(Math.max(APP_DIMENSIONS.width * 0.2, 350), 500);
const BLOBSTREAM_HEIGHT = APP_DIMENSIONS.height * 0.9;

const BLOB_BATCH_LENGTH = (STAGE_DIMENSIONS.height * 0.65) / GlobalScale;
const BLOB_BATCHES = Math.ceil(APP_DIMENSIONS.height / BLOB_BATCH_LENGTH);
const BATCH_VIEWPOINTS = new Array(BLOB_BATCHES).fill(0, 0, BLOB_BATCHES).map((_, i) => i * -BLOB_BATCH_LENGTH);

console.log(`${BLOB_BATCHES} blob batches of length ${BLOB_BATCH_LENGTH}! Viewpoints: ${BATCH_VIEWPOINTS}`);

// May need this because firefox doesn't antialias unless there's a rectangle behind
const BG_PROPS = {
  ...APP_DIMENSIONS,
  fill: 0x202020,
};

const CACHED = !true;
const BLOBS_LOCAL_STORAGE_KEY = 'cw-blobs-data';

const blobPointInfo = CACHED
  ? JSON.parse(window.localStorage.getItem(BLOBS_LOCAL_STORAGE_KEY))
  : plotter(50, APP_DIMENSIONS.width, APP_DIMENSIONS.height, BLOBSTREAM_WIDTH, APP_CENTER, 45, BLOB_BATCH_LENGTH);

// console.log('BlobsCached', blobPointInfo, blobPointInfo.circles);
// console.log('Blobs Plotted', plotter(50, BLOBSTREAM_WIDTH, BLOBSTREAM_HEIGHT, APP_CENTER, 45));

if (!CACHED) {
  window.localStorage.setItem(BLOBS_LOCAL_STORAGE_KEY, JSON.stringify(blobPointInfo));
}

const Blobs = () => {
  const [startTimes, setStartTimes] = useState([new Date().getTime()]);
  const [viewingBatch, setViewing] = useState(0);

  const nextBatch = useCallback(
    upDown => {
      if (upDown) {
        if (viewingBatch > 0) {
          setViewing(viewingBatch - 1);
        } else if (startTimes.length <= BLOB_BATCHES && viewingBatch < startTimes.length) {
          setStartTimes([...startTimes, new Date().getTime()]);
          setViewing(viewingBatch + 1);
        }
      }
    },
    [startTimes, viewingBatch]
  );

  return (
    // <Stage app={app}>
    <Stage options={STAGE_OPTIONS}>
      <Container
        scale={GlobalScale}
        pivot={{ x: APP_DIMENSIONS.width / 2, y: APP_DIMENSIONS.height / 2 }}
        position={{
          x: APP_DIMENSIONS.width * 0.5, // * GlobalScale,
          y: GlobalScale * (APP_DIMENSIONS.height * 0.5 + 200),
        }}
      >
        {/* <Rectangle {...BG_PROPS} /> */}
        <CirclesController circles={blobPointInfo.circles} startTimes={startTimes} />
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
        viewpoints={BATCH_VIEWPOINTS}
        viewingBatch={viewingBatch}
        selectBatchCallback={nextBatch}
      />
    </Stage>
  );
};

export default Blobs;
