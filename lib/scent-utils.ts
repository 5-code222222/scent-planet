import { ScentCategory } from './types';

/**
 * Normalizes a scent node/raw string into one of the 14 core ScentCategories
 * based on the provided mapping rules.
 */
export function normalizeScentNode(node: string): ScentCategory {
    const raw = node.toLowerCase().trim();

    // 1. Exact matches for the 14 categories
    if (raw.includes('citrus')) return 'Citrus';
    if (raw.includes('fruity')) return 'Fruity';
    if (raw.includes('floral')) return 'Floral';
    if (raw.includes('green')) return 'Green';
    if (raw.includes('tea')) return 'Tea';
    if (raw.includes('marine') || raw.includes('ozone') || raw.includes('watery')) return 'Marine';
    if (raw.includes('herbal') || raw.includes('mint') || raw.includes('fougere')) return 'Herbal';
    if (raw.includes('spice')) return 'Spice';
    if (raw.includes('wood') || raw.includes('patchouli') || raw.includes('vetiver') || raw.includes('chypre')) return 'Woody';
    if (raw.includes('leather')) return 'Leather';
    if (raw.includes('gourmand')) return 'Gourmand';
    if (raw.includes('amber') || raw.includes('oriental') || raw.includes('resin') || raw.includes('benzoin') || raw.includes('myrrh')) return 'Amber';
    if (raw.includes('musk') || raw.includes('aldehyde') || raw.includes('soap') || raw.includes('powder')) return 'Musky';
    if (raw.includes('smoky') || raw.includes('tobacco')) return 'Smoky';

    // 2. Specific material overrides
    if (raw.includes('lavender')) return 'Herbal';
    if (raw.includes('rose') || raw.includes('jasmine') || raw.includes('iris') || raw.includes('orris')) return 'Floral';
    if (raw.includes('vanilla') || raw.includes('caramel')) return 'Gourmand';
    if (raw.includes('lemon') || raw.includes('bergamot')) return 'Citrus';
    if (raw.includes('incense')) return 'Smoky';

    // Default fallback
    return 'Woody';
}
