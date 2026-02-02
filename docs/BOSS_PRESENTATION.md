# 📊 PromptForge - Flow Diagrams (Boss Presentation)

---

## 1. User Journey Flow

```mermaid
flowchart TD
    A[🧑 User Visits PromptForge] --> B{Has Account?}
    B -->|No| C[Sign Up]
    C --> D[7-Day Trial Starts<br/>Basic Features]
    B -->|Yes| E[Login]
    E --> F{Subscription Status?}
    D --> F
    
    F -->|Active/Trial| G[Access Dashboard]
    F -->|Expired| H[Upgrade Prompt]
    H -->|Pay| I[Stripe Checkout]
    I --> G
    H -->|Skip| J[Limited Access<br/>Prompt Preview Only]
    
    G --> K[Select Category]
    K --> L[Fill Input Form]
    L --> M{Upload Image?}
    M -->|Yes| N[Image Analysis]
    M -->|No| O[Generate Prompt]
    N --> O
    O --> P[View Generated Prompt]
    P --> Q[Copy to Midjourney/SDXL]
    Q --> R[🎨 Create Stunning Images!]
```

---

## 2. System Architecture (High-Level)

```mermaid
flowchart TB
    subgraph "👤 Users"
        Web[Web Browser]
        PWA[PWA Mobile]
    end
    
    subgraph "☁️ Vercel Cloud"
        Next[Next.js App]
        API[API Routes]
    end
    
    subgraph "🔐 Auth & Data"
        Supa[(Supabase)]
        Redis[(Redis Cache)]
    end
    
    subgraph "💳 Payments"
        Stripe[Stripe]
    end
    
    subgraph "🤖 AI Providers"
        Claude[Anthropic Claude]
        Gemini[Google Gemini]
        Vision[Vision AI]
    end
    
    subgraph "📁 Storage"
        R2[Cloudflare R2]
    end
    
    Web --> Next
    PWA --> Next
    Next --> API
    API --> Supa
    API --> Redis
    API --> Claude
    API --> Gemini
    API --> Vision
    API --> R2
    Stripe --> Supa
```

---

## 3. Subscription & Payment Flow

```mermaid
sequenceDiagram
    participant U as User
    participant App as PromptForge
    participant Stripe as Stripe
    participant DB as Supabase
    
    U->>App: Click "Upgrade to Pro"
    App->>Stripe: Create Checkout Session
    Stripe-->>App: Return checkout URL
    App->>U: Redirect to Stripe Checkout
    U->>Stripe: Enter payment details
    Stripe->>Stripe: Process payment
    Stripe-->>U: Payment success
    Stripe->>App: Webhook: payment_succeeded
    App->>DB: Update user subscription
    App-->>U: Redirect to Dashboard
    Note over U,DB: User now has Pro access!
```

---

## 4. Prompt Generation Flow (Core Logic)

```mermaid
flowchart TD
    A[User Submits Form] --> B[API Receives Request]
    B --> C{User Authenticated?}
    C -->|No| D[401 Error]
    C -->|Yes| E{Quota Available?}
    E -->|No| F[429 Limit Reached]
    E -->|Yes| G{Subscription Tier?}
    
    G -->|Trial/Basic| H[Use Standard AI]
    G -->|Pro/Ultra| I[Use Premium AI + Priority]
    
    H --> J[Load Category SystemPrompt]
    I --> J
    J --> K[Send to Claude/Gemini]
    K --> L[Receive JSON Spec]
    L --> M[Validate with Zod]
    M --> N{Valid?}
    N -->|No| O[Retry or Fallback]
    N -->|Yes| P[Construct Natural Language Prompt]
    P --> Q[Add Midjourney Modifiers]
    Q --> R[Return to User]
    R --> S[Decrement Quota]
```

---

## 5. Image Upload & Analysis Flow

```mermaid
sequenceDiagram
    participant U as User
    participant App as Frontend
    participant API as Backend
    participant R2 as Cloudflare R2
    participant Vision as Vision AI
    participant LLM as Claude/Gemini
    
    U->>App: Upload product image
    App->>R2: Store image (secure URL)
    R2-->>App: Return image URL
    App->>API: Send URL + form data
    API->>Vision: Analyze image
    Vision-->>API: "Red handbag, leather, gold buckle"
    API->>LLM: Generate prompt with context
    Note over API,LLM: SystemPrompt includes product description
    LLM-->>API: Enhanced PromptSpec
    API-->>App: Return prompt
    App-->>U: Display prompt with product reference
    Note over U: Prompt references user's exact product!
```

---

## 6. Trial → Paid Conversion Flow

```mermaid
flowchart LR
    A[New User] --> B[Sign Up]
    B --> C[7-Day Trial<br/>Basic Features]
    C --> D{Day 5}
    D --> E[📧 Email Reminder]
    C --> F{Day 7}
    F --> G[Trial Expires]
    G --> H{User Action?}
    H -->|Subscribe| I[💳 Payment]
    I --> J[Paid User ✅]
    H -->|No Action| K[Limited Mode]
    K --> L[Prompt Preview Only]
    L --> M[Upgrade Prompts]
    M --> I
```

---

## 7. Category Selection Architecture

```mermaid
flowchart TD
    A[User Selects Category] --> B{Category Engine}
    B --> C[Load SystemPrompt<br/>eg: Senior Fashion Stylist]
    B --> D[Load UI Presets<br/>Mood, Props, Backgrounds]
    B --> E[Load Validators<br/>Zod Schema]
    C --> F[Inject into LLM Request]
    D --> G[Render Form Options]
    E --> H[Validate LLM Response]
```

---

## Summary for Boss

| Aspect | Description |
|--------|-------------|
| **Product** | AI-powered prompt generator for marketing images |
| **Target** | SMEs, agencies, content creators |
| **Revenue** | Subscription SaaS (RM29-199/month) |
| **Tech** | Next.js, Supabase, Stripe, Claude AI |
| **Differentiator** | Image upload + product-specific prompts |
| **Scalability** | Serverless, multi-category expansion |

