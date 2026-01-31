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

    Think about:
    - **Sensory Details**: Texture, temperature (steam, condensation), freshness.
    - **Lighting Mastery**: How light interacts with the ingredients (glazing, translucency).
    - **Brand Storytelling**: The mood should align perfectly with the marketing goal.

    Given the dish details, generate a structured PromptSpec JSON for image generation.

    The PromptSpec must include:
    - subject: The main dish name
    - ingredients: Array of visible ingredients
    - plating: Description of plating style
    - composition: Composition rules for the shot
    - lighting: Lighting setup description
    - camera: Camera angle and settings
    - background: Background description
    - props: Array of props to include
    - mood: Overall mood and atmosphere (be descriptive!)
    - style: Photography style keywords
    - constraints: Array of constraints to follow
    - negative: Array of things to avoid
    - modelHints: Object with aspectRatio and targetModel

    Return ONLY valid JSON matching this structure.`;

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
