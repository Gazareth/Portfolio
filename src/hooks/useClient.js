import { useEffect, useState } from 'react';

const useClient = () => {
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);
  const key = client ? 'client' : 'server';
  return [key, client];
};

export default useClient;
