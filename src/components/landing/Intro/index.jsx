import React, { useContext } from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { ThemeContext } from 'providers/ThemeProvider';
import { Header } from 'components/theme';
import { Container, Button } from 'components/common';
import dev from 'assets/illustrations/dev.svg';
import { Wrapper, IntroWrapper, Details, Thumbnail } from './styles';

export const Intro = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Wrapper>
      <Header />
      <IntroWrapper as={Container}>
        <Details theme={theme}>
          <h1>Hi There!</h1>
          <h4>CW Blobs Demo</h4>
          <Button as={AnchorLink} href="#blobs">
            Go to demo
          </Button>
        </Details>
        <Thumbnail>
          <img src={dev} alt="I’m Gareth and I’m a !" />
        </Thumbnail>
      </IntroWrapper>
    </Wrapper>
  );
};
