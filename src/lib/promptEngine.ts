import type {
  GeneratorInput,
  GeneratorOutput,
  PromptSpec,
  VariantType,
} from "./promptSpec";
import {
  LIGHTING_PRESETS,
  COMPOSITION_RULES,
  FOOD_REALISM_BOOSTERS,
  NEGATIVE_PROMPT_BASE,
  BRAND_VIBE_PRESETS,
} from "./presets";
import { renderMidjourney } from "@/renderers/midjourney";
import { renderSDXL } from "@/renderers/sdxl";
import { renderDalle } from "@/renderers/dalle";

export function buildPromptSpec(input: GeneratorInput): PromptSpec {
  const mood = input.mood || "fresh";
  const shotType = input.shotType || "angle_45";
  const background = input.background || "studio_seamless";

  const brandKeywords = input.brandVibe
    ? BRAND_VIBE_PRESETS.find((p) => p.id === input.brandVibe)?.keywords || [
        input.brandVibe,
      ]
    : [];

  const lightingOptions = LIGHTING_PRESETS[mood] || LIGHTING_PRESETS.fresh;
  const lighting = lightingOptions[0];

  const composition = COMPOSITION_RULES[input.marketingGoal];

  const cameraMap: Record<string, string> = {
    top_down: "shot from directly above, flat lay perspective, 90-degree angle",
    angle_45:
      "shot at 45-degree angle, classic food photography perspective, eye-catching diagonal",
    eye_level:
      "shot at eye level, immersive perspective, looking straight at the dish",
    macro:
      "extreme close-up macro shot, focus on textures and details, shallow depth of field",
  };

  const backgroundMap: Record<string, string> = {
    studio_seamless: "clean white seamless studio background",
    marble: "elegant white marble surface with subtle veining",
    rustic_wood: "warm rustic wooden table surface with natural grain",
    cafe_table: "cafe table setting with ambient blur background",
    banana_leaf: "fresh green banana leaf as natural plating surface",
    street_stall: "authentic street food stall environment",
  };

  const ingredients = input.keyIngredients
    ? input.keyIngredients.split(",").map((i) => i.trim())
    : [];

  const props = input.props?.map((p) => p.replace(/_/g, " ")) || [];

  if (input.quickFixes?.includes("more_steam")) {
    props.push("visible steam rising");
  }
  if (input.quickFixes?.includes("crisp_texture")) {
    props.push("crispy golden texture");
  }

  const constraints: string[] = [];
  if (input.strictIngredients) {
    constraints.push(
      "only show specified ingredients, no additional garnishes or extras"
    );
  }
  if (input.leaveNegativeSpace) {
    constraints.push("leave negative space for text overlay");
  }
  if (input.dietaryFlags?.includes("halal")) {
    constraints.push("halal-certified presentation");
  }
  if (input.dietaryFlags?.includes("vegan")) {
    constraints.push("plant-based, no animal products visible");
  }

  const negative = [...NEGATIVE_PROMPT_BASE];
  if (input.strictIngredients) {
    negative.push("extra garnishes", "additional ingredients");
  }

  let lightingAdjusted = lighting;
  if (input.quickFixes?.includes("brighter_lighting")) {
    lightingAdjusted = "bright, well-lit " + lighting;
  }

  let propsAdjusted = [...props];
  if (input.quickFixes?.includes("less_props")) {
    propsAdjusted = propsAdjusted.slice(0, 2);
  }

  let styleExtra = "";
  if (input.quickFixes?.includes("more_premium")) {
    styleExtra = ", luxury high-end presentation, premium quality";
  }

  let cameraAdjusted = cameraMap[shotType];
  if (input.quickFixes?.includes("closer_shot")) {
    cameraAdjusted += ", tight crop, filling the frame";
  }

  return {
    subject: input.dishName,
    ingredients,
    plating: `appetizing ${input.cuisineStyle || "modern"} plating style`,
    composition,
    lighting: lightingAdjusted,
    camera: cameraAdjusted,
    background: backgroundMap[background],
    props: propsAdjusted,
    mood: `${mood} atmosphere, ${brandKeywords.join(", ")}`.trim(),
    style: `professional food photography${styleExtra}, ${FOOD_REALISM_BOOSTERS.slice(0, 5).join(", ")}`,
    constraints,
    negative,
    modelHints: {
      aspectRatio: input.aspectRatio,
      targetModel: input.targetModel,
    },
  };
}

function buildVariantPrompt(
  spec: PromptSpec,
  variant: VariantType,
  targetModel: string
): string {
  const variantModifiers: Record<VariantType, string[]> = {
    safe_commercial: [
      "clean commercial look",
      "professional advertising quality",
      "menu-ready",
      "broad appeal",
    ],
    premium_editorial: [
      "editorial food photography",
      "magazine quality",
      "artistic composition",
      "sophisticated mood",
    ],
    punchy_social: [
      "scroll-stopping",
      "vibrant and bold",
      "instagram-worthy",
      "trendy food styling",
    ],
  };

  const modifiers = variantModifiers[variant];

  const promptParts = [
    spec.subject,
    spec.ingredients.length > 0 ? `with ${spec.ingredients.join(", ")}` : "",
    spec.plating,
    spec.lighting,
    spec.camera,
    spec.background,
    spec.props.length > 0 ? `props: ${spec.props.join(", ")}` : "",
    spec.mood,
    spec.style,
    modifiers.join(", "),
    spec.constraints.length > 0 ? spec.constraints.join(", ") : "",
  ]
    .filter(Boolean)
    .join(", ");

  const renderer =
    targetModel === "sdxl"
      ? renderSDXL
      : targetModel === "dalle"
        ? renderDalle
        : renderMidjourney;

  return renderer(promptParts, spec);
}

export function generatePrompts(input: GeneratorInput): GeneratorOutput {
  const spec = buildPromptSpec(input);

  const variantA = buildVariantPrompt(spec, "safe_commercial", input.targetModel);
  const variantB = buildVariantPrompt(
    spec,
    "premium_editorial",
    input.targetModel
  );
  const variantC = buildVariantPrompt(spec, "punchy_social", input.targetModel);

  const negativePrompt = spec.negative.join(", ");

  const settingsMap: Record<string, Record<string, string>> = {
    midjourney: {
      "Aspect Ratio": `--ar ${input.aspectRatio.replace(":", ":")}`,
      Stylize: "--stylize 750",
      Quality: "--quality 2",
      Version: "--v 6",
      Note: "Add --no text artifacts, watermark for cleaner output",
    },
    sdxl: {
      "CFG Scale": "7-7.5",
      Steps: "28-35",
      Sampler: "DPM++ 2M Karras",
      "Clip Skip": "2",
      Resolution:
        input.aspectRatio === "1:1"
          ? "1024x1024"
          : input.aspectRatio === "4:5"
            ? "896x1120"
            : input.aspectRatio === "9:16"
              ? "768x1344"
              : "1344x768",
      Note: "Use food photography LoRA if available",
    },
    dalle: {
      Quality: "HD",
      Style: "Natural",
      Size:
        input.aspectRatio === "1:1"
          ? "1024x1024"
          : input.aspectRatio === "16:9"
            ? "1792x1024"
            : "1024x1792",
      Note: "DALL-E 3 generates natural-looking food well",
    },
  };

  return {
    spec,
    outputs: {
      variantA: { prompt: variantA, type: "safe_commercial" },
      variantB: { prompt: variantB, type: "premium_editorial" },
      variantC: { prompt: variantC, type: "punchy_social" },
      negative: negativePrompt,
      settings: settingsMap[input.targetModel] || settingsMap.midjourney,
    },
  };
}
