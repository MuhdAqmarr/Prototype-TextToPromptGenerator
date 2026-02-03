/**
 * Gemini Vision API Integration
 * Analyzes images to extract visual details for prompt generation
 */

export interface VisionAnalysisResult {
    description: string;
    error?: string;
}

export async function analyzeImageWithGemini(
    imageBase64: string,
    apiKey: string
): Promise<VisionAnalysisResult> {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analyze this food/product image and provide a detailed visual description for a photography prompt. Focus on:
- Main subject and key visual elements
- Colors, textures, and materials
- State of ingredients (fresh, cooked, crispy, etc.)
- Notable visual features
- Lighting and atmosphere hints

Keep the description concise but rich in visual detail (2-3 sentences max).`,
                                },
                                {
                                    inline_data: {
                                        mime_type: "image/jpeg",
                                        data: imageBase64,
                                    },
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini Vision API error:", errorText);
            return {
                description: "",
                error: `Vision API error: ${response.status}`,
            };
        }

        const data = await response.json();

        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.error("Unexpected Gemini Vision response:", data);
            return {
                description: "",
                error: "Invalid response from Vision API",
            };
        }

        const description = data.candidates[0].content.parts[0].text;

        return {
            description,
        };
    } catch (error) {
        console.error("Vision analysis error:", error);
        return {
            description: "",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
