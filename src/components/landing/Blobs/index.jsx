import React from 'react';
import useClient from '../../../hooks/useClient';

import PIXIBlobs from './PIXIBlobs';
import { Wrapper, BlobsWrapper } from './styles';

export const Blobs = () => {
  const [key, client] = useClient();

  // What to render for the server
  if (!client)
    return (
      <noscript>
        <div>You must have javascript enabled to view this page.</div>
      </noscript>
    );

  return (
    // What to render for the client - you need the key to force a remount
    <Wrapper key={key} id="blobs">
      <BlobsWrapper>
        <PIXIBlobs />
      </BlobsWrapper>
    </Wrapper>
  );
};
