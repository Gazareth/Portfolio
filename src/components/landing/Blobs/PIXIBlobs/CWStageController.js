import React, { useEffect, useCallback, useState } from 'react';

import * as PIXI from 'pixi.js';
import { withApp, Container, Sprite } from 'react-pixi-fiber';
import useEnterAnimation from '../../../../hooks/useEnterAnimation';
import DownArrow from './GreenDownArrow.png';

const DownArrowSprite = ({ scale, ...props }) => (
  <Sprite texture={PIXI.Texture.from(DownArrow)} {...props} anchor={0.5} pivot={0.5} scale={scale * 0.5} />
);

const STAGE_UI_PADDING = 75;

const StageControlButton = ({ ButtonSprite, scale, clickCallback, ...props }) => {
  const [alpha, setAlpha] = useState(0.75);

  const handleHover = useCallback(onOff => setAlpha(onOff ? 0.85 : 0.75), []);
  const handleClick = useCallback(
    (downUp, inOut = true) => {
      if (inOut) {
        setAlpha(downUp ? 1 : 0.85);
      } else {
        setAlpha(0.75);
      }
      if (downUp) {
        clickCallback();
      }
    },
    [clickCallback]
  );

  return (
    <ButtonSprite
      buttonMode
      interactive
      scale={scale}
      alpha={alpha}
      pointerdown={() => handleClick(true)}
      pointerup={() => handleClick(false)}
      pointerover={() => handleHover(true)}
      pointerout={() => handleHover(false)}
      {...props}
    />
  );
};

const oscillator = () => 5 * Math.sin(new Date().getTime() / 180);

const CWStageController = ({
  app,
  globalScale,
  stageWidth,
  stageHeight,
  viewingBatch,
  viewpoints,
  selectBatchCallback,
}) => {
  const [startTime] = useState(new Date().getTime());
  const [stageYTo, setStageYTo] = useState(viewpoints[viewingBatch]);
  const [yStagePos, setYStagePos] = useState(stageHeight / 2);
  const [buttonOscillator, setOscillator] = useState(oscillator());

  // console.log('Stage pos:', app.stage.position.y, 'to:', stageYTo);
  // console.log('Is pixi renderer?', app.renderer, app.renderer instanceof PIXI.Renderer);

  // This allows us to scroll the page up and down even when the mouse is inside the PIXI canvas... neat!!! (https://stackoverflow.com/questions/37527524/pixi-disabled-preventdefault-touch-events-not-working-on-android-devices)
  app.renderer.plugins.interaction.autoPreventDefault = true;

  const [enteredProgress] = useEnterAnimation({
    ticker: app.ticker,
    enterTime: startTime,
    enterDelay: 7000,
    enterDuration: 1500,
  });

  const updatePosition = useCallback(() => {
    setOscillator(oscillator());
    // Oscillate buttons to indicate clickable
    setYStagePos(-app.stage.position.y);

    // Move stage closer to where it should be (animate)
    app.stage.position.y += (stageYTo - app.stage.position.y) / 10;
  }, [app.stage.position.y, stageYTo]);

  const downClicked = useCallback(
    downUp => {
      selectBatchCallback(downUp);
    },
    [selectBatchCallback]
  );

  useEffect(() => setStageYTo(viewpoints[viewingBatch]), [viewingBatch, viewpoints, setStageYTo]);

  useEffect(() => {
    app.ticker.add(updatePosition);
    return () => app.ticker.remove(updatePosition);
  }, [app.ticker, updatePosition]);

  return (
    <Container alpha={enteredProgress}>
      <StageControlButton
        ButtonSprite={DownArrowSprite}
        buttonMode
        interactive
        scale={globalScale}
        position={{
          x: stageWidth / 2,
          y: yStagePos + stageHeight + (buttonOscillator - STAGE_UI_PADDING) * globalScale,
        }}
        clickCallback={() => downClicked(true)}
      />
      <StageControlButton
        ButtonSprite={DownArrowSprite}
        rotation={Math.PI}
        buttonMode
        interactive
        scale={globalScale}
        position={{ x: stageWidth / 2, y: yStagePos + (STAGE_UI_PADDING - buttonOscillator) * globalScale }}
        clickCallback={() => downClicked(false)}
      />
    </Container>
  );
};

export default withApp(CWStageController);
