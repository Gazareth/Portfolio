import React, { useContext, useState, useMemo } from 'react';

import { Stage, Container } from 'react-pixi-fiber';
import Circle from './Circle';
import plotter from './plotter';
import { Wrapper, SkillsWrapper } from './styles';

const STAGE_OPTIONS = {
  backgroundColor: 0x111111,
  width: window.innerWidth * 0.4,
  height: 500,
  // antialias: true,
  resolution: 2,
};

const blobs = plotter(
  30,
  STAGE_OPTIONS.width * 0.5,
  STAGE_OPTIONS.height * 0.15,
  STAGE_OPTIONS.width,
  STAGE_OPTIONS.height * 0.75
);

const BLOB_PROPS = {
  x: 100,
  y: 100,
  radius: 10,
  fill: 0xffffff,
};

export const Blobs = () => (
  <Wrapper id="blobs">
    <SkillsWrapper>
      <Stage options={STAGE_OPTIONS}>
        <Container>
          {blobs.map((blob, i) => (
            <Circle key={i} x={blob.x} y={blob.y} radius={blob.radius} fill={blob.fill} />
          ))}
          <Circle {...BLOB_PROPS} />
        </Container>
      </Stage>
    </SkillsWrapper>
  </Wrapper>
);
