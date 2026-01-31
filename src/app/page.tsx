import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const examplePrompts = [
  {
    title: "Gourmet Burger Hero",
    model: "Midjourney",
    prompt:
      "professional food photography of a gourmet wagyu burger, juicy beef patty with melted cheddar dripping, fresh lettuce, caramelized onions, sesame seed brioche bun, bright natural daylight, soft diffused window light, shot at 45-degree angle, classic food photography perspective, clean white seamless studio background, steam rising, appetizing presentation, sharp focus, 8k resolution --ar 1:1 --stylize 750 --quality 2 --v 6",
  },
  {
    title: "Ramen Bowl",
    model: "SDXL",
    prompt:
      "masterpiece, best quality, ultra detailed, sharp focus, professional food photography, authentic ramen bowl, rich tonkotsu broth, perfectly cooked noodles, soft-boiled ajitama egg with runny yolk, tender chashu pork slices, fresh green onions, nori sheet, visible steam rising, warm ambient tungsten light, shot at eye level, rustic wooden table surface, cozy atmosphere, mouthwatering appearance",
  },
  {
    title: "Tropical Cocktail",
    model: "DALL-E",
    prompt:
      "A professional beverage photograph of a tropical cocktail with vibrant orange and pink gradient colors. The drink is served in a tiki glass filled with crushed ice, garnished with a fresh pineapple wedge, an orchid flower, and a small paper umbrella. Dramatic side lighting creates condensation droplets on the glass. Shot on a marble surface with tropical vibes. Premium editorial style, magazine quality photography.",
  },
];

export default function HomePage() {
  return (
    <div className="container py-8 md:py-12">
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          F&B Marketing Image Prompt Generator
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-2">
          Turn briefs into visuals. Create professional prompts for Midjourney,
          SDXL, and DALL-E optimized for menus, social media, and marketing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/generate">Start Generating</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/library">Browse Templates</Link>
          </Button>
        </div>
      </section>

      <section className="mb-12 md:mb-16">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 md:mb-8">
          Example Outputs
        </h2>
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examplePrompts.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                  <Badge variant="secondary">{example.model}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md p-3 text-xs font-mono max-h-40 overflow-y-auto">
                  {example.prompt}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12 md:mb-16">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 md:mb-8">Features</h2>
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Multiple Models",
              description: "Optimized prompts for Midjourney, SDXL, and DALL-E",
            },
            {
              title: "3 Variants",
              description:
                "Safe commercial, premium editorial, and punchy social styles",
            },
            {
              title: "Marketing Goals",
              description:
                "Menu hero, promo banner, social feed, story, delivery apps",
            },
            {
              title: "Quick Fixes",
              description:
                "Adjust lighting, props, premium feel, shot distance instantly",
            },
          ].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center px-4 sm:px-0">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6 text-sm md:text-base">
          No API key required - works out of the box with our smart template
          engine.
        </p>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/generate">Generate Your First Prompt</Link>
        </Button>
      </section>
    </div>
  );
}
