import { describe, it, expect } from "vitest";
import { renderMidjourney } from "@/renderers/midjourney";
import { renderSDXL } from "@/renderers/sdxl";
import { renderDalle } from "@/renderers/dalle";
import type { PromptSpec } from "@/lib/promptSpec";

const mockSpec: PromptSpec = {
  subject: "gourmet burger",
  ingredients: ["wagyu patty", "cheddar cheese", "brioche bun"],
  plating: "modern American plating",
  composition: "centered hero composition",
  lighting: "bright natural daylight",
  camera: "shot at 45-degree angle",
  background: "clean white seamless studio background",
  props: ["napkin", "sauce drizzle"],
  mood: "fresh atmosphere, modern, clean",
  style: "professional food photography",
  constraints: [],
  negative: ["artificial", "blurry", "low quality"],
  modelHints: {
    aspectRatio: "1:1",
    targetModel: "midjourney",
  },
};

describe("Midjourney Renderer", () => {
  it("should include aspect ratio parameter", () => {
    const result = renderMidjourney("test prompt", mockSpec);
    expect(result).toContain("--ar 1:1");
  });

  it("should include stylize parameter", () => {
    const result = renderMidjourney("test prompt", mockSpec);
    expect(result).toContain("--stylize");
  });

  it("should include version parameter", () => {
    const result = renderMidjourney("test prompt", mockSpec);
    expect(result).toContain("--v 6");
  });

  it("should include the base prompt", () => {
    const result = renderMidjourney("gourmet burger photography", mockSpec);
    expect(result).toContain("gourmet burger photography");
  });
});

describe("SDXL Renderer", () => {
  it("should include quality tags", () => {
    const result = renderSDXL("test prompt", mockSpec);
    expect(result).toContain("masterpiece");
    expect(result).toContain("best quality");
  });

  it("should include ultra detailed tag", () => {
    const result = renderSDXL("test prompt", mockSpec);
    expect(result).toContain("ultra detailed");
  });

  it("should include the base prompt", () => {
    const result = renderSDXL("gourmet burger photography", mockSpec);
    expect(result).toContain("gourmet burger photography");
  });
});

describe("DALL-E Renderer", () => {
  it("should produce natural language description", () => {
    const result = renderDalle("test prompt", mockSpec);
    expect(result).toContain("professional food photograph");
  });

  it("should include subject", () => {
    const result = renderDalle("test prompt", mockSpec);
    expect(result).toContain("gourmet burger");
  });

  it("should include ingredients when provided", () => {
    const result = renderDalle("test prompt", mockSpec);
    expect(result).toContain("wagyu patty");
    expect(result).toContain("cheddar cheese");
  });

  it("should include lighting description", () => {
    const result = renderDalle("test prompt", mockSpec);
    expect(result).toContain("bright natural daylight");
  });
});
