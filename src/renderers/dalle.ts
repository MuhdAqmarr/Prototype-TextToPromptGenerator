import type { PromptSpec } from "@/lib/promptSpec";

export function renderDalle(basePrompt: string, spec: PromptSpec): string {
  const naturalLanguage = `A professional food photograph of ${spec.subject}. ${
    spec.ingredients.length > 0
      ? `The dish features ${spec.ingredients.join(", ")}.`
      : ""
  } ${spec.lighting}. ${spec.camera}. ${spec.background}. ${
    spec.props.length > 0
      ? `Styled with ${spec.props.join(", ")}.`
      : ""
  } ${spec.mood}. ${spec.style}. ${
    spec.constraints.length > 0
      ? spec.constraints.join(". ") + "."
      : ""
  }`;

  return naturalLanguage
    .replace(/\s+/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim();
}
