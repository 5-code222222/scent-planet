import { ScentCategory } from './types';

export const SCENT_CATEGORIES: ScentCategory[] = [
    'Floral',
    'Fruity',
    'Citrus',
    'Marine',
    'Herbal',
    'Woody',
    'Spice',
    'Gourmand',
    'Chypre',
    'Fougere',
    'Oriental',
    'Musk',
    'Smoky',
];

export const SCENT_COLORS: Record<ScentCategory, string> = {
    Floral: '#FF0055',    // Vivid Hot Pink
    Fruity: '#FF5500',    // Vivid Orange Red
    Citrus: '#FFCC00',    // Vivid Yellow
    Marine: '#0088FF',    // Vivid Azure Blue
    Herbal: '#00CC44',    // Vivid Green
    Woody: '#2F1B12',     // Blackish Brown (Dark Coffee)
    Spice: '#CC0000',     // Deep Red
    Gourmand: '#E8DCCA',  // Cream Beige (Vanilla-like)
    Chypre: '#006633',    // Deep Forest Green
    Fougere: '#8A2BE2',   // Vivid Purple (BlueViolet)
    Oriental: '#A0522D',  // Warm Brown (Sienna/Amber)
    Musk: '#FFFFFF',      // Pure White
    Smoky: '#444444',     // Dark Grey
};

// 3D Direction vectors matching the GLSL shader
export const SCENT_VECTORS: Record<ScentCategory, [number, number, number]> = {
    Floral: [1.0, 0.0, 0.0],
    Fruity: [-1.0, 0.0, 0.0],
    Citrus: [0.0, 1.0, 0.0],
    Marine: [0.0, -1.0, 0.0],
    Herbal: [0.0, 0.0, 1.0],
    Woody: [0.0, 0.0, -1.0],
    Spice: [0.577, 0.577, 0.577],
    Gourmand: [-0.577, 0.577, 0.577],
    Chypre: [0.577, -0.577, 0.577],
    Fougere: [0.577, 0.577, -0.577],
    Oriental: [-0.577, -0.577, 0.577],
    Musk: [-0.577, 0.577, -0.577],
    Smoky: [0.577, -0.577, -0.577]
};

export const SCENT_CATEGORY_LABELS_JP: Record<ScentCategory, string> = {
    Floral: 'フローラル',
    Fruity: 'フルーティ',
    Citrus: 'シトラス',
    Marine: 'マリン',
    Herbal: 'ハーバル',
    Woody: 'ウッディ',
    Spice: 'スパイス',
    Gourmand: 'グルマン',
    Chypre: 'シプレ',
    Fougere: 'フゼア',
    Oriental: 'オリエンタル',
    Musk: 'ムスク',
    Smoky: 'スモーキー'
};

// Convert hex to normalized RGB [0-1] for shader
export const hexToRgbNormalized = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
};
