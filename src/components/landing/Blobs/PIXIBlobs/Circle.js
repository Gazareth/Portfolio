import React, { useState, useEffect, useCallback } from 'react';
import { Sprite, withApp } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import BezierEasing from 'bezier-easing';

import useEnterAnimation from '../../../../hooks/useEnterAnimation';

import CircleImg from './circle-64.ico';

// const ease = BezierEasing(0.35, 1.76, 0.53, 1.01);
const ease = BezierEasing(0.07, 1.8, 0.79, 0.91);

const Circle = ({ app, CircleSprite, birthTime, enterDelay, enterDuration = 1000, x, y, radius, ...rest }) => {
  const [enteredProgress] = useEnterAnimation({
    ticker: app.ticker,
    enterTime: birthTime,
    enterDelay,
    enterDuration,
  });

  return <CircleSprite x={x} y={y} scale={(ease(enteredProgress) * radius) / 32} tint={rest.fill} />;
};

const CirclesController = ({ app, blobs }) => {
  // This allows us to scroll the page up and down even when the mouse is inside the PIXI canvas... neat!!! (https://stackoverflow.com/questions/37527524/pixi-disabled-preventdefault-touch-events-not-working-on-android-devices)
  app.renderer.plugins.interaction.autoPreventDefault = true;
  const CircleSprite = props => <Sprite texture={PIXI.Texture.from(CircleImg)} {...props} anchor={0.5} />;

  console.log('Is pixi renderer?', app.renderer, app.renderer instanceof PIXI.Renderer);

  return (
    <>
      {blobs.circles.map((blob, i) => (
        <Circle key={i} app={app} CircleSprite={CircleSprite} {...blob} />
      ))}
    </>
  );
};

export default withApp(CirclesController);
