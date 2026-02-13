import type { PersonalityKey } from "./types";

const PERSONALITY_KEYS: PersonalityKey[] = [
  "SINGLE_PRINGLE",
  "HOPELESS_ROMANTIC",
  "VILLAIN_ERA",
  "DELULU_DREAMER",
  "HEALING_ICON",
  "SITUATIONSHIP_SURVIVOR",
  "CHAOTIC_CUPID",
  "LOWKEY_LOVER",
];

export function getRedFlagComment(score: number, comments: Record<string, string>): string {
  if (score <= 5) return comments["0-5"] ?? "You're dramatic but safe.";
  if (score <= 10) return comments["6-10"] ?? "Mildly concerning. We're watching you.";
  if (score <= 15) return comments["11-15"] ?? "Needs supervision.";
  return comments["16+"] ?? "National Emergency.";
}

export function getPrimaryAndSecondary(
  scores: Record<string, number>
): { primary: PersonalityKey; secondary?: PersonalityKey } {
  const sorted = [...PERSONALITY_KEYS]
    .filter((k) => (scores[k] ?? 0) > 0)
    .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const primary = (sorted[0] as PersonalityKey) ?? "SINGLE_PRINGLE";
  const secondary = sorted[1] as PersonalityKey | undefined;
  return { primary, secondary };
}
