import React, { useState, useEffect, useCallback } from 'react';
import { Sprite, withApp } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import BezierEasing from 'bezier-easing';

import useEnterAnimation from '../../../../hooks/useEnterAnimation';

import CircleImg from './circle-64.ico';

// const ease = BezierEasing(0.35, 1.76, 0.53, 1.01);
const ease = BezierEasing(0.07, 1.8, 0.79, 0.91);

const Circle = ({ app, x, y, radius, CircleSprite, startTime, enterDelay, enterDuration = 1000, ...rest }) => {
  const [enteredProgress] = useEnterAnimation({
    ticker: app.ticker,
    canEnter: !!startTime,
    enterTime: startTime,
    enterDelay,
    enterDuration,
  });
  return <CircleSprite x={x} y={y} scale={(ease(enteredProgress) * radius) / 32} tint={rest.fill} />;
  // return <CircleSprite x={x} y={y} scale={radius / 32} tint={rest.fill} />;
};

const CirclesController = ({ app, circles, startTimes }) => {
  const CircleSprite = props => <Sprite texture={PIXI.Texture.from(CircleImg)} {...props} anchor={0.5} />;

  return (
    <>
      {circles.map((blob, i) => (
        <Circle key={i} app={app} startTime={startTimes[blob.batchNum]} CircleSprite={CircleSprite} {...blob} />
      ))}
    </>
  );
};

export default withApp(CirclesController);
