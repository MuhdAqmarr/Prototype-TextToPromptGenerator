# 🧠 PromptForge System Overview

Ini adalah breakdown teknikal & flow macam mana sistem ni (PromptForge) berfungsi untuk generate prompt level "Senior Photographer".

## 1. The Core Concept (Flow)
Idea dia simple: **User bagi input simple → AI "masak" → Keluar Prompt Level Dewa.**

1.  **Input**: User pilih Dish (Nasi Lemak), Mood (Fresh), & Model (Midjourney).
2.  **Processing (The Magic)**: Backend hantar data ni ke AI (Claude/Gemini).
3.  **Persona Injection**: AI bukan sekadar translate. Dia diarahkan untuk berlakon jadi *"Senior Food Photographer with 20 years exp"*.
4.  **Formatting**: Output AI (JSON) di-convert jadi ayat "Narrative Description" yang natural untuk Midjourney v6.
5.  **Output**: User dapat prompt yang dah siap dengan lighting, camera rules, dan composition.

---

## 2. Tech Stack (Tools)
Kita guna modern web stack yang laju & scalable.

*   **Frontend**: Next.js 15 (App Router) + React
*   **Styling**: TailwindCSS + Shadcn/ui (Clean aesthetic)
*   **Backend Logic**: Next.js API Routes (Serverless)
*   **Validation**: Zod (Pastikan AI tak bagi data merepek)
*   **AI Providers**:
    *   **Anthropic (Claude 3.5 Sonnet)**: Primary brain (Creative & Natural).
    *   **Google Gemini 2.0 Flash**: Secondary/Backup brain (Fast & Cheap).

---

## 3. What Happens "Behind the Scenes"

### A. The "Persona" Engine (`anthropic.ts`)
Kita tak hantar raw data je. Kita balut data user dengan **System Prompt** yang tebal.
*   *"You are a Creative Director..."*
*   *"Don't just list items. Embellish creatively..."*
*   *"Add sensory details like steam, dewdrops, glazing..."*

Ini yang buatkan output dia ada ayat macam *"glistening grains of rice"* dan bukan just *"rice"*.

### B. The Structure (`promptSpec.ts` & Zod)
AI kadang-kadang boleh "hallucinate" (merepek).
Kita paksa AI reply dalam format **JSON** yang ketat pakai **Zod Schema**.
Kalau AI salah format, sistem akan auto-reject atau retry. Ini pastikan app tak crash.

```json
{
  "subject": "Nasi Lemak",
  "lighting": "Soft diffused key light",
  "camera": "45-degree overhead",
  "mood": "Fresh morning vibe"
}
```

### C. The Narrative Assembly (`route.ts`)
Lepas dapat JSON, code kita tak main sambung pakai koma je (itu cara lama).
Kita construct ayat penuh:
> *"[Subject] featuring [Ingredients]. Presented in [Plating]. [Lighting]..."*

Ini optimized untuk **Midjourney v6** yang faham bahasa manusia (Natural Language Processing).

---

## 4. Kenapa Output Dia "Mahal"?
Sebab kita gabungkan **Logic Coding** + **Prompt Engineering**.
*   **User** bagi "Nasi Lemak".
*   **System** tambah "Handwritten label", "Morning sun", "Rule of thirds".


---

## 5. Deep Dive: Macam Mana Data Bergerak?

### A. Scenario 1: Live AI Mode (Internet Ada + API Key Ada)
Ini flow bila sistem betul-betul "berfikir":
1.  **Backend Terima Data**: `dishName: "Burger"`.
2.  **Inject Persona**: Backend tambah arahan rahsia: *"Act as Pro Photographer. Describe this Burger with juicy details."*
3.  **API Call**: Data dihantar keluar ke server **Anthropic (USA)** atau **Google**.
4.  **Generative Process**: AI dekat sana proses request tu, dia "bayangkan" burger tu, pilih lighting paling sesuai, & tulis description.
5.  **Return Data**: AI hantar balik JSON. App kita validate (check error), lepas tu tunjuk kat user.

### B. Scenario 2: Mock Mode (Template / Fallback)
Ini flow bila API Key takde atau error (Jimat cost / Offline):
1.  **Local Logic**: Semua berlaku dalam file `promptEngine.ts` di laptop user.
2.  **Template Filling**: Sistem guna template sedia ada.
    *   *"Okay user nak Burger. Mood dia 'Fresh'."*
    *   Sistem ambil list *lighting* yang kita hardcode: `["Soft Light", "Morning Sun", "Studio"]`.
    *   Dia pilih satu secara **Random** atau ikut rules simple.
3.  **Gabung**: `[Dish] + [Random Lighting] + [Random Camera]`.
4.  **Result**: Laju tapi "skema". Tak ada ayat bunga-bunga macam "handwritten note" sebab tak ada AI yang fikir.
