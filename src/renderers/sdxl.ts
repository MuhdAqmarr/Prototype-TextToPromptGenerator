import type { PromptSpec } from "@/lib/promptSpec";

export function renderSDXL(basePrompt: string, spec: PromptSpec): string {
  const qualityTags = [
    "masterpiece",
    "best quality",
    "ultra detailed",
    "sharp focus",
    "professional food photography",
  ];

  const enhancedPrompt = `${qualityTags.join(", ")}, ${basePrompt}`;

  return enhancedPrompt.replace(/\s+/g, " ").trim();
}

export function getSDXLNegative(spec: PromptSpec): string {
  const baseNegative = spec.negative.join(", ");
  const sdxlSpecific = [
    "low quality",
    "worst quality",
    "jpeg artifacts",
    "pixelated",
    "cropped",
    "username",
  ];
  return `${baseNegative}, ${sdxlSpecific.join(", ")}`;
}
