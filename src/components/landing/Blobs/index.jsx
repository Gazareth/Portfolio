import React, { Suspense } from 'react';
import useClient from '../../../hooks/useClient';

import { BlobsWrapper } from './styles';

// import PIXIBlobs from './PIXIBlobs';
const PIXIBlobs = typeof window !== `undefined` ? React.lazy(() => import('./PIXIBlobs')) : null;

const Fallback = () => (
  <div
    id="loadingDiv"
    style={{
      width: '40vw',
      height: '60vh',
      // /backgroundColor: '#aaa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <p style={{ fontSize: '32px', color: '#888' }}>Loading...</p>
  </div>
);

export const Blobs = () => {
  const [key, client] = useClient();

  // What to render for the server
  if (!client)
    return (
      <noscript>
        <div>You must have javascript enabled to view this app.</div>
      </noscript>
    );

  return (
    // What to render for the client - you need the key to force a remount
    <BlobsWrapper key={key} id="blobs">
      <Suspense fallback={<Fallback />}>
        <PIXIBlobs />
      </Suspense>
    </BlobsWrapper>
  );
};
