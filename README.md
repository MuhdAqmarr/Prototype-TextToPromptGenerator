# PromptForge

**Turn briefs into visuals.** Generate AI image prompts for Midjourney, SDXL, and DALL-E optimized for F&B marketing.

## Features

- **Multiple AI Models**: Generate optimized prompts for Midjourney, SDXL, and DALL-E
- **3 Prompt Variants**: Safe commercial, premium editorial, and punchy social styles
- **Marketing Goals**: Menu hero, promo banner, social feed, story, delivery app listings
- **Quick Fixes**: Instantly adjust lighting, props, premium feel, shot distance
- **Prompt Library**: Curated templates by food category (burger, ramen, desserts, etc.)
- **Save & Manage**: Save generated prompts locally for future reference
- **Two Modes**:
  - **MOCK Mode** (default): Deterministic, template-based, no API key required
  - **LLM Mode** (optional): Uses Anthropic API for enhanced prompt generation

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS 4 + shadcn/ui
- React Hook Form + Zod validation
- Zustand for state management
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | No | Anthropic API key for LLM mode. Leave empty for MOCK mode. |
| `NODE_ENV` | No | Environment (`development`, `production`, `test`) |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/generate/       # API route for prompt generation
│   ├── generate/           # Prompt generator page
│   ├── library/            # Curated templates page
│   └── saved/              # Saved prompts page
├── components/             # React components
│   ├── generator/          # Generator form and results
│   ├── library/            # Library grid
│   ├── saved/              # Saved list
│   ├── shared/             # Navbar, Footer
│   └── ui/                 # shadcn/ui components
├── lib/                    # Core utilities
│   ├── env.ts              # Environment validation
│   ├── hash.ts             # Input hashing for caching
│   ├── presets.ts          # Brand vibes, lighting presets
│   ├── promptEngine.ts     # Prompt generation orchestrator
│   ├── promptLibrary.ts    # Curated template data
│   ├── promptSpec.ts       # Zod schemas and types
│   └── utils.ts            # Utility functions
├── renderers/              # Model-specific prompt renderers
│   ├── dalle.ts            # DALL-E renderer
│   ├── midjourney.ts       # Midjourney renderer
│   └── sdxl.ts             # SDXL renderer
├── server/                 # Server-side utilities
│   ├── llm/                # LLM provider interface
│   ├── rateLimit/          # Rate limiting
│   └── storage/            # Storage provider interface
└── store/                  # Zustand stores
    └── savedPrompts.ts     # Saved prompts with localStorage
```

## Adding a New Renderer

1. Create a new file in `src/renderers/`:

```typescript
// src/renderers/newmodel.ts
import type { PromptSpec } from "@/lib/promptSpec";

export function renderNewModel(basePrompt: string, spec: PromptSpec): string {
  // Format prompt for your model
  return formattedPrompt;
}
```

2. Export from `src/renderers/index.ts`
3. Add to `TargetModel` enum in `src/lib/promptSpec.ts`
4. Update `src/lib/promptEngine.ts` to use the new renderer

## Adding a New Library Template

Edit `src/lib/promptLibrary.ts` and add to the `PROMPT_TEMPLATES` array:

```typescript
{
  id: "unique_id",
  name: "Display Name",
  category: "burger", // or other PromptCategory
  goals: ["menu_hero", "social_feed"],
  description: "Template description",
  basePrompt: "Your template prompt with {placeholders}",
  negativePrompt: "Things to avoid",
  suggestedSettings: {
    midjourney: { ar: "1:1", stylize: "750" },
    sdxl: { cfg: "7", steps: "30" },
    dalle: { quality: "hd", style: "natural" },
  },
  tags: ["tag1", "tag2"],
}
```

## Roadmap (Scaling to Business)

### Phase 1: Core Features
- [ ] User authentication (NextAuth.js / Clerk)
- [ ] Database persistence (PostgreSQL + Prisma)
- [ ] Team workspaces

### Phase 2: Monetization
- [ ] Usage-based billing (Stripe)
- [ ] Subscription tiers
- [ ] API access for enterprise

### Phase 3: Advanced Features
- [ ] Image generation integration (Replicate, fal.ai)
- [ ] A/B testing for prompt variants
- [ ] Analytics dashboard
- [ ] Custom brand presets per account

### Phase 4: Scale
- [ ] Redis caching (Upstash)
- [ ] Edge deployment
- [ ] Multi-region support

## License

MIT
