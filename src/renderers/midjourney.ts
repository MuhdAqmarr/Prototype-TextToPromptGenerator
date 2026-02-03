import type { PromptSpec } from "@/lib/promptSpec";

export function renderMidjourney(basePrompt: string, spec: PromptSpec): string {
  const aspectRatio = spec.modelHints.aspectRatio || "1:1";

  const mjFormatted = basePrompt
    .replace(/\s+/g, " ")
    .trim();

  const params = [
    `--ar ${aspectRatio}`,
    "--style raw",
    "--stylize 250",
    "--v 6.1",
  ];

  if (spec.referenceImageUrl) {
    // Add Style Reference (sref) for V6
    params.push(`--sref ${spec.referenceImageUrl}`);
    params.push("--sw 100"); // Standard style weight
    params.push("--iw 2"); // Maximum Image Weight to preserve subject structure
  }

  // If there's a reference image, we also prepend it for image-to-image (optional but good for composition)
  const prefix = spec.referenceImageUrl ? `${spec.referenceImageUrl} ` : "";

  return `${prefix}${mjFormatted} ${params.join(" ")}`;
}
