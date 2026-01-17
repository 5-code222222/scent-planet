import { AnalysisResult } from './types';

export async function analyzeScent(perfumeName: string): Promise<AnalysisResult> {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ perfumeName }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze scent');
    }

    return response.json();
}
