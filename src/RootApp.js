'use client';

import { useEffect } from 'react';
import { Authprovider } from '@/Context/ContextProvider';
import App from '@/App';

export default function RootApp() {
  useEffect(() => {
    const onContextMenu = (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href && !link.href.includes('#')) {
        return true;
      }
    };
    document.addEventListener('contextmenu', onContextMenu, true);
    return () => document.removeEventListener('contextmenu', onContextMenu, true);
  }, []);

  return (
    <Authprovider>
      <App />
    </Authprovider>
  );
}
