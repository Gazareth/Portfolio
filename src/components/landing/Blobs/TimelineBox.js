import React from 'react';
import { TextStyle } from 'pixi.js';
import { Text } from 'react-pixi-fiber';
import RoundedRectangle from './RoundedRectangle';
import DottedLine from './DottedLine';

import { DEFAULT_RADII } from './plotter';

// Date: #00d364
// Text: #f8f8f8

const padding = { x: 10, y: 10 };
const lineHeight = 10;

const dateStyle = new TextStyle({ fontFamily: 'Calibri', fontSize: 16, fontWeight: 'bold', fill: '#00d364' });
const textStyle = new TextStyle({
  fontFamily: 'Calibri',
  fontSize: 20,
  fill: '#f8f8f8',
  wordWrap: true,
  wordWrapWidth: 140,
});

const TimelineBox = ({ x, y, timelinePoints }) => {
  const BOX_BOTTOM_POINT = { x: x + 35, y: y + 150 };
  const JOIN_POINT = { ...BOX_BOTTOM_POINT, y: timelinePoints[0].y };
  const DOT_POINT = { ...JOIN_POINT, x: timelinePoints[0].x - DEFAULT_RADII - 3 };

  return (
    <>
      <RoundedRectangle x={x} y={y} width={150} height={150} fill={0x141414} radius={10} />
      <Text x={x + padding.x} y={y + padding.y} style={dateStyle} text="March 2016" />
      <Text x={x + padding.x} y={y + padding.y + lineHeight * 3} style={textStyle} text="Chetwood was formed" />
      <DottedLine startPoint={BOX_BOTTOM_POINT} endPoint={JOIN_POINT} dash={6} color={0x646464} />
      <DottedLine startPoint={JOIN_POINT} endPoint={DOT_POINT} dash={6} color={0x646464} />
    </>
  );
};

export default TimelineBox;
