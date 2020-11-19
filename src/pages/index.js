import React from 'react';
import { Layout, SEO } from 'components/common';
import { Intro, Skills, Contact, Projects, Blobs } from 'components/landing';

export default () => (
  <Layout>
    <SEO />
    <Intro />
    <Blobs />
    {/* <Projects /> */}
    {/* <Skills /> */}
    {/* <Contact /> */}
  </Layout>
);
