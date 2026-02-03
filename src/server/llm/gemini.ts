import type { LLMProvider } from "./provider";
import type { GeneratorInput, PromptSpec } from "@/lib/promptSpec";
import { PromptSpecSchema } from "@/lib/promptSpec";
import { buildPromptSpec } from "@/lib/promptEngine";

export class GeminiLLMProvider implements LLMProvider {
  name = "gemini";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSpec(input: GeneratorInput): Promise<PromptSpec> {
    const systemPrompt = `You are a world-class Senior Food Photographer and Creative Director with 20 years of experience in high-end F&B marketing.

    Your goal is to craft the perfect image specification that sells the food, tells a brand story, and triggers appetite appeal.

    **CRITICAL: COMBAT "AI SLOP" & PLASTIC LOOK**
    - **Avoid Perfection:** Do NOT use words like "perfect", "flawless", "pristine" unless the marketing goal strictly demands it.
    - **Emphasize Texture:** Use tactile words: "porous", "flaky", "uneven", "coarse", "gooey", "charred", "bubbling".
    - **Imperfections are Key:** Mention "stray crumbs", "slight sauce splatter", "melting edges", "steam mist", "oil separation" to add realism.
    - **Camera Quality:** Specify "film grain", "shot on 35mm", "8k raw photo", "ultra-realistic texture", "depth of field".

    **GENERATE 3 DISTINCT VARIANTS:**
    You must provide specific styling cues for 3 distinct use cases in the 'variantCues' object:
    1. **safe_commercial**: High-key, evenly lit, clear product focus. Use "studio lighting", "sharp focus". (Cleaner, but ensuring ingredients look real, not plastic).
    2. **premium_editorial**: "Raw & Authentic". Chiaroscuro lighting, deep shadows, rich textures. "Shot on Kodachrome", "film grain", "imperfect plating", "natural window light".
    3. **punchy_social**: "Phone Eats First". Harsh flash, high contrast, vibrant. "Flash photography", "hard shadows", "authentic messy vibe", "up close macro".

    Given the dish details, generate a structured PromptSpec JSON for image generation.

    The PromptSpec must include:
    - subject: The main dish name (feel free to enhance with adjectives)
    - ingredients: Array of visible ingredients (describe their state, e.g. "crispy", "charred")
    - plating: Description of plating style
    - composition: Composition rules for the shot
    - lighting: Lighting setup description (use technical terms like "rim light", "gobo", "softbox")
    - camera: Camera angle and settings
    - background: Background description (add context!)
    - props: Array of props to include
    - mood: Overall mood and atmosphere (be descriptive!)
    - style: Photography style keywords
    - constraints: Array of constraints to follow
    - negative: Array of things to avoid
    - modelHints: Object with aspectRatio and targetModel
    - variantCues: Object containing specific styling instructions for "safe_commercial", "premium_editorial", and "punchy_social"

    Return ONLY valid JSON matching this structure, no markdown code blocks.`;

    const userPrompt = `Generate a PromptSpec for:
Dish: ${input.dishName}
Key Ingredients: ${input.keyIngredients || "not specified"}
Cuisine Style: ${input.cuisineStyle || "modern"}
Marketing Goal: ${input.marketingGoal}
Brand Vibe: ${input.brandVibe || "professional"}
Mood: ${input.mood || "fresh"}
Shot Type: ${input.shotType || "angle_45"}
Background: ${input.background || "studio_seamless"}
Props: ${input.props?.join(", ") || "minimal"}
Aspect Ratio: ${input.aspectRatio}
Target Model: ${input.targetModel}
Strict Ingredients: ${input.strictIngredients}
Leave Negative Space: ${input.leaveNegativeSpace}`;

    const maxRetries = 3;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: systemPrompt + "\n\n" + userPrompt }
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (response.status === 429) {
          // Rate limited - wait and retry
          const retryDelay = Math.pow(2, attempt) * 10000; // 10s, 20s, 40s
          console.log(`Gemini rate limited. Retrying in ${retryDelay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini API error:", errorText);
          return buildPromptSpec(input);
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
          console.error("No content in Gemini response");
          return buildPromptSpec(input);
        }

        // Extract JSON from response (may be wrapped in markdown code blocks)
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        } else {
          const rawMatch = content.match(/\{[\s\S]*\}/);
          if (rawMatch) {
            jsonStr = rawMatch[0];
          }
        }

        const parsed = JSON.parse(jsonStr);
        const validated = PromptSpecSchema.safeParse(parsed);

        if (!validated.success) {
          console.error("Invalid spec from Gemini:", validated.error);
          return buildPromptSpec(input);
        }

        return validated.data;
      } catch (error) {
        lastError = error;
        console.error(`Gemini generation failed (attempt ${attempt + 1}):`, error);
      }
    }

    // All retries failed, fallback to template
    console.error("All Gemini retries failed, using template fallback");
    return buildPromptSpec(input);
  }
}

export function createGeminiProvider(apiKey: string): LLMProvider {
  return new GeminiLLMProvider(apiKey);
}
