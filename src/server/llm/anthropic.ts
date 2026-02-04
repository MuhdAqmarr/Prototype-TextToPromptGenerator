import type { LLMProvider } from "./provider";
import type { GeneratorInput, PromptSpec } from "@/lib/promptSpec";
import { PromptSpecSchema } from "@/lib/promptSpec";
import { buildPromptSpec } from "@/lib/promptEngine";

export class AnthropicLLMProvider implements LLMProvider {
  name = "anthropic";
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

    **IF VISUAL ANALYSIS IS PROVIDED (HIGH FIDELITY MODE):**
    - You **MUST** strictly follow the "Visual Analysis" for Plating, Composition, and Crockery.
    - **DO NOT CHANGE THE PLATING.** If the analysis says "stainless steel bowl", usage of "ceramic plate" is FORBIDDEN.
    - **DO NOT CHANGE THE LAYOUT.** If the egg is at 11 o'clock, keep it there.
    - **Enhance ONLY the Lighting and Atmosphere.** Make it look like a "pro shot" of the EXACT same plate.
    - Your goal is to **RETAIN THE SUBJECT IDENTITY** while upgrading the visual quality.

    **CONFLICT RESOLUTION:**
    - If "Visual Analysis" contradicts "Key Ingredients" or "Dish Name" (e.g., user says "Beef" but image shows "Chicken"), TRUST THE VISUAL ANALYSIS.
    - If user asks for "Spicy" but image looks mild, follow the image's colors.
    - The Image is the Source of Truth. The Text is just context.

    **CRITICAL: WHEN VISUAL ANALYSIS IS PROVIDED, DO NOT HALLUCINATE FOOD IDENTITY:**
    - Set "subject" to EXACTLY: "the food in the provided image" (DO NOT invent a dish name like "Taco" or "Noodles")
    - Set "ingredients" to an EMPTY ARRAY: []
    - Set "plating" to: "as shown in the reference image"
    - Focus ONLY on Lighting, Camera, Background, Mood, and Style.
    - The renderer (Midjourney/Flux) will use the actual image, not your text description.

    **PRO-MARKETER 2.0 FRAMEWORK (for Nano Banana/Flux):**
    When generating specs for Flux/Banana, remember the final prompt will follow this structure:
    1. [CORE MANDATE]: Maintain food identity from reference image
    2. [SUBJECT]: Marketing goal + mood + props
    3. [SETTING & COMPOSITION]: Shot type + background (blurred if not top-down)
    4. [LIGHTING]: Lighting style + quality descriptors
    5. [TECHNICAL SPECS]: Model, aspect ratio, resolution
    Your PromptSpec should provide clean, minimal values that fit this framework.

    **GENERATE 3 DISTINCT VARIANTS:**
    You must provide specific styling cues for 3 distinct use cases in the 'variantCues' object.
    CRITICAL: The value for each cue must be a SINGLE STRING (a sentence), not an object.

    1. **safe_commercial**: High-key, evenly lit, clear product focus. Use "studio lighting", "sharp focus". (cleaner but authentic).
    2. **premium_editorial**: "Raw & Authentic". Chiaroscuro lighting, deep shadows, rich textures. "Shot on Kodachrome", "film grain", "imperfect plating".
    3. **punchy_social**: "Phone Eats First". Harsh flash, high contrast, vibrant. "Flash photography", "hard shadows", "authentic messy vibe".

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

    Return ONLY valid JSON matching this structure.`;

    const userPrompt = `Generate a PromptSpec for:
Dish: ${input.dishName}
Visual Analysis (STRICTLY FOLLOW THIS): ${input.visualAnalysis || "None provided - use creative freedom"}
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
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          }),
        });

        if (response.status === 429) {
          // Rate limited - wait and retry
          const retryDelay = Math.pow(2, attempt) * 5000;
          console.log(`Anthropic rate limited. Retrying in ${retryDelay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        if (!response.ok) {
          console.error("Anthropic API error:", await response.text());
          // If it's a 4xx error (auth, bad request), don't retry
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            return buildPromptSpec(input);
          }
          lastError = new Error(`Anthropic status ${response.status}`);
          continue;
        }

        const data = await response.json();
        const content = data.content?.[0]?.text;

        if (!content) {
          lastError = new Error("No content in response");
          continue;
        }

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          lastError = new Error("No JSON found in response");
          continue;
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const validated = PromptSpecSchema.safeParse(parsed);

        if (!validated.success) {
          console.error("Invalid spec from LLM:", validated.error);
          lastError = new Error("Invalid spec");
          // Maybe don't retry validation errors? For now, fallback.
          return buildPromptSpec(input);
        }

        return validated.data;
      } catch (error) {
        lastError = error;
        console.error(`LLM generation failed (attempt ${attempt + 1}):`, error);
      }
    }

    console.error("All Anthropic retries failed:", lastError);
    return buildPromptSpec(input);
  }
}

export function createAnthropicProvider(apiKey: string): LLMProvider {
  return new AnthropicLLMProvider(apiKey);
}
