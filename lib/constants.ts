import { ScentCategory } from './types';

export const SCENT_CATEGORIES: ScentCategory[] = [
    'Citrus',
    'Fruity',
    'Floral',
    'Green',
    'Tea',
    'Marine',
    'Herbal',
    'Spice',
    'Woody',
    'Leather',
    'Gourmand',
    'Amber',
    'Musky',
    'Smoky',
];

export const SCENT_COLORS: Record<ScentCategory, string> = {
    Citrus: '#FFEE58',
    Fruity: '#FF6E40',
    Floral: '#EA4080',
    Green: '#76FF03',
    Tea: '#CDDC39',
    Marine: '#18FFFF',
    Herbal: '#B388FF',
    Spice: '#FF1744',
    Woody: '#D7CCC8',
    Leather: '#8D6E63',
    Gourmand: '#FFF59D',
    Amber: '#FFAB00',
    Musky: '#F5F5F5',
    Smoky: '#90A4AE',
};

// 3D Direction vectors matching the GLSL shader (14 directions)
// Optimized to distribute 14 points on a sphere (6 axes + 8 corners of a cube)
export const SCENT_VECTORS: Record<ScentCategory, [number, number, number]> = {
    Citrus: [0.0, 1.0, 0.0],    // Up (Y)
    Fruity: [1.0, 0.0, 0.0],    // Right (X)
    Floral: [0.0, 0.0, 1.0],    // Forward (Z)
    Green: [0.0, -1.0, 0.0],   // Down (-Y)
    Tea: [-1.0, 0.0, 0.0],    // Left (-X)
    Marine: [0.0, 0.0, -1.0],   // Backward (-Z)
    Herbal: [0.577, 0.577, 0.577],   // Corner 1
    Spice: [-0.577, 0.577, 0.577],  // Corner 2
    Woody: [0.577, -0.577, 0.577],  // Corner 3
    Leather: [0.577, 0.577, -0.577], // Corner 4
    Gourmand: [-0.577, -0.577, 0.577], // Corner 5
    Amber: [-0.577, 0.577, -0.577], // Corner 6
    Musky: [0.577, -0.577, -0.577], // Corner 7
    Smoky: [-0.577, -0.577, -0.577] // Corner 8
};

export const SCENT_CATEGORY_LABELS_JP: Record<ScentCategory, string> = {
    Citrus: 'シトラス',
    Fruity: 'フルーティ',
    Floral: 'フローラル',
    Green: 'グリーン',
    Tea: 'ティー',
    Marine: 'マリン',
    Herbal: 'ハーバル',
    Spice: 'スパイス',
    Woody: 'ウッディ',
    Leather: 'レザー',
    Gourmand: 'グルマン',
    Amber: 'アンバー',
    Musky: 'ムスキー',
    Smoky: 'スモーキー'
};

// Convert hex to normalized RGB [0-1] for shader
export const hexToRgbNormalized = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
};
