import React, { useState } from 'react';
import * as PIXI from 'pixi.js';
import { TextStyle } from 'pixi.js';
import { Text, Sprite } from 'react-pixi-fiber';
import RoundedRectangle from '../RoundedRectangle';
import DottedLine from '../DottedLine';

// Date: #00d364
// Text: #f8f8f8

const padding = { x: 20, y: 22 };
const lineHeight = 10;

const dateStyle = new TextStyle({
  fontFamily: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  fill: '#00d364',
});
const textStyle = wordWrapWidth =>
  new TextStyle({
    fontFamily: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    fontSize: 18,
    fill: '#f8f8f8',
    wordWrap: true,
    wordWrapWidth,
  });

const TimelineBox = ({
  boxPosition,
  joinPointPosition,
  timelinePointPosition,
  boxWidth,
  boxHeight,
  dateText,
  textWidth,
  image,
  imageWidth,
  text,
}) => {
  const { x, y } = boxPosition;
  const { x: tlX, y: tlY } = timelinePointPosition;

  const ImageSprite = props => <Sprite texture={PIXI.Texture.from(image)} {...props} />;

  const CORNER_POINT = { ...joinPointPosition, y: tlY };

  const TEXT_START_X = x + imageWidth + padding.x;
  const TEXT_START_Y = y + padding.y;

  // console.log('About to render dotted lines!', joinPointPosition, CORNER_POINT, timelinePointPosition);

  return (
    <>
      <RoundedRectangle x={x} y={y} width={boxWidth} height={boxHeight} fill={0x141414} radius={10} />
      <ImageSprite x={x} y={y} height={boxHeight} />
      <Text x={TEXT_START_X} y={TEXT_START_Y} style={dateStyle} text={dateText} />
      <Text
        x={TEXT_START_X}
        y={TEXT_START_Y + lineHeight * 3}
        style={textStyle(textWidth - 2 * padding.x)}
        text={text}
      />
      <DottedLine startPoint={timelinePointPosition} endPoint={CORNER_POINT} dash={6} color={0x646464} />
      <DottedLine startPoint={CORNER_POINT} endPoint={joinPointPosition} dash={6} color={0x646464} />
    </>
  );
};

export default TimelineBox;
