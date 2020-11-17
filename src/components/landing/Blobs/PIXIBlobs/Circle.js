import React, { useState, useEffect, useCallback } from 'react';
import { Sprite, withApp } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import BezierEasing from 'bezier-easing';

import CircleImg from './circle-64.ico';

const ease = BezierEasing(0.35, 1.76, 0.53, 1.01);

const Circle = ({ app, CircleSprite, birthTime, enterDelay, enterDuration = 1000, x, y, radius, ...rest }) => {
  const [hasEntered, setHasEntered] = useState(false);
  const [opacity, setOpacity] = useState(0.0);

  const updateAnimation = useCallback(() => {
    if (!hasEntered) {
      const currentTime = new Date().getTime();
      const lifeFactor = Math.min(Math.max(currentTime - birthTime - enterDelay, 0) / enterDuration, 1);
      // console.log(currentTime - birthTime - enterDelay, enterDuration, lifeFactor);
      if (lifeFactor < 1) {
        // console.log('inside!', lifeFactor);
        setOpacity(ease(lifeFactor));
      } else {
        setHasEntered(true);
      }
    }
  }, [birthTime, enterDelay, enterDuration, hasEntered]);

  useEffect(() => {
    app.ticker.add(updateAnimation);
    return () => app.ticker.remove(updateAnimation);
  }, [app.ticker, birthTime, enterDelay, updateAnimation]);

  return <CircleSprite x={x} y={y} scale={(opacity * radius) / 32} tint={rest.fill} />;
};

const CirclesController = ({ app, blobs }) => {
  const CircleSprite = props => <Sprite texture={PIXI.Texture.from(CircleImg)} {...props} anchor={0.5} />;

  // console.log('Is pixi renderer?', app.renderer, app.renderer instanceof PIXI.Renderer);

  return (
    <>
      {blobs.circles.map((blob, i) => (
        <Circle key={i} app={app} CircleSprite={CircleSprite} {...blob} />
      ))}
    </>
  );
};

export default withApp(CirclesController);
