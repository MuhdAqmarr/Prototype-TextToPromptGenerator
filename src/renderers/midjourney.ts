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

  return `${mjFormatted} ${params.join(" ")}`;
}
