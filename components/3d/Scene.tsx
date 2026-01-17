'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import Planet from './Planet';
import { usePlanetStore } from '@/lib/store';

const Scene: React.FC = () => {
    const currentPlanet = usePlanetStore((state) => state.currentPlanet);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0, background: '#111' }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <color attach="background" args={['#050505']} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={1.0} />
                <pointLight position={[10, 10, 10]} />
                <Planet scentProfile={currentPlanet} />
                <OrbitControls enablePan={false} />
            </Canvas>
        </div>
    );
};

export default Scene;
