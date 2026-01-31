import { NextResponse } from "next/server";
import { GeneratorInputSchema, type GeneratorOutput } from "@/lib/promptSpec";
import { generatePrompts } from "@/lib/promptEngine";
import { hashInput } from "@/lib/hash";
import { getRateLimiter } from "@/server/rateLimit/memoryTokenBucket";
import { createAnthropicProvider } from "@/server/llm/anthropic";
import { createGeminiProvider } from "@/server/llm/gemini";
import { renderMidjourney } from "@/renderers/midjourney";
import { renderSDXL } from "@/renderers/sdxl";
import { renderDalle } from "@/renderers/dalle";

const cache = new Map<string, GeneratorOutput>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "anonymous";
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimiter = getRateLimiter();
    const rateResult = rateLimiter.consume(clientIp);

    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetAt: rateResult.resetAt,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": String(rateResult.remaining),
            "X-RateLimit-Reset": String(rateResult.resetAt),
          },
        }
      );
    }

    const body = await request.json();
    const parsed = GeneratorInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const cacheKey = hashInput(input);

    if (cache.has(cacheKey)) {
      return NextResponse.json(cache.get(cacheKey), {
        headers: {
          "X-Cache": "HIT",
          "X-RateLimit-Remaining": String(rateResult.remaining),
        },
      });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const isLLMMode = !!geminiKey || !!anthropicKey;
    const llmProvider = geminiKey ? "gemini" : anthropicKey ? "anthropic" : null;

    let output: GeneratorOutput;

    if (isLLMMode && llmProvider) {
      const provider = llmProvider === "gemini"
        ? createGeminiProvider(geminiKey!)
        : createAnthropicProvider(anthropicKey!);
      const spec = await provider.generateSpec(input);

      const renderer =
        input.targetModel === "sdxl"
          ? renderSDXL
          : input.targetModel === "dalle"
            ? renderDalle
            : renderMidjourney;

      const variantModifiers = {
        safe_commercial: "clean commercial look, professional advertising quality",
        premium_editorial: "editorial food photography, magazine quality",
        punchy_social: "scroll-stopping, vibrant and bold, instagram-worthy",
      };

      const basePrompt = [
        spec.subject,
        spec.ingredients.join(", "),
        spec.plating,
        spec.lighting,
        spec.camera,
        spec.background,
        spec.mood,
        spec.style,
      ]
        .filter(Boolean)
        .join(", ");

      output = {
        spec,
        outputs: {
          variantA: {
            prompt: renderer(
              `${basePrompt}, ${variantModifiers.safe_commercial}`,
              spec
            ),
            type: "safe_commercial",
          },
          variantB: {
            prompt: renderer(
              `${basePrompt}, ${variantModifiers.premium_editorial}`,
              spec
            ),
            type: "premium_editorial",
          },
          variantC: {
            prompt: renderer(
              `${basePrompt}, ${variantModifiers.punchy_social}`,
              spec
            ),
            type: "punchy_social",
          },
          negative: spec.negative.join(", "),
          settings: getModelSettings(input.targetModel, input.aspectRatio),
        },
      };
    } else {
      output = generatePrompts(input);
    }

    cache.set(cacheKey, output);

    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    return NextResponse.json(output, {
      headers: {
        "X-Cache": "MISS",
        "X-Mode": llmProvider || "mock",
        "X-RateLimit-Remaining": String(rateResult.remaining),
      },
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getModelSettings(
  model: string,
  aspectRatio: string
): Record<string, string> {
  const settings: Record<string, Record<string, string>> = {
    midjourney: {
      "Aspect Ratio": `--ar ${aspectRatio}`,
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
        aspectRatio === "1:1"
          ? "1024x1024"
          : aspectRatio === "4:5"
            ? "896x1120"
            : aspectRatio === "9:16"
              ? "768x1344"
              : "1344x768",
      Note: "Use food photography LoRA if available",
    },
    dalle: {
      Quality: "HD",
      Style: "Natural",
      Size:
        aspectRatio === "1:1"
          ? "1024x1024"
          : aspectRatio === "16:9"
            ? "1792x1024"
            : "1024x1792",
      Note: "DALL-E 3 generates natural-looking food well",
    },
  };

  return settings[model] || settings.midjourney;
}
