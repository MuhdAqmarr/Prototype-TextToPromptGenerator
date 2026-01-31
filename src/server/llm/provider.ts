import type { GeneratorInput, PromptSpec } from "@/lib/promptSpec";

export interface LLMProvider {
  name: string;
  generateSpec(input: GeneratorInput): Promise<PromptSpec>;
}

export type LLMProviderFactory = () => LLMProvider;
