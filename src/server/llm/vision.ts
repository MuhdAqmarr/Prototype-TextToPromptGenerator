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
                                    text: `Analyze this food/product image and provide a detailed visual description for a photography prompt. 

CRITICAL: Focus on REALISM and AUTHENTICITY to prevent "AI Slop".
- Identify textures: uneven browning, oil glisten, crumbs, condensation, sauce drips, rough surfaces.
- Lighting: Describe natural shadows, reflections, and light fall-off.
- "Perfectly Imperfect" details: Charred edges, steam mist, scattered herbs, organic arrangement.
- Core elements: Main subject color palette and material properties.
- **CROCKERY & PLATING:** You MUST describe the EXACT plate/bowl type (e.g., "stainless steel shallow bowl with wide rim", "banana leaf on rattan").
- **QUANTITY & DISTRIBUTION:** Count the visible pieces of meat/garnishes (e.g., "approx 5 slices of beef"). Describe exact rice color (e.g., "light golden fried rice" vs "dark soy sauce coated").
- **SPATIAL LAYOUT:** Describe the EXACT position of every element (e.g., "Fried egg at 11 o'clock", "Crackers stacked on left side").
- **LAYERING:** What is on top of what? (e.g., "Fried shallots sprinkled centrally on rice mound").

Your goal is to enable a **FORENSIC RECONSTRUCTION** of the scene. The generated image must have the EXACT same layout.`,
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
