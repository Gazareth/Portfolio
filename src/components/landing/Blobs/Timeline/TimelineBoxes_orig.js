import React from 'react';
import TimelineBox from './TimelineBox';

const BOX_WIDTH = 362;
const BOX_POINT_OFFSET_X = 130;
const BOX_POINT_OFFSET_Y = 65;

const IMAGE_WIDTH = 152; // All images have the same width but different heights

const timelineInfo = [
  {
    imgSrc: 'CoffeeCup.png',
    imgHeight: 152,
    dateText: 'March 2016',
    timelineText: 'Chetwood was formed',
  },
  //   {
  //     imgSrc: 'HighStreet.png',
  //     imgHeight: 152,
  //     dateText: 'January 2016',
  //     timelineText: 'Wrexham office opened',
  //   },
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

        // "BOTTOM POINT" - Where the line from the timeline point joins the box
        const bottomPointX = info.x + (info.isLeft ? -1 : 1) * (BOX_WIDTH + BOX_POINT_OFFSET_X - info.imgWidth / 2);
        const bottomPointY = info.y + BOX_POINT_OFFSET_Y;

        const boxPosX = bottomPointX + (info.isLeft ? -1 : 1) * (IMAGE_WIDTH / 2);
        const boxPosY = bottomPointY + boxHeight;

        return (
          <TimelineBox
            key={info.dateText}
            boxPosition={p(boxPosX, boxPosY)}
            joinPointPosition={p(bottomPointX, bottomPointY)}
            timelinePointPosition={p(info.x, info.y)}
            boxWidth={BOX_WIDTH}
            boxHeight={boxHeight}
            dateText={info.dateText}
            image={`./images/${info.imgSrc}`}
            textWidth={BOX_WIDTH - IMAGE_WIDTH}
            text={info.timelineText}
          />
        );
      })}
    </>
  );
};

export default TimelineBoxes;
