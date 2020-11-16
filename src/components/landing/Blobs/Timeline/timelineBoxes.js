import React from 'react';
import TimelineBox from './TimelineBox';

import CoffeeCup from './Images/CoffeeCup.png';
import HighStreet from './Images/HighStreet.png';
import LondonBridge from './Images/LondonBridge.png';

import { DEFAULT_RADII } from '../plotter';

const BOX_WIDTH = 362;
const TIMELINE_POINT_OFFSET = DEFAULT_RADII * 1.44;
const BOX_POINT_OFFSET_X_LEFT = DEFAULT_RADII * 1.2 + 60;
const BOX_POINT_OFFSET_X_RIGHT = BOX_POINT_OFFSET_X_LEFT + 30;
const BOX_POINT_OFFSET_Y = 38;

const IMAGE_WIDTH = 152; // All images have the same width but different heights
const BOX_JOIN_OFFSET = IMAGE_WIDTH * 0.35;

const timelineInfo = [
  {
    imgSrc: CoffeeCup,
    imgHeight: 152,
    dateText: 'March 2016',
    timelineText: 'Chetwood was formed',
  },
  {
    imgSrc: HighStreet,
    imgHeight: 152,
    dateText: 'January 2017',
    timelineText: 'Wrexham office opened',
  },
  {
    imgSrc: LondonBridge,
    imgHeight: 168,
    dateText: 'September 2017',
    timelineText: 'Backed by Elliott Advisors UK with £150m investment',
  },
  // {
  //   imgSrc: LondonBridge,
  //   imgHeight: 168,
  //   dateText: 'February 2018',
  //   timelineText: 'LiveLend launched, under a Consumer Credit Licence',
  // },
];

// Make a point
const p = (x, y) => ({ x, y });

const TimelineBoxes = ({ timelinePointsInfo, stageWidth, stageHeight }) => {
  const stuff = 0;
  return (
    <>
      {timelinePointsInfo.map((pointInfo, i) => {
        if (!timelineInfo[i]) return null;
        const info = { ...pointInfo, ...timelineInfo[i] };
        console.log('Building timelineBox: ', info);
        const boxHeight = info.imgHeight;
        const BOX_POINT_OFFSET_X = info.isLeft ? BOX_POINT_OFFSET_X_LEFT : BOX_POINT_OFFSET_X_RIGHT;

        // "BOTTOM POINT" - Where the line from the timeline point joins the box
        const bottomPointX = info.x + (info.isLeft ? -1 : 1) * (BOX_WIDTH + BOX_POINT_OFFSET_X - BOX_JOIN_OFFSET);
        const bottomPointY = info.y - BOX_POINT_OFFSET_Y;

        const boxPosX = bottomPointX + (info.isLeft ? -BOX_JOIN_OFFSET : -BOX_WIDTH + BOX_JOIN_OFFSET);
        const boxPosY = bottomPointY - boxHeight;

        const offsetTimelinePosition = p(info.x + TIMELINE_POINT_OFFSET * (info.isLeft ? -1 : 1), info.y);
        console.log(' Still Building timelineBox...', boxPosX, boxPosY);

        return (
          <TimelineBox
            key={info.dateText}
            boxPosition={p(boxPosX, boxPosY)}
            joinPointPosition={p(bottomPointX, bottomPointY)}
            timelinePointPosition={offsetTimelinePosition}
            boxWidth={BOX_WIDTH}
            boxHeight={boxHeight}
            dateText={info.dateText}
            image={info.imgSrc}
            textWidth={BOX_WIDTH - IMAGE_WIDTH}
            imageWidth={IMAGE_WIDTH}
            text={info.timelineText}
          />
        );
      })}
    </>
  );
};

export default TimelineBoxes;
