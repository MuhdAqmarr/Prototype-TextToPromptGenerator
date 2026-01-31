import type { MarketingGoal, TargetModel } from "./promptSpec";

export interface PromptTemplate {
  id: string;
  name: string;
  category: PromptCategory;
  goals: MarketingGoal[];
  description: string;
  basePrompt: string;
  negativePrompt: string;
  suggestedSettings: Record<TargetModel, Record<string, string>>;
  tags: string[];
}

export type PromptCategory =
  | "burger"
  | "fried_chicken"
  | "noodles"
  | "desserts"
  | "coffee"
  | "cocktails"
  | "sushi"
  | "bakery";

export const CATEGORY_LABELS: Record<PromptCategory, string> = {
  burger: "Burgers",
  fried_chicken: "Fried Chicken",
  noodles: "Noodles & Ramen",
  desserts: "Desserts",
  coffee: "Coffee & Drinks",
  cocktails: "Cocktails",
  sushi: "Sushi & Japanese",
  bakery: "Bakery & Pastries",
};

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "burger_hero",
    name: "Classic Burger Hero",
    category: "burger",
    goals: ["menu_hero", "social_feed"],
    description: "Towering gourmet burger with all the fixings",
    basePrompt:
      "professional food photography of a gourmet burger, juicy beef patty with melted cheese dripping, fresh lettuce, ripe tomato slice, sesame seed bun, {lighting}, {composition}, {background}, appetizing steam rising, sharp focus, 8k resolution, commercial quality",
    negativePrompt:
      "artificial, plastic, flat, dry, unappetizing, blurry, amateur",
    suggestedSettings: {
      midjourney: { ar: "1:1", stylize: "750", quality: "2" },
      sdxl: { cfg: "7", steps: "30", sampler: "DPM++ 2M Karras" },
      dalle: { quality: "hd", style: "vivid" },
    },
    tags: ["burger", "american", "gourmet", "comfort food"],
  },
  {
    id: "fried_chicken_crispy",
    name: "Crispy Fried Chicken",
    category: "fried_chicken",
    goals: ["menu_hero", "delivery_listing"],
    description: "Golden crispy fried chicken with perfect crust",
    basePrompt:
      "professional food photography of crispy fried chicken, golden brown crust with visible crunch texture, steam rising, {lighting}, {composition}, {background}, garnished with fresh herbs, sharp focus, commercial food photography, 8k",
    negativePrompt:
      "soggy, pale, burnt, oily puddle, unappetizing, blurry, amateur",
    suggestedSettings: {
      midjourney: { ar: "4:5", stylize: "500", quality: "2" },
      sdxl: { cfg: "7.5", steps: "28", sampler: "DPM++ 2M Karras" },
      dalle: { quality: "hd", style: "natural" },
    },
    tags: ["chicken", "fried", "crispy", "comfort food"],
  },
  {
    id: "ramen_bowl",
    name: "Steaming Ramen Bowl",
    category: "noodles",
    goals: ["menu_hero", "social_feed"],
    description: "Rich ramen with soft-boiled egg and chashu",
    basePrompt:
      "professional food photography of authentic ramen bowl, rich tonkotsu broth, perfectly cooked noodles, soft-boiled ajitama egg with runny yolk, tender chashu pork slices, fresh green onions, nori sheet, visible steam rising, {lighting}, {composition}, {background}, shot with 85mm lens, shallow depth of field, 8k",
    negativePrompt:
      "overcooked egg, cloudy broth, soggy noodles, artificial, blurry",
    suggestedSettings: {
      midjourney: { ar: "1:1", stylize: "600", quality: "2" },
      sdxl: { cfg: "7", steps: "32", sampler: "DPM++ 2M Karras" },
      dalle: { quality: "hd", style: "natural" },
    },
    tags: ["ramen", "japanese", "noodles", "soup", "comfort food"],
  },
  {
    id: "chocolate_cake",
    name: "Decadent Chocolate Cake",
    category: "desserts",
    goals: ["menu_hero", "social_feed", "promo_banner"],
    description: "Rich chocolate layer cake with ganache",
    basePrompt:
      "professional food photography of decadent chocolate layer cake, glossy dark chocolate ganache dripping down sides, visible moist cake layers, chocolate shavings on top, {lighting}, {composition}, {background}, elegant plating on dark slate, commercial dessert photography, 8k",
    negativePrompt:
      "dry, crumbly, dull, flat chocolate, artificial, melted mess",
    suggestedSettings: {
      midjourney: { ar: "4:5", stylize: "800", quality: "2" },
      sdxl: { cfg: "7", steps: "30", sampler: "DPM++ 2M Karras" },
      dalle: { quality: "hd", style: "vivid" },
    },
    tags: ["chocolate", "cake", "dessert", "indulgent"],
  },
  {
    id: "latte_art",
    name: "Artisan Latte Art",
    category: "coffee",
    goals: ["social_feed", "social_story"],
    description: "Beautiful latte art in ceramic cup",
    basePrompt:
      "professional beverage photography of artisan latte with intricate rosetta latte art, creamy microfoam, served in ceramic cup on wooden table, {lighting}, {composition}, {background}, coffee beans scattered, steam wisps, shallow depth of field, warm cozy atmosphere, 8k",
    negativePrompt:
      "spilled, messy, no foam, cold looking, artificial, blurry",
    suggestedSettings: {
      midjourney: { ar: "1:1", stylize: "550", quality: "2" },
      sdxl: { cfg: "6.5", steps: "28", sampler: "DPM++ 2M Karras" },
      dalle: { quality: "hd", style: "natural" },
    },
    tags: ["coffee", "latte", "cafe", "artisan"],
  },
  {
    id: "cocktail_tropical",
    name: "Tropical Cocktail",
    category: "cocktails",
    goals: ["menu_hero", "social_feed"],
    description: "Vibrant tropical cocktail with garnishes",
    basePrompt:
      "professional beverage photography of tropical cocktail, vibrant orange and pink gradient, served in tiki glass with crushed ice, fresh pineapple wedge, orchid flower garnish, paper umbrella, {lighting}, {composition}, {background}, condensation droplets on glass, tropical vibes, 8k",
    negativePrompt:
      "watered down, dull colors, no ice, artificial, blurry, cheap looking",
    suggestedSettings: {
      midjourney: { ar: "4:5", stylize: "700", quality: "2" },
      sdxl: { cfg: "7.5", steps: "30", sampler: "DPM++ 2M Karras" },
      dalle: { quality: "hd", style: "vivid" },
    },
    tags: ["cocktail", "tropical", "drinks", "bar"],
  },
  {
    id: "sushi_platter",
    name: "Premium Sushi Platter",
    category: "sushi",
    goals: ["menu_hero", "promo_banner"],
    description: "Assorted premium sushi and sashimi",
    basePrompt:
      "professional food photography of premium sushi platter, assorted nigiri with fresh salmon, tuna, yellowtail, and uni, perfect rice texture, wasabi and pickled ginger, {lighting}, {composition}, {background}, served on elegant black slate, chopsticks nearby, Japanese minimalist presentation, 8k",
    negativePrompt:
      "dry fish, brown fish, messy rice, cheap looking, artificial, blurry",
    suggestedSettings: {
      midjourney: { ar: "16:9", stylize: "650", quality: "2" },
      sdxl: { cfg: "7", steps: "30", sampler: "DPM++ 2M Karras" },
      dalle: { quality: "hd", style: "natural" },
    },
    tags: ["sushi", "japanese", "seafood", "premium"],
  },
  {
    id: "croissant_fresh",
    name: "Fresh Butter Croissant",
    category: "bakery",
    goals: ["social_feed", "delivery_listing"],
    description: "Flaky golden croissant fresh from oven",
    basePrompt:
      "professional food photography of fresh butter croissant, golden brown flaky layers visible, light dusting of flour, {lighting}, {composition}, {background}, served on rustic wooden board, warm morning atmosphere, visible steam, artisan bakery quality, 8k",
    negativePrompt:
      "burnt, pale, flat, dense, artificial, blurry, store-bought looking",
    suggestedSettings: {
      midjourney: { ar: "1:1", stylize: "500", quality: "2" },
      sdxl: { cfg: "6.5", steps: "28", sampler: "DPM++ 2M Karras" },
      dalle: { quality: "hd", style: "natural" },
    },
    tags: ["croissant", "bakery", "pastry", "breakfast"],
  },
];

export function getTemplatesByCategory(
  category: PromptCategory
): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter((t) => t.category === category);
}

export function getTemplatesByGoal(goal: MarketingGoal): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter((t) => t.goals.includes(goal));
}

export function getTemplateById(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.id === id);
}
