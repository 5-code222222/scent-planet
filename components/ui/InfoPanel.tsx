'use client';

import React from 'react';
import { usePlanetStore } from '@/lib/store';
import { SCENT_CATEGORIES, SCENT_COLORS, SCENT_CATEGORY_LABELS_JP } from '@/lib/constants';
import { Save, Share2, Info } from 'lucide-react';
import { ScentCategory } from '@/lib/types';
import clsx from 'clsx';

export const InfoPanel: React.FC = () => {
    const { currentPlanet, savePlanet, savedPlanets } = usePlanetStore();

    if (!currentPlanet) return null;

    const isSaved = savedPlanets.some(p => p.id === currentPlanet.id);

    return (
        // Stacked below SearchBar (approx height 320px)
        <div className="absolute top-[340px] left-4 z-10 w-80 flex flex-col gap-4 animate-in fade-in slide-in-from-left-10 duration-[1000ms] pb-8 font-sans pointer-events-none">
            {/* Holographic Info HUD */}
            <div className="relative pointer-events-auto">
                {/* Background with Glow and Blur */}
                <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-md rounded-sm border-l border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]"></div>

                {/* HUD Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-400/60 transition-all duration-1000"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/40"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/40"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-cyan-400/60 shadow-[5px_5px_15px_rgba(34,211,238,0.2)]"></div>

                {/* Content Container */}
                <div className="relative p-7 text-white">
                    {/* Data Header Decor */}
                    <div className="flex items-center gap-2 mb-4 opacity-40">
                        <div className="h-[1px] w-6 bg-cyan-400"></div>
                        <span className="text-[8px] tracking-[0.3em] font-bold uppercase" style={{ fontFamily: 'var(--font-jost)' }}>Perfume.Analyzed.v1.0</span>
                    </div>

                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] tracking-tighter italic" style={{ fontFamily: 'var(--font-jost)' }}>
                            {currentPlanet.name}
                        </h1>
                    </div>

                    <p className="text-sm text-cyan-50/80 mb-8 leading-relaxed font-light tracking-wide bg-cyan-950/20 p-3 border-r border-cyan-500/10" style={{ fontFamily: 'var(--font-zen)' }}>
                        {currentPlanet.description}
                    </p>

                    {/* Composition HUD */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/70 font-bold" style={{ fontFamily: 'var(--font-jost)' }}>Composition Matrix</h3>
                            <div className="h-[1px] flex-grow mx-4 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                        </div>

                        {SCENT_CATEGORIES.map((cat: ScentCategory) => {
                            const value = currentPlanet.elements[cat];
                            if (value <= 0) return null;

                            return (
                                <div key={cat} className="group relative">
                                    <div className="flex justify-between text-[11px] mb-1.5 px-1">
                                        <span className="text-cyan-100/60 group-hover:text-cyan-200 transition-colors uppercase tracking-widest" style={{ fontFamily: 'var(--font-zen)' }}>
                                            {SCENT_CATEGORY_LABELS_JP[cat]}
                                        </span>
                                        <span className="text-cyan-400 font-bold tabular-nums" style={{ fontFamily: 'var(--font-jost)' }}>{value}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-cyan-950/40 rounded-none overflow-hidden border-r border-cyan-500/20">
                                        <div
                                            className="h-full transition-all duration-1000 ease-out relative"
                                            style={{
                                                width: `${value}%`,
                                                backgroundColor: SCENT_COLORS[cat],
                                                boxShadow: `0 0 15px ${SCENT_COLORS[cat]}`
                                            }}
                                        >
                                            {/* Reflection glint */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer HUD Decor */}
                    <div className="mt-8 pt-4 border-t border-cyan-500/10 flex justify-between items-center opacity-30">
                        <span className="text-[7px] tracking-widest font-mono">COORD: 35.6895° N, 139.6917° E</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-cyan-400"></div>
                            <div className="w-4 h-1 bg-cyan-400/50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
