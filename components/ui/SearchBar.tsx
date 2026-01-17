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
        <div className="absolute top-4 left-4 z-20 w-80 flex flex-col gap-4 animate-in slide-in-from-left duration-700">
            {/* Cosmic Logo & Search Container */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">

                {/* Logo Area with Background for Visibility */}
                <div className="mb-6 p-4 rounded-2xl bg-black/60 border border-white/5 shadow-inner text-center">
                    {/* Strong Multi-layer Neon Glow */}
                    <h1 className="text-4xl font-extrabold tracking-[0.2em] text-white select-none"
                        style={{
                            fontFamily: 'var(--font-rounded)',
                            textShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee, 0 0 40px #a855f7'
                        }}>
                        SCENT
                    </h1>
                    <span className="block text-xl tracking-[0.5em] mt-1 text-gray-200 font-light drop-shadow-md">
                        PLANET
                    </span>
                </div>

                <form onSubmit={handleSearch} className="w-full relative group">
                    {/* Search Bar Container */}
                    <div className="relative flex items-center bg-gray-900/80 border border-white/20 rounded-xl px-4 py-3 shadow-xl transition-all hover:border-white/40 group-focus-within:border-white/60">
                        <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="香水・ブランド..."
                            className="w-full bg-transparent border-none text-white text-base font-bold focus:outline-none placeholder-gray-500"
                            style={{ color: '#ffffff' }}
                            disabled={isAnalyzing}
                        />
                    </div>

                    {/* Big Analyze Button Below */}
                    <button
                        type="submit"
                        disabled={isAnalyzing || !input.trim()}
                        className={`
                            w-full mt-3 py-3 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 shadow-lg border border-white/10
                            ${isAnalyzing
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white hover:from-blue-500 hover:to-purple-500 hover:shadow-cyan-500/20'
                            }
                        `}
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center justify-center">
                                <span className="animate-spin mr-2">💫</span> 分析中...
                            </span>
                        ) : (
                            "SEARCH"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
