export interface BrandVibePreset {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export const BRAND_VIBE_PRESETS: BrandVibePreset[] = [
  {
    id: "modern_minimalist",
    name: "Modern Minimalist",
    description: "Clean, sophisticated, lots of white space",
    keywords: ["minimalist", "clean", "modern", "sophisticated", "white space"],
  },
  {
    id: "rustic_artisan",
    name: "Rustic Artisan",
    description: "Handcrafted feel, natural textures, warm tones",
    keywords: ["rustic", "artisan", "handcrafted", "natural", "warm"],
  },
  {
    id: "bold_vibrant",
    name: "Bold & Vibrant",
    description: "High contrast, saturated colors, energetic",
    keywords: ["bold", "vibrant", "saturated", "energetic", "colorful"],
  },
  {
    id: "luxury_premium",
    name: "Luxury Premium",
    description: "High-end, elegant, dark moody tones",
    keywords: ["luxury", "premium", "elegant", "sophisticated", "moody"],
  },
  {
    id: "casual_friendly",
    name: "Casual & Friendly",
    description: "Approachable, warm, family-style",
    keywords: ["casual", "friendly", "approachable", "warm", "inviting"],
  },
  {
    id: "street_authentic",
    name: "Street Authentic",
    description: "Raw, genuine, documentary-style",
    keywords: ["street", "authentic", "raw", "genuine", "documentary"],
  },
  {
    id: "health_wellness",
    name: "Health & Wellness",
    description: "Fresh, bright, natural ingredients focus",
    keywords: ["healthy", "fresh", "natural", "bright", "organic"],
  },
  {
    id: "indulgent_comfort",
    name: "Indulgent Comfort",
    description: "Rich, satisfying, comfort food vibes",
    keywords: ["indulgent", "comfort", "rich", "satisfying", "hearty"],
  },
];

export const LIGHTING_PRESETS: Record<string, string[]> = {
  fresh: [
    "bright natural daylight",
    "soft diffused window light",
    "airy backlight with gentle rim lighting",
  ],
  indulgent: [
    "warm golden hour light",
    "dramatic side lighting with deep shadows",
    "soft spotlight with dark background",
  ],
  cozy: [
    "warm ambient tungsten light",
    "soft candlelit atmosphere",
    "gentle morning light through curtains",
  ],
  premium: [
    "controlled studio lighting with subtle gradients",
    "dramatic chiaroscuro with single key light",
    "elegant rim lighting on dark backdrop",
  ],
  street: [
    "harsh midday sun with strong shadows",
    "neon street lights mixed with natural light",
    "overcast diffused outdoor light",
  ],
};

export const COMPOSITION_RULES: Record<string, string> = {
  menu_hero: "centered hero composition, dish as clear focal point, clean edges",
  promo_banner: "rule of thirds, negative space on left or right for text overlay",
  social_feed: "centered or slightly off-center, strong visual impact, scroll-stopping",
  social_story: "vertical composition, subject in center-lower third, space for text above",
  delivery_listing: "top-down or 45-degree, portion clearly visible, clean background",
};

export const FOOD_REALISM_BOOSTERS: string[] = [
  "realistic food texture",
  "appetizing presentation",
  "professional food photography",
  "sharp focus on food details",
  "natural color accuracy",
  "mouthwatering appearance",
  "crispy golden edges where applicable",
  "glistening sauce sheen",
  "visible steam rising",
  "condensation droplets on cold items",
  "caramelized surfaces",
  "fresh herb garnish details",
];

export const NEGATIVE_PROMPT_BASE: string[] = [
  "artificial looking",
  "plastic food",
  "oversaturated",
  "blurry",
  "out of focus",
  "distorted",
  "unappetizing",
  "dirty plate",
  "messy background",
  "low quality",
  "amateur photography",
  "text",
  "watermark",
  "logo",
  "signature",
  "human hands visible",
  "fingers in frame",
  "deformed food",
  "melted incorrectly",
  "wrong proportions",
];
