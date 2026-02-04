import { z } from "zod";

export const MarketingGoal = z.enum([
  "menu_hero",
  "promo_banner",
  "social_feed",
  "social_story",
  "delivery_listing",
]);
export type MarketingGoal = z.infer<typeof MarketingGoal>;

export const Mood = z.enum(["fresh", "indulgent", "cozy", "premium", "street"]);
export type Mood = z.infer<typeof Mood>;

export const ShotType = z.enum(["top_down", "angle_45", "eye_level", "macro"]);
export type ShotType = z.infer<typeof ShotType>;

export const Background = z.enum([
  "studio_seamless",
  "marble",
  "rustic_wood",
  "cafe_table",
  "banana_leaf",
  "street_stall",
]);
export type Background = z.infer<typeof Background>;

// Advertising Style: Lighting Magic Keywords
export const LightingStyle = z.enum([
  "softbox",
  "volumetric",
  "golden_hour",
  "rim_lighting",
  "natural_window",
  "dramatic_shadow",
]);
export type LightingStyle = z.infer<typeof LightingStyle>;

export const LIGHTING_LABELS: Record<LightingStyle, string> = {
  softbox: "Softbox Lighting",
  volumetric: "Volumetric Lighting",
  golden_hour: "Golden Hour",
  rim_lighting: "Rim Lighting",
  natural_window: "Natural Window Light",
  dramatic_shadow: "Dramatic Shadows",
};

// Advertising Style: Quality Boost Keywords
export const QualityBoost = z.enum([
  "8k_resolution",
  "photorealistic",
  "commercial_grade",
  "85mm_lens",
  "bokeh_effect",
  "sharp_focus",
  "vibrant_colors",
]);
export type QualityBoost = z.infer<typeof QualityBoost>;

export const QUALITY_LABELS: Record<QualityBoost, string> = {
  "8k_resolution": "8K Resolution",
  photorealistic: "Photorealistic",
  commercial_grade: "Commercial Grade",
  "85mm_lens": "Shot on 85mm Lens",
  bokeh_effect: "Bokeh Effect",
  sharp_focus: "Sharp Focus on Food",
  vibrant_colors: "Vibrant Colors",
};

export const AspectRatio = z.enum(["1:1", "4:5", "9:16", "16:9"]);
export type AspectRatio = z.infer<typeof AspectRatio>;

export const TargetModel = z.enum(["midjourney", "sdxl", "dalle", "banana"]);
export type TargetModel = z.infer<typeof TargetModel>;

export const DietaryFlag = z.enum([
  "halal",
  "vegan",
  "vegetarian",
  "gluten_free",
]);
export type DietaryFlag = z.infer<typeof DietaryFlag>;

export const Prop = z.enum([
  "chopsticks",
  "fork_knife",
  "napkin",
  "herbs",
  "sauce_drizzle",
  "steam",
  "ice_cubes",
  "condensation",
  "lime_wedge",
  "chili_flakes",
  "sesame_seeds",
  "garnish_leaf",
]);
export type Prop = z.infer<typeof Prop>;

export const QuickFix = z.enum([
  "brighter_lighting",
  "less_props",
  "more_premium",
  "closer_shot",
  "more_steam",
  "crisp_texture",
]);
export type QuickFix = z.infer<typeof QuickFix>;

export const GeneratorInputSchema = z.object({
  dishName: z.string().min(1, "Dish name is required"),
  keyIngredients: z.string().optional(),
  cuisineStyle: z.string().optional(),
  dietaryFlags: z.array(DietaryFlag).optional(),
  marketingGoal: MarketingGoal,
  brandVibe: z.string().optional(),
  mood: Mood.optional(),
  shotType: ShotType.optional(),
  background: Background.optional(),
  lightingStyle: LightingStyle.optional(), // NEW: Advertising Style Lighting
  qualityBoosts: z.array(QualityBoost).optional(), // NEW: Quality keyword multi-select
  props: z.array(Prop).optional(),
  aspectRatio: AspectRatio.default("1:1"),
  targetModel: TargetModel.default("midjourney"),
  strictIngredients: z.boolean().default(false),
  leaveNegativeSpace: z.boolean().default(false),
  enableVision: z.boolean().default(false), // NEW: Toggle for Vision Analysis
  quickFixes: z.array(QuickFix).optional(),
  referenceImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  visualAnalysis: z.string().optional(), // Analysis from Gemini Vision
  referenceImage: z.string().optional(), // base64-encoded image (legacy)
});
export type GeneratorInput = z.infer<typeof GeneratorInputSchema>;
export type GeneratorFormInput = z.input<typeof GeneratorInputSchema>;

