import { create } from 'zustand';
import { AnalysisResult } from './types';

interface PlanetStore {
    currentPlanet: AnalysisResult | null;
    savedPlanets: AnalysisResult[];
    isAnalyzing: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setCurrentPlanet: (planet: AnalysisResult) => void;
    savePlanet: () => void;
    deletePlanet: (id: string) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    selectPlanet: (id: string) => void;
}

export const usePlanetStore = create<PlanetStore>((set, get) => ({
    currentPlanet: null,
    savedPlanets: [],
    isAnalyzing: false,
    searchQuery: '',

    setSearchQuery: (query) => set({ searchQuery: query }),

    setCurrentPlanet: (planet) => set({ currentPlanet: planet }),

    savePlanet: () => {
        const { currentPlanet, savedPlanets } = get();
        if (!currentPlanet) return;

        // Check if already saved
        if (savedPlanets.some(p => p.id === currentPlanet.id)) return;

        set({ savedPlanets: [currentPlanet, ...savedPlanets] });
    },

    deletePlanet: (id) =>
        set((state) => ({
            savedPlanets: state.savedPlanets.filter((p) => p.id !== id),
        })),

    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

    selectPlanet: (id) => {
        const { savedPlanets } = get();
        const planet = savedPlanets.find((p) => p.id === id);
        if (planet) {
            set({ currentPlanet: planet });
        }
    },
}));
