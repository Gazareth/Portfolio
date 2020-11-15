import React, { useContext, useState, useMemo } from 'react';

import { Stage, Container } from 'react-pixi-fiber';
import Circle from './Circle';
import Rectangle from './Rectangle';
import plotter from './plotter';
import { Wrapper, SkillsWrapper } from './styles';

const STAGE_DIMENSIONS = {
  width: window.innerWidth * 0.8,
  height: 1000,
};

const STAGE_CENTER = {
  x: STAGE_DIMENSIONS.width * 0.5,
  y: STAGE_DIMENSIONS.height * 0.5,
};

const STAGE_OPTIONS = {
  backgroundColor: 0x111111,
  width: STAGE_DIMENSIONS.width,
  height: STAGE_DIMENSIONS.height,
  antialias: true,
  // resolution: 2,
};

// const blobs = plotter(
//   30,
//   STAGE_OPTIONS.width * 0.5,
//   STAGE_OPTIONS.height * 0.15,
//   STAGE_OPTIONS.width * 0.5,
//   STAGE_OPTIONS.height * 0.75
// );

const blobs = plotter(30, 30, STAGE_OPTIONS.width * 1.65, STAGE_OPTIONS.height * 1.65, 45, STAGE_CENTER);
// const blobs = plotter(12, 2, STAGE_OPTIONS.width * 0.85, STAGE_OPTIONS.height * 0.65, 0, STAGE_CENTER);

const BG_PROPS = {
  ...STAGE_DIMENSIONS,
  fill: 0x000000,
};

export const Blobs = () => (
  <Wrapper id="blobs">
    <SkillsWrapper>
      <Stage options={STAGE_OPTIONS}>
        <Container>
          {/* <Rectangle {...BG_PROPS} /> */}
          {blobs.map(
            (blob, i) =>
              console.log('Rendering circle with: ', blob) || (
                <Circle key={i} x={blob.x} y={blob.y} radius={blob.radius} fill={blob.fill} />
              )
          )}
        </Container>
      </Stage>
    </SkillsWrapper>
  </Wrapper>
);
