import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SCENT_CATEGORIES } from '@/lib/constants';
import { normalizeScentNode } from '@/lib/scent-utils';

// Initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
    try {
        const { perfumeName } = await req.json();

        if (!perfumeName) {
            return NextResponse.json({ error: 'Perfume name is required' }, { status: 400 });
        }

        const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
        console.log(`API Key status: ${key ? 'Found' : 'Missing'}`);

        let resultData;
        let usedModel = "mock";

        if (!genAI) {
            console.error('GEMINI_API_KEY is not set');
            resultData = generateMockScent(perfumeName);
        } else {
            // Try multiple models based on available list found via debugging
            // STRICTLY use Flash models to avoid 429 Rate Limits and ensure Tool support (Lite often fails tools)
            const modelsToTry = [
                "gemini-2.0-flash",     // Standard robust flash
                "gemini-2.5-flash",     // Newer flash
                "gemini-flash-latest"   // Fallback to stable latest (likely 1.5)
            ];
            let success = false;
            let lastError;

            for (const modelName of modelsToTry) {
                try {
                    console.log(`Attempting analysis with model: ${modelName}`);

                    // Enable Google Search Tool (Grounding)
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        tools: [{ googleSearch: {} } as any]
                    });

                    const prompt = `
                        あなたはプロの調香師です。以下の手順で香水「${perfumeName}」を分析してください。

                        1. まず、Google検索機能を使用して、この香水の「公式なノート構成（トップ、ミドル、ベース）」や「主要な香料」を正確に調べてください。推測は禁止です。
                        2. 検索結果に基づき、その香りを以下の14のカテゴリーに分解し、パーセンテージを割り当ててください：
                        ${SCENT_CATEGORIES.join(', ')}.

                        以下のJSONオブジェクト形式のみを返してください:
                        {
                            "name": "${perfumeName}",
                            "description": "検索された情報に基づく、この香水の正確な特徴と印象（日本語で最大80文字）。",
                            "elements": { "Citrus": 0-100, "Fruity": 0-100, "Floral": 0-100, "Green": 0-100, "Tea": 0-100, "Marine": 0-100, "Herbal": 0-100, "Spice": 0-100, "Woody": 0-100, "Leather": 0-100, "Gourmand": 0-100, "Amber": 0-100, "Musky": 0-100, "Smoky": 0-100 }
                        }
                        
                        * 合計が必ず100になるように調整してください。
                        * JSONの文字列のみを返してください。Markdown形式などは使用しないでください。
                    `;

                    const result = await model.generateContent(prompt);
                    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                    const rawData = JSON.parse(responseText);

                    // Normalize categories
                    const normalizedElements: any = {};
                    Object.entries(rawData.elements || {}).forEach(([key, val]) => {
                        const normalizedKey = normalizeScentNode(key);
                        normalizedElements[normalizedKey] = (normalizedElements[normalizedKey] || 0) + (val as number);
                    });

                    resultData = {
                        ...rawData,
                        elements: normalizedElements
                    };

                    success = true;
                    usedModel = modelName;
                    console.log(`Success with ${modelName}`);
                    break; // Stop if success
                } catch (error: any) {
                    console.warn(`Failed with ${modelName}:`, error.message);
                    lastError = error;
                }
            }

            if (!success) {
                console.error('All Gemini models failed. Using fallback.');
                resultData = generateMockScent(perfumeName, lastError?.message);
            }
        }

        const finalResult = {
            ...resultData,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            _meta: { source: usedModel } // Debug info
        };

        return NextResponse.json(finalResult);

    } catch (error: any) {
        console.error('Fatal API Error:', error);
        return NextResponse.json({
            error: `Fatal Error: ${error.message}`,
            instruction: "API error detected. Check 'Generative Language API' enablement in Google Cloud Console."
        }, { status: 500 });
    }
}

// Simple mock generator to keep the app functional during API issues
function generateMockScent(name: string, errorMessage?: string) {
    const mockElements: any = {};
    SCENT_CATEGORIES.forEach(cat => {
        mockElements[cat] = Math.floor(Math.random() * 10);
    });
    // Pick one dominant random category
    const dominant = SCENT_CATEGORIES[Math.floor(Math.random() * SCENT_CATEGORIES.length)];
    mockElements[dominant] = 50;

    return {
        name: `${name} (Simulated)`,
        description: `APIエラー: ${errorMessage || 'Unknown Fallback'}. 仮想データとしてシミュレーションを表示します。`,
        elements: mockElements,
    };
}
