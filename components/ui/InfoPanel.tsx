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
        <div className="absolute top-[340px] left-4 z-10 w-80 flex flex-col gap-4 animate-in fade-in slide-in-from-left-10 duration-700 pb-8">
            {/* Main Info Card */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl text-white">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-white drop-shadow-lg tracking-wider">
                        {currentPlanet.name}
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={savePlanet}
                            disabled={isSaved}
                            className={clsx(
                                "p-2 rounded-full transition-all",
                                isSaved ? "text-green-400 bg-green-400/10 cursor-default" : "text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                            title={isSaved ? "保存済み" : "惑星を保存"}
                        >
                            <Save size={18} />
                        </button>
                    </div>
                </div>

                <p className="text-sm text-gray-300 italic mb-6 leading-relaxed border-l-2 border-white/20 pl-3">
                    "{currentPlanet.description}"
                </p>

                {/* Composition Bars */}
                <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-semibold">香りの構成</h3>
                    {SCENT_CATEGORIES.map((cat: ScentCategory) => {
                        const value = currentPlanet.elements[cat];
                        if (value <= 0) return null;

                        return (
                            <div key={cat} className="group">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">{SCENT_CATEGORY_LABELS_JP[cat]}</span>
                                    <span className="text-gray-400 font-mono">{value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${value}%`,
                                            backgroundColor: SCENT_COLORS[cat],
                                            boxShadow: `0 0 10px ${SCENT_COLORS[cat]}40`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
