# Required images for shareability

Add these files under `public/images/` so the quiz can use them for the share card, OpenGraph, and optional personality visuals.

---

## 1. **og-default.png** (required for link previews)

- **Path:** `public/images/og-default.png`
- **Size:** **1200 × 630 px** (OpenGraph standard)
- **Use:** Default image when someone shares the quiz link (Twitter, Facebook, LinkedIn, iMessage, etc.).
- **Suggestion:** Quiz title + “Your Valentine’s Personality” + a simple Valentine visual (hearts, quiz vibe). Keep text large and readable in a small preview.

---

## 2. **share-card-bg.png** (optional)

- **Path:** `public/images/share-card-bg.png`
- **Size:** **1200 × 630 px** (or 800 × 800 for square stories)
- **Use:** Background of the “Share Card Preview” on the result page (the card users can screenshot for Instagram/stories).
- **Suggestion:** Same style as your brand; can include a soft gradient or pattern. If missing, the app uses a gradient placeholder.

---

## 3. **Personality images** (optional, one per type)

- **Path:** `public/images/personality/<KEY>.jpeg` (or `.jpg` — update the extension in `app/api/quiz/route.ts` if you prefer)
- **Size:** **200 × 200 px** or similar square (displayed small on the share card).
- **Use:** Optional icon/illustration for each personality on the share card.

**Files to add (optional):**

| File name | Personality |
|-----------|-------------|
| `SINGLE_PRINGLE.jpeg` | Single Pringle 🌟 |
| `HOPELESS_ROMANTIC.jpeg` | Hopeless Romantic 🌹 |
| `VILLAIN_ERA.jpeg` | Villain Era Valentine 🖤 |
| `DELULU_DREAMER.jpeg` | Delulu Dreamer ✨ |
| `HEALING_ICON.jpeg` | Healing Icon 🦋 |
| `SITUATIONSHIP_SURVIVOR.jpeg` | Situationship Survivor 💔 |
| `CHAOTIC_CUPID.jpeg` | Chaotic Cupid 🎲 |
| `LOWKEY_LOVER.jpeg` | Lowkey Lover 🕯️ |

---

## Summary

| Image | Required? | Path | Dimensions |
|-------|-----------|------|------------|
| Default OG share image | **Yes** | `public/images/og-default.png` | 1200 × 630 |
| Share card background | No | `public/images/share-card-bg.png` | 1200 × 630 or 800 × 800 |
| Personality icons | No | `public/images/personality/<KEY>.jpeg` | 200 × 200 (or square) |

After adding **og-default.png**, set your site’s OpenGraph meta to use it (e.g. in `app/layout.tsx` or your OG image route) so link previews show this image.
