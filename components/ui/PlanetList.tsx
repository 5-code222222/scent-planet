'use client';

import React from 'react';
import { usePlanetStore } from '@/lib/store';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { SCENT_COLORS } from '@/lib/constants';

export const PlanetList: React.FC = () => {
    const { savedPlanets, currentPlanet, selectPlanet, deletePlanet } = usePlanetStore();

    if (savedPlanets.length === 0) return null;

    return (
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center px-4">
            <div className="flex gap-4 overflow-x-auto p-4 max-w-full no-scrollbar pb-2">
                {savedPlanets.map((planet) => {
                    // Calculate dominant color for the preview dot
                    const sortedElements = Object.entries(planet.elements).sort((a, b) => b[1] - a[1]);
                    const dominantCat = sortedElements[0][0] as keyof typeof SCENT_COLORS;
                    const color = SCENT_COLORS[dominantCat];

                    const isActive = currentPlanet?.id === planet.id;

                    return (
                        <div
                            key={planet.id}
                            onClick={() => selectPlanet(planet.id)}
                            className={clsx(
                                "relative flex-shrink-0 w-16 h-16 rounded-full cursor-pointer transition-all duration-300 border-2",
                                isActive ? "border-white scale-110 shadow-lg shadow-white/20" : "border-white/10 hover:border-white/50 hover:scale-105 opacity-70 hover:opacity-100"
                            )}
                            style={{
                                background: `radial-gradient(circle at 30% 30%, ${color}, #000)`
                            }}
                        >
                            {/* Tooltip on hover could go here, for now just simplistic visuals */}
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-white whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                                {planet.name}
                            </div>

                            {/* Delete button only on hover */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePlanet(planet.id);
                                }}
                                className="absolute -top-1 -right-1 bg-red-500/80 hover:bg-red-600 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={10} className="text-white" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
