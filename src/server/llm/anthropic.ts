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
    const systemPrompt = `You are a professional food photography prompt engineer. Given dish details, generate a structured PromptSpec JSON for image generation.

The PromptSpec must include:
- subject: The main dish name
- ingredients: Array of visible ingredients
- plating: Description of plating style
- composition: Composition rules for the shot
- lighting: Lighting setup description
- camera: Camera angle and settings
- background: Background description
- props: Array of props to include
- mood: Overall mood and atmosphere
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

      if (!response.ok) {
        console.error("Anthropic API error:", await response.text());
        return buildPromptSpec(input);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;

      if (!content) {
        return buildPromptSpec(input);
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return buildPromptSpec(input);
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const validated = PromptSpecSchema.safeParse(parsed);

      if (!validated.success) {
        console.error("Invalid spec from LLM:", validated.error);
        return buildPromptSpec(input);
      }

      return validated.data;
    } catch (error) {
      console.error("LLM generation failed:", error);
      return buildPromptSpec(input);
    }
  }
}

export function createAnthropicProvider(apiKey: string): LLMProvider {
  return new AnthropicLLMProvider(apiKey);
}
