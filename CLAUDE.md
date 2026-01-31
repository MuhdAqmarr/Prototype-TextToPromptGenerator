# CLAUDE.md - PromptForge Development Guide

This file provides guidance for AI assistants working on this codebase.

## Project Overview

PromptForge is an F&B marketing image prompt generator that converts dish inputs into AI image generation prompts for Midjourney, SDXL, and DALL-E.

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/generate/       # POST /api/generate endpoint
│   ├── generate/           # Generator page (client component)
│   ├── library/            # Template library page
│   └── saved/              # Saved prompts page
├── components/             # React components
│   ├── generator/          # Form, ResultsPanel, QuickFixChips, PromptCard
│   ├── library/            # LibraryGrid
│   ├── saved/              # SavedList
│   ├── shared/             # Navbar, Footer
│   └── ui/                 # shadcn/ui primitives
├── lib/                    # Core business logic
│   ├── promptSpec.ts       # Zod schemas, types, enums
│   ├── promptEngine.ts     # Prompt generation logic
│   ├── presets.ts          # Brand vibes, lighting, composition rules
│   └── promptLibrary.ts    # Curated templates
├── renderers/              # Model-specific formatters
│   ├── midjourney.ts       # Adds --ar, --stylize, --v
│   ├── sdxl.ts             # Adds quality tags
│   └── dalle.ts            # Natural language format
├── server/                 # Server utilities
│   ├── llm/                # LLM provider interface (mock, anthropic)
│   ├── rateLimit/          # In-memory token bucket
│   └── storage/            # Storage provider interface
└── store/                  # Client state
    └── savedPrompts.ts     # Zustand + localStorage
```

### Data Flow

1. User fills `GeneratorForm` → `GeneratorInput`
2. POST to `/api/generate` with input
3. API validates with Zod, checks rate limit
4. If cached, return cached result
5. Build `PromptSpec` using `buildPromptSpec()`
6. Render 3 variants using model-specific renderer
7. Return `GeneratorOutput` with variants, negative, settings

### Key Types

```typescript
// Input from form
GeneratorInput {
  dishName, keyIngredients, cuisineStyle, dietaryFlags,
  marketingGoal, brandVibe, mood, shotType, background,
  props, aspectRatio, targetModel, strictIngredients,
  leaveNegativeSpace, quickFixes
}

// Structured prompt specification
PromptSpec {
  subject, ingredients, plating, composition, lighting,
  camera, background, props, mood, style, constraints,
  negative, modelHints
}

// API response
GeneratorOutput {
  spec: PromptSpec,
  outputs: {
    variantA, variantB, variantC,  // Each has prompt + type
    negative: string,
    settings: Record<string, string>
  }
}
```

## Development Workflow

### Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm test         # Run vitest in watch mode
pnpm test:run     # Run tests once
pnpm lint         # Check ESLint
pnpm typecheck    # Check TypeScript
pnpm format       # Format with Prettier
pnpm build        # Production build
```

### Testing

Tests are in `/tests/`:
- `renderers.test.ts` - Tests each renderer outputs correct format
- `promptEngine.test.ts` - Tests spec building and prompt generation

Run with: `pnpm test:run`

## Conventions

### TypeScript

- **Strict mode enabled** - No `any` types
- **Zod for validation** - All inputs validated at boundaries
- **Type inference** - Use `z.infer<typeof Schema>` for types

### Code Style

- **Keep functions small** - Single responsibility
- **Pure functions in renderers** - No side effects
- **Validate inputs** - Always at API boundaries
- **Prefer const** - Immutable where possible

### Components

- **Server Components by default** - Use `"use client"` only when needed
- **shadcn/ui for primitives** - Don't reinvent buttons, inputs
- **Tailwind for styling** - Use `cn()` utility for conditional classes

### API Routes

- **Zod validation first** - Return 400 for invalid input
- **Rate limiting** - Use token bucket, return 429 when exceeded
- **Caching** - Hash inputs, cache responses in memory
- **Error handling** - Always return JSON, never throw raw errors

## Common Tasks

### Add a new marketing goal

1. Add to `MarketingGoal` enum in `promptSpec.ts`
2. Add label to `MARKETING_GOAL_LABELS`
3. Add composition rule to `COMPOSITION_RULES` in `presets.ts`

### Add a new mood

1. Add to `Mood` enum in `promptSpec.ts`
2. Add label to `MOOD_LABELS`
3. Add lighting presets to `LIGHTING_PRESETS` in `presets.ts`

### Add a new prop

1. Add to `Prop` enum in `promptSpec.ts`
2. Add label to `PROP_LABELS`

### Add a new renderer

1. Create file in `src/renderers/`
2. Export function: `render<Model>(basePrompt, spec) => string`
3. Add to `TargetModel` enum
4. Update `promptEngine.ts` to use new renderer

## Environment

- **MOCK mode (default)**: No API key needed, uses templates
- **LLM mode**: Set `ANTHROPIC_API_KEY` for Claude-enhanced specs

## Scaling Notes

Current implementation uses:
- In-memory rate limiter (swap to Upstash Redis later)
- In-memory cache (swap to Redis later)
- localStorage for saved prompts (swap to DB later)
- Mock LLM provider (Anthropic provider ready)

All are abstracted behind interfaces for easy replacement.
