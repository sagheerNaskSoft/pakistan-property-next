'use client';

import dynamic from 'next/dynamic';

const RootApp = dynamic(() => import('@/RootApp'), { ssr: false });

export default function CatchAllPage() {
  return <RootApp />;
}
