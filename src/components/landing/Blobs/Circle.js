import React, { useState, useEffect, useCallback } from 'react';
import { CustomPIXIComponent, Sprite, withApp } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import BezierEasing from 'bezier-easing';

import CircleImg from './circle-64.ico';

const TYPE = 'Circle';

const oldCircle = CustomPIXIComponent(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps(instance, oldProps, newProps) {
      const { fill, x, y, opacity, radius } = newProps;
      console.log('rendering circle!', opacity);
      instance.clear();
      instance.lineStyle(0);
      instance.beginFill(fill);
      instance.drawCircle(x * 2, y * 2, radius * 2);
      instance.endFill();
      // instance.scale.set(opacity);
      // Use cacheAsBitmap to render bitmap
      instance.cacheAsBitmap = true;

      // Scale down (the bitmap) to get smooth edges
      instance.scale.set(0.5);
      // instance.moveTo(x * 2, y * 2);

      // instance.scale = 1;
      // instance.filters = [new PIXI.filters.AlphaFilter(opacity)];
    },
  },
  TYPE
);

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
    {
      const currentTime = new Date().getTime();
      app.ticker.add(updateAnimation);
    }
    // return () => app.ticker.remove(updateAnimation);
  }, [app.ticker, birthTime, enterDelay, updateAnimation]);

  return <CircleSprite x={x} y={y} scale={(opacity * radius) / 32} tint={rest.fill} />;
};

const CirclesController = ({ app, blobs }) => {
  // const blobgraphic = new PIXI.Graphics();
  // blobgraphic.clear();
  // blobgraphic.lineStyle(0);
  // blobgraphic.beginFill(0xffffff);
  // blobgraphic.drawCircle(0, 0, 64);
  // blobgraphic.endFill();

  // const texture = app.renderer.generateTexture(blobgraphic);
  // const sprite = PIXI.Sprite.from(texture);
  // sprite.anchor.set(0.5);
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
