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
const GlobalScale = 0.4 + 0.6 * Math.min(window.innerWidth / 2560, 1); // getResponsiveValue(window.innerWidth, ScreenSizeMode, 'globalScale');
console.log('Got global scale!', GlobalScale);

const TIMELINE_ITEMS = timelineInfo.length;

// NEED TO STRETCH TIMELINE TO FIT NEXT PAGE SO WE DON'T HAVE AWKWARD FINAL PAGE WITH A FEW BLOBS
const TIMELINE_GAP_MIN = 250; // distance in pixels between each timeline point
const TIMELINE_LENGTH_MIN = TIMELINE_GAP_MIN * TIMELINE_ITEMS;
const BLOB_BATCH_LENGTH_MIN = Math.min(window.innerHeight * 0.8, TIMELINE_LENGTH_MIN);

const BLOB_BATCHES_PRECISE = TIMELINE_LENGTH_MIN / BLOB_BATCH_LENGTH_MIN;
const BLOB_BATCHES_MIN = Math.ceil(BLOB_BATCHES_PRECISE); // need to go to next page up
const TIMELINE_GAP =
  TIMELINE_GAP_MIN + (BLOB_BATCH_LENGTH_MIN * (1 + BLOB_BATCHES_MIN - BLOB_BATCHES_PRECISE)) / TIMELINE_ITEMS;

const TIMELINE_LENGTH = TIMELINE_GAP * TIMELINE_ITEMS;
const VIEW_LENGTH = Math.min(window.innerHeight * 0.8, TIMELINE_LENGTH);
const BLOB_BATCHES = Math.round(TIMELINE_LENGTH / VIEW_LENGTH);

console.log(`${BLOB_BATCHES} blob batches of length ${BLOB_BATCH_LENGTH}! Viewpoints: ${BATCH_VIEWPOINTS}`);
// console.log(
//   `${TIMELINE_GAP} timeline gap ${TIMELINE_ITEMS}! ${BLOB_BATCHES_PRECISE} precise, ${BLOB_BATCH_LENGTH_MIN} length min`
// );

const APP_DIMENSIONS = {
  width: Math.min(window.innerWidth * 0.9, 2048),
  height: TIMELINE_LENGTH,
};

const STAGE_DIMENSIONS = {
  width: APP_DIMENSIONS.width,
  height: VIEW_LENGTH,
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

// const BLOB_BATCH_LENGTH = (STAGE_DIMENSIONS.height * 0.75) / GlobalScale;

const BLOB_BATCH_LENGTH = VIEW_LENGTH * 0.8;
// console.log(`${BLOB_BATCH_LENGTH} from ${APP_DIMENSIONS.height}! over: ${BLOB_BATCHES}`);

const BATCH_VIEWPOINTS = new Array(BLOB_BATCHES)
  .fill(0, 0, BLOB_BATCHES)
  .map((_, i) => i * -BLOB_BATCH_LENGTH * GlobalScale);

// console.log(`${BLOB_BATCHES} blob batches of length ${BLOB_BATCH_LENGTH}! Viewpoints: ${BATCH_VIEWPOINTS}`);
// console.log(`Calculated using ${APP_DIMENSIONS.height} divided by blob batches!`);

// May need this because firefox doesn't antialias unless there's a rectangle behind
const BG_PROPS = {
  ...APP_DIMENSIONS,
  fill: 0x202020,
};

const CACHED = !true;
const BLOBS_LOCAL_STORAGE_KEY = 'cw-blobs-data';

const blobPointInfo = CACHED
  ? JSON.parse(window.localStorage.getItem(BLOBS_LOCAL_STORAGE_KEY))
  : plotter(
      50,
      APP_DIMENSIONS.width,
      APP_DIMENSIONS.height,
      BLOBSTREAM_WIDTH,
      APP_CENTER,
      45,
      TIMELINE_ITEMS,
      BLOB_BATCH_LENGTH
    );

// console.log('BlobsCached', blobPointInfo, blobPointInfo.circles);
// console.log('Blobs Plotted', plotter(50, BLOBSTREAM_WIDTH, BLOBSTREAM_HEIGHT, APP_CENTER, 45));

if (!CACHED) {
  window.localStorage.setItem(BLOBS_LOCAL_STORAGE_KEY, JSON.stringify(blobPointInfo));
}

const Blobs = () => {
  const [startTimes, setStartTimes] = useState([new Date().getTime()]);
  const [viewingBatch, setViewing] = useState(0);

  const nextBatch = useCallback(
    downUp => {
      if (downUp) {
        if (viewingBatch < BLOB_BATCHES - 1) {
          setViewing(viewing => viewing + 1);
          console.log('Increase viewing batch!', viewingBatch + 1);
          if (viewingBatch === startTimes.length - 1) {
            setStartTimes([...startTimes, new Date().getTime()]);
          }
        }
      } else if (viewingBatch > 0) {
        setViewing(viewing => viewing - 1);
        console.log('Decrease viewing batch!', viewingBatch - 1);
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
          y: GlobalScale * (APP_DIMENSIONS.height * 0.5 + 250),
        }}
      >
        {/* <Rectangle {...BG_PROPS} /> */}
        <CirclesController circles={blobPointInfo.circles} startTimes={startTimes} />
        {timelineBoxes({
          stageWidth: STAGE_DIMENSIONS.width,
          stageHeight: STAGE_DIMENSIONS.height,
          timelinePointsInfo: blobPointInfo.timelinePoints,
          startTimes,
        })}
      </Container>
      <CWStageController
        globalScale={GlobalScale}
        stageWidth={STAGE_DIMENSIONS.width}
        stageHeight={STAGE_DIMENSIONS.height}
        viewpoints={BATCH_VIEWPOINTS}
        viewingBatch={viewingBatch}
        onFirstBatch={viewingBatch === 0}
        onLastBatch={viewingBatch === BLOB_BATCHES - 1}
        selectBatchCallback={nextBatch}
      />
    </Stage>
  );
};

export default Blobs;
