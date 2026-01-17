export type ScentCategory =
  | 'Floral'
  | 'Fruity'
  | 'Citrus'
  | 'Marine'
  | 'Herbal'
  | 'Woody'
  | 'Spice'
  | 'Gourmand'
  | 'Chypre'
  | 'Fougere'
  | 'Oriental'
  | 'Musk'
  | 'Smoky';

export interface ScentProfile {
  id?: string; // Optional ID for keying
  name: string;
  description: string;
  elements: Partial<Record<ScentCategory, number>>; // Percentage (0-100)
}

export interface AnalysisResult extends ScentProfile {
  id: string;
  timestamp: number;
}
