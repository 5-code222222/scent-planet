'use client';

import dynamic from 'next/dynamic';
import { SearchBar } from '@/components/ui/SearchBar';
import { InfoPanel } from '@/components/ui/InfoPanel';
import { PlanetList } from '@/components/ui/PlanetList';

// Dynamically import Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0" style={{ width: '100vw', height: '100vh' }}>
        <Scene />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Enable pointer events only for interactive children */}
        <div className="pointer-events-auto">
          <SearchBar />
        </div>
        <div className="pointer-events-auto">
          <InfoPanel />
        </div>
        <div className="pointer-events-auto">
          <PlanetList />
        </div>
      </div>

      {/* Global overlay gradients for vignette effect - REMOVED for debugging */}
      {/* <div className="absolute inset-0 bg-radial-gradient from-transparent to-black pointer-events-none opacity-40 mix-blend-multiply"></div> */}
    </main>
  );
}
