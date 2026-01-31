import type { PromptSpec } from "@/lib/promptSpec";

export function renderMidjourney(basePrompt: string, spec: PromptSpec): string {
  const aspectRatio = spec.modelHints.aspectRatio || "1:1";

  const mjFormatted = basePrompt
    .replace(/\s+/g, " ")
    .trim();

  const params = [
    `--ar ${aspectRatio}`,
    "--stylize 750",
    "--quality 2",
    "--v 6",
  ];

  return `${mjFormatted} ${params.join(" ")}`;
}
