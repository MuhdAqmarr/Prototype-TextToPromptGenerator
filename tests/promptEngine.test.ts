import { describe, it, expect } from "vitest";
import { buildPromptSpec, generatePrompts } from "@/lib/promptEngine";
import type { GeneratorInput } from "@/lib/promptSpec";

const mockInput: GeneratorInput = {
  dishName: "Wagyu Beef Burger",
  keyIngredients: "wagyu patty, cheddar cheese, caramelized onions, brioche bun",
  cuisineStyle: "American",
  dietaryFlags: [],
  marketingGoal: "menu_hero",
  brandVibe: "modern_minimalist",
  mood: "fresh",
  shotType: "angle_45",
  background: "studio_seamless",
  props: ["napkin", "sauce_drizzle"],
  aspectRatio: "1:1",
  targetModel: "midjourney",
  strictIngredients: false,
  leaveNegativeSpace: false,
  quickFixes: [],
};

describe("buildPromptSpec", () => {
  it("should build a valid PromptSpec from input", () => {
    const spec = buildPromptSpec(mockInput);

    expect(spec.subject).toBe("Wagyu Beef Burger");
    expect(spec.ingredients).toContain("wagyu patty");
    expect(spec.ingredients).toContain("cheddar cheese");
  });

  it("should include lighting based on mood", () => {
    const spec = buildPromptSpec(mockInput);
    expect(spec.lighting).toBeDefined();
    expect(spec.lighting.length).toBeGreaterThan(0);
  });

  it("should include composition based on marketing goal", () => {
    const spec = buildPromptSpec(mockInput);
    expect(spec.composition).toContain("centered");
  });

  it("should add constraints when strictIngredients is true", () => {
    const strictInput = { ...mockInput, strictIngredients: true };
    const spec = buildPromptSpec(strictInput);
    expect(spec.constraints.some((c) => c.includes("only"))).toBe(true);
  });

  it("should add negative space constraint when enabled", () => {
    const negSpaceInput = { ...mockInput, leaveNegativeSpace: true };
    const spec = buildPromptSpec(negSpaceInput);
    expect(spec.constraints.some((c) => c.includes("negative space"))).toBe(true);
  });
});

describe("generatePrompts", () => {
  it("should return 3 variants", () => {
    const output = generatePrompts(mockInput);

    expect(output.outputs.variantA).toBeDefined();
    expect(output.outputs.variantB).toBeDefined();
    expect(output.outputs.variantC).toBeDefined();
  });

  it("should return variant types", () => {
    const output = generatePrompts(mockInput);

    expect(output.outputs.variantA.type).toBe("safe_commercial");
    expect(output.outputs.variantB.type).toBe("premium_editorial");
    expect(output.outputs.variantC.type).toBe("punchy_social");
  });

  it("should return negative prompt", () => {
    const output = generatePrompts(mockInput);
    expect(output.outputs.negative).toBeDefined();
    expect(output.outputs.negative.length).toBeGreaterThan(0);
  });

  it("should return settings", () => {
    const output = generatePrompts(mockInput);
    expect(output.outputs.settings).toBeDefined();
    expect(Object.keys(output.outputs.settings).length).toBeGreaterThan(0);
  });

  it("should include spec in output", () => {
    const output = generatePrompts(mockInput);
    expect(output.spec).toBeDefined();
    expect(output.spec.subject).toBe("Wagyu Beef Burger");
  });

  it("should be deterministic in MOCK mode", () => {
    const output1 = generatePrompts(mockInput);
    const output2 = generatePrompts(mockInput);

    expect(output1.outputs.variantA.prompt).toBe(output2.outputs.variantA.prompt);
    expect(output1.outputs.variantB.prompt).toBe(output2.outputs.variantB.prompt);
    expect(output1.outputs.variantC.prompt).toBe(output2.outputs.variantC.prompt);
  });

  it("should apply quick fixes", () => {
    const inputWithFixes: GeneratorInput = {
      ...mockInput,
      quickFixes: ["brighter_lighting", "more_premium"],
    };
    const output = generatePrompts(inputWithFixes);

    expect(output.outputs.variantA.prompt).toContain("bright");
  });
});
