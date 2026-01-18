export type ScentCategory =
  | 'Citrus'
  | 'Fruity'
  | 'Floral'
  | 'Green'
  | 'Tea'
  | 'Marine'
  | 'Herbal'
  | 'Spice'
  | 'Woody'
  | 'Leather'
  | 'Gourmand'
  | 'Amber'
  | 'Musky'
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
