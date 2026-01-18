'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { usePlanetStore } from '@/lib/store';
import { analyzeScent } from '@/lib/api-client';

export const SearchBar: React.FC = () => {
    const [input, setInput] = useState('');
    const { isAnalyzing, setIsAnalyzing, setCurrentPlanet, savePlanet, currentPlanet } = usePlanetStore();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isAnalyzing) return;

        setIsAnalyzing(true);
        try {
            const result = await analyzeScent(input);
            setCurrentPlanet(result);
        } catch (error) {
            console.error(error);
            alert('Failed to analyze scent. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="absolute top-4 left-4 z-20 w-80 flex flex-col gap-8 animate-in slide-in-from-left duration-700">
            {/* Cosmic Logo & Search Container */}
            <div className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">

                {/* Logo Area */}
                <div className="mb-2 p-2 text-center">
                    {/* Strong Multi-layer Neon Glow */}
                    <h1 className="text-5xl font-extrabold tracking-[0.2em] text-white select-none italic"
                        style={{
                            fontFamily: 'var(--font-jost)',
                            textShadow: '0 0 10px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)'
                        }}>
                        SCENT
                    </h1>
                    <span className="block text-xl tracking-[0.6em] -mt-1 text-cyan-200 font-light drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        style={{ fontFamily: 'var(--font-zen)' }}>
                        PLANET
                    </span>
                </div>

                <form onSubmit={handleSearch} className="w-full relative group space-y-4">
                    {/* Search Bar Container */}
                    <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-md transition-opacity opacity-0 group-focus-within/input:opacity-100 duration-500"
                            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}></div>

                        <div className="relative flex items-center bg-black/60 border border-cyan-500/30 px-4 py-3 shadow-inner transition-all duration-300 group-focus-within/input:border-cyan-400 group-focus-within/input:bg-black/80"
                            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}>
                            <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0 group-focus-within/input:text-cyan-300 transition-colors ml-4" />

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="香水・ブランド..."
                                className="w-full bg-transparent border-none text-white text-base font-medium focus:outline-none placeholder-gray-500 font-sans tracking-wide py-1"
                                style={{ fontFamily: 'var(--font-zen)' }}
                                disabled={isAnalyzing}
                            />

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/50"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/50"></div>
                        </div>
                    </div>

                    {/* Big Analyze Button */}
                    <button
                        type="submit"
                        disabled={isAnalyzing || !input.trim()}
                        className={`
                            w-full py-3 rounded-xl font-bold text-sm tracking-[0.15em] transition-all duration-300 relative overflow-hidden group/btn
                            ${isAnalyzing
                                ? 'bg-gray-900/80 text-gray-500 border border-white/5 cursor-not-allowed'
                                : 'bg-transparent text-white border border-cyan-500/30 hover:border-cyan-400/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                            }
                        `}
                        style={{ fontFamily: 'var(--font-jost)' }}
                    >
                        {!isAnalyzing && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                        )}
                        <span className="relative z-10 flex items-center justify-center">
                            {isAnalyzing ? (
                                <span className="flex items-center">
                                    <Loader2 className="animate-spin mr-2 w-4 h-4" /> Analyzing...
                                </span>
                            ) : (
                                "SEARCH"
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};
