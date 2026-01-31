import type { LLMProvider } from "./provider";
import type { GeneratorInput, PromptSpec } from "@/lib/promptSpec";
import { buildPromptSpec } from "@/lib/promptEngine";

export class MockLLMProvider implements LLMProvider {
  name = "mock";

  async generateSpec(input: GeneratorInput): Promise<PromptSpec> {
    return buildPromptSpec(input);
  }
}

export function createMockProvider(): LLMProvider {
  return new MockLLMProvider();
}
