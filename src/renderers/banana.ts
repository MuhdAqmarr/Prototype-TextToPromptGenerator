import type { PromptSpec } from "@/lib/promptSpec";

export function renderBanana(basePrompt: string, spec: PromptSpec): string {
    // Nano Banana (likely Flux-based) prefers natural language flow without too many technical parameters

    // Clean up the prompt to be more conversational if possible
    const cleanPrompt = basePrompt
        .replace(/\s+/g, " ")
        .trim();

    // Add specific triggers for quality if needed, but keep it minimal
    // Flux responds well to "ultra realistic", "8k", "photorealistic"
    const qualityTrigger = "ultra realistic, 8k, photorealistic masterpiece";

    if (cleanPrompt.includes(qualityTrigger)) {
        return cleanPrompt;
    }

  if (spec.referenceImageUrl) {
    return `(Image Reference: ${spec.referenceImageUrl}) (Maintain exact composition and plating of reference image) ${cleanPrompt}, ${qualityTrigger}`;
  }

  return `${cleanPrompt}, ${qualityTrigger}`;
}
