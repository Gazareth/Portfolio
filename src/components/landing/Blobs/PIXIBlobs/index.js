import React, { useState, useCallback, useRef } from 'react';

import { Stage, ParticleContainer, Container } from 'react-pixi-fiber';
import CirclesController from './Circle';
import timelineBoxes, { timelineInfo } from './Timeline/timelineBoxes';
import CWStageController from './CWStageController';
import plotter from './plotter';

import { getBreakPoint, getResponsiveValue, BlobAlign } from './Constants';

const ScreenSizeMode = getBreakPoint(window.innerWidth);
const blobAlign = getResponsiveValue(window.innerWidth, ScreenSizeMode, 'blobAlign');

const compactMode = blobAlign === BlobAlign.COMPACT;

const GlobalScale = compactMode ? 0.8 : 0.25 + 0.75 * Math.min(window.innerWidth / 2560, 1); // getResponsiveValue(window.innerWidth, ScreenSizeMode, 'globalScale');
console.log('Got global scale!', GlobalScale);

const VIEW_APP_PORTION = compactMode ? 1 : 0.8; // Height of app view vs total viewport
const MAX_VIEW_HEIGHT = VIEW_APP_PORTION * window.innerHeight;
const BATCH_VIEW_PORTION = 0.85; // height of a batch of blobs vs total view height;

/** **********************
 * Calculate Timeline
 */
const TIMELINE_ITEMS = timelineInfo.length;

// NEED TO STRETCH TIMELINE TO FIT exact amount of PAGES SO WE DON'T HAVE AWKWARD FINAL PAGE WITH A FEW BLOBS
const TIMELINE_GAP_MIN = 300; // distance in pixels between each timeline point
const TIMELINE_LENGTH_MIN = TIMELINE_GAP_MIN * TIMELINE_ITEMS; // extend timeline slightly to leave a 'future'
const BLOB_BATCH_LENGTH_MIN = Math.min(window.innerHeight * BATCH_VIEW_PORTION, TIMELINE_LENGTH_MIN);

const BLOB_BATCHES_PRECISE = TIMELINE_LENGTH_MIN / BLOB_BATCH_LENGTH_MIN;
const BLOB_BATCHES_MIN = Math.ceil(BLOB_BATCHES_PRECISE); // need to go to next page up
const TIMELINE_GAP =
  TIMELINE_GAP_MIN + (BLOB_BATCH_LENGTH_MIN * (1 + BLOB_BATCHES_MIN - BLOB_BATCHES_PRECISE)) / TIMELINE_ITEMS;

const TIMELINE_LENGTH = TIMELINE_GAP * TIMELINE_ITEMS;
const VIEW_LENGTH = Math.min(MAX_VIEW_HEIGHT, TIMELINE_LENGTH / BATCH_VIEW_PORTION);
const BLOB_BATCHES = Math.round(TIMELINE_LENGTH / VIEW_LENGTH);

// console.log(`${BLOB_BATCHES} blob batches of length ${BLOB_BATCH_LENGTH}! Viewpoints: ${BATCH_VIEWPOINTS}`);
// console.log(
//   `${TIMELINE_GAP} timeline gap ${TIMELINE_ITEMS}! ${BLOB_BATCHES_PRECISE} precise, ${BLOB_BATCH_LENGTH_MIN} length min`
// );
console.log('View height', VIEW_LENGTH);

const APP_DIMENSIONS = {
  width: compactMode ? window.innerWidth : Math.min(window.innerWidth * 0.9, 2048),
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

const APP_COMPACT_CENTER = {
  x: 0 - APP_DIMENSIONS.width * 0.1,
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

const BLOBSTREAM_WIDTH = compactMode
  ? APP_DIMENSIONS.width * 1.25
  : Math.min(Math.max(APP_DIMENSIONS.width * 0.15, 300), 500);

const BLOB_BATCH_LENGTH = (VIEW_LENGTH * BATCH_VIEW_PORTION) / GlobalScale;

const BATCH_VIEWPOINTS = new Array(BLOB_BATCHES)
  .fill(0, 0, BLOB_BATCHES)
  .map((_, i) => i * -BLOB_BATCH_LENGTH * GlobalScale);

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
      BLOB_BATCH_LENGTH,
      compactMode
    );

if (!CACHED) {
  window.localStorage.setItem(BLOBS_LOCAL_STORAGE_KEY, JSON.stringify(blobPointInfo));
}

const particleContainerProperties = {
  scale: true,
  position: false,
  rotation: false,
  uvs: false,
  tint: false,
};

const scaledContainerProperties = {
  scale: GlobalScale,
  pivot: { x: APP_DIMENSIONS.width / 2, y: APP_DIMENSIONS.height / 2 },
  position: {
    x: APP_DIMENSIONS.width * 0.5, // * GlobalScale,
    y: GlobalScale * (APP_DIMENSIONS.height * 0.535),
  },
};

const Blobs = () => {
  const particleContainer = useRef(null);
  const [startTimes, setStartTimes] = useState([new Date().getTime()]);
  const [viewingBatch, setViewing] = useState(0);

  const nextBatch = useCallback(
    downUp => {
      if (downUp) {
        if (viewingBatch < BLOB_BATCHES - 1) {
          setViewing(viewing => viewing + 1);
          const stageDiv = document.getElementById('stageDiv');
          stageDiv.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
          if (viewingBatch === startTimes.length - 1) {
            setStartTimes([...startTimes, new Date().getTime()]);
          }
        }
      } else if (viewingBatch > 0) {
        setViewing(viewing => viewing - 1);
      }
    },
    [startTimes, viewingBatch]
  );

  return (
    // <Stage app={app}>
    <Stage options={STAGE_OPTIONS} id="stageDiv">
      <ParticleContainer
        {...scaledContainerProperties}
        ref={particleContainer}
        maxSize={20000}
        properties={particleContainerProperties}
      >
        {/* <Rectangle {...BG_PROPS} /> */}
        <CirclesController
          circles={blobPointInfo.circles}
          startTimes={startTimes}
          particleContainer={particleContainer}
        />
      </ParticleContainer>
      <Container {...scaledContainerProperties}>
        {timelineBoxes({
          stageWidth: STAGE_DIMENSIONS.width,
          stageHeight: STAGE_DIMENSIONS.height,
          timelinePointsInfo: blobPointInfo.timelinePoints,
          startTimes,
          compactMode,
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