export const PromptSpecSchema = z.object({
  subject: z.string(),
  ingredients: z.array(z.string()),
  plating: z.string(),
  composition: z.string(),
  lighting: z.string(),
  camera: z.string(),
  background: z.string(),
  props: z.array(z.string()),
  mood: z.string(),
  style: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val) ? val.join(", ") : val
  ),
  constraints: z.array(z.string()),
  negative: z.array(z.string()),
  modelHints: z.record(z.string(), z.string()),
  variantCues: z.object({
    safe_commercial: z.string().describe("Specific styling cues for clean, commercial advertising look"),
    premium_editorial: z.string().describe("Specific styling cues for moody, high-end magazine look"),
    punchy_social: z.string().describe("Specific styling cues for vibrant, bold, scroll-stopping social media look"),
  }).optional(),
  referenceImageUrl: z.string().optional(),
});
export type PromptSpec = z.infer<typeof PromptSpecSchema>;

export const VariantType = z.enum([
  "safe_commercial",
  "premium_editorial",
  "punchy_social",
]);
export type VariantType = z.infer<typeof VariantType>;

export const GeneratorOutputSchema = z.object({
  spec: PromptSpecSchema,
  outputs: z.object({
    variantA: z.object({ prompt: z.string(), type: VariantType }),
    variantB: z.object({ prompt: z.string(), type: VariantType }),
    variantC: z.object({ prompt: z.string(), type: VariantType }),
    negative: z.string(),
    settings: z.record(z.string(), z.string()),
  }),
});
export type GeneratorOutput = z.infer<typeof GeneratorOutputSchema>;

export const MARKETING_GOAL_LABELS: Record<MarketingGoal, string> = {
  menu_hero: "Menu Hero Shot",
  promo_banner: "Promo Banner",
  social_feed: "Social Feed (IG/FB)",
  social_story: "Social Story/Reel",
  delivery_listing: "Delivery App Listing",
};

export const MOOD_LABELS: Record<Mood, string> = {
  fresh: "Fresh & Light",
  indulgent: "Indulgent & Rich",
  cozy: "Cozy & Warm",
  premium: "Premium & Elegant",
  street: "Street & Authentic",
};

export const SHOT_TYPE_LABELS: Record<ShotType, string> = {
  top_down: "Top-Down (Flat Lay)",
  angle_45: "45° Angle",
  eye_level: "Eye Level",
  macro: "Macro Close-up",
};

export const BACKGROUND_LABELS: Record<Background, string> = {
  studio_seamless: "Studio Seamless",
  marble: "Marble Surface",
  rustic_wood: "Rustic Wood",
  cafe_table: "Cafe Table",
  banana_leaf: "Banana Leaf",
  street_stall: "Street Food Stall",
};

export const ASPECT_RATIO_LABELS: Record<AspectRatio, string> = {
  "1:1": "Square (1:1)",
  "4:5": "Portrait (4:5)",
  "9:16": "Story (9:16)",
  "16:9": "Landscape (16:9)",
};

export const MODEL_LABELS: Record<TargetModel, string> = {
  midjourney: "Midjourney",
  sdxl: "SDXL",
  dalle: "DALL·E 3",
  banana: "Nano Banana",
};

export const DIETARY_FLAG_LABELS: Record<DietaryFlag, string> = {
  halal: "Halal",
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  gluten_free: "Gluten-Free",
};

export const PROP_LABELS: Record<Prop, string> = {
  chopsticks: "Chopsticks",
  fork_knife: "Fork & Knife",
  napkin: "Napkin",
  herbs: "Fresh Herbs",
  sauce_drizzle: "Sauce Drizzle",
  steam: "Steam",
  ice_cubes: "Ice Cubes",
  condensation: "Condensation",
  lime_wedge: "Lime Wedge",
  chili_flakes: "Chili Flakes",
  sesame_seeds: "Sesame Seeds",
  garnish_leaf: "Garnish Leaf",
};

export const QUICK_FIX_LABELS: Record<QuickFix, string> = {
  brighter_lighting: "Brighter lighting",
  less_props: "Less props",
  more_premium: "More premium",
  closer_shot: "Closer shot",
  more_steam: "More steam/heat",
  crisp_texture: "Crisp texture",
};
