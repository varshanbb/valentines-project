# 💘 Valentine's Personality Quiz

A BuzzFeed-style quiz: **"Your Valentine's Personality Will Reveal Why You're Still Single (Respectfully)"** — with a Happy Valentine's Day wish and shareable results.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **API route** at `/api/quiz` for scoring (no separate Express server; logic is in Next.js)
- Mobile-first, responsive UI

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Flow

1. **Landing** — Title, subtitle, Happy Valentine's Day line, "Start the quiz".
2. **Quiz** — 10 questions, one at a time; progress bar; Back / Next; submit on last question.
3. **Result** — Personality title, description, secondary line (from matrix), strengths, red-flag badge, share (copy + native Share when available), retake.

## Data (in `/data`)

- `quiz-weights.json` — Questions, answer keys, personality weights, red-flag scores.
- `personalities.json` — Title, description, strengths, red flags, share lines per type.
- `secondary-matrix.json` — Primary + secondary personality blurbs.
- `red-flag-comments.json` — Comment by red-flag score range.
- `compatibility-map.json` — Suggested match type per personality.

## Share & images

- **Result page** includes a viral layout: Hero Reveal (confetti), Red Flag Meter, Strengths/Red Flags, Compatibility card, Share Card Preview, and CTAs (Share to Instagram, Copy Link, Retake Quiz).
- **Share card data** is returned in the API (`shareCard`) for OpenGraph and image generation (see `lib/types.ts` → `ShareCardData`).
- **Required images:** see **`public/images/IMAGES_REQUIRED.md`** for the list. You need at least **`public/images/og-default.png`** (1200×630) for link previews; optional: share card background and personality icons.
- For production OG/twitter image URLs, set **`NEXT_PUBLIC_BASE_URL`** to your site URL (e.g. `https://your-quiz.vercel.app`).
