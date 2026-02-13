export type PersonalityKey =
  | "SINGLE_PRINGLE"
  | "HOPELESS_ROMANTIC"
  | "VILLAIN_ERA"
  | "DELULU_DREAMER"
  | "HEALING_ICON"
  | "SITUATIONSHIP_SURVIVOR"
  | "CHAOTIC_CUPID"
  | "LOWKEY_LOVER";

export interface AnswerWeights {
  [key: string]: number;
}

export interface AnswerOption {
  text?: string;
  weights: AnswerWeights;
  redFlag: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  answers: Record<string, AnswerOption>;
}

export interface QuizWeights {
  questions: QuizQuestion[];
}

export interface PersonalityTemplate {
  title: string;
  coreDescription: string;
  strengths: string[];
  redFlags: string[];
  shareLines: string[];
}

export interface SubmitPayload {
  answers: string[]; // e.g. ["A", "B", "C", ...] for 10 questions
}

/** Share card: for OpenGraph, canvas/image generator, and preview UI */
export interface ShareCardData {
  /** Personality title, e.g. "Villain Era Valentine 🖤" */
  title: string;
  /** Tagline / energy line, e.g. "Detached but desirable." */
  energyLine: string;
  /** Red flag level text, e.g. "Needs Supervision" */
  redFlagLevel: string;
  /** Compatibility type title for display */
  compatibilityTitle: string;
  /** OG image URL (1200×630) — placeholder until you add image */
  ogImageUrl: string;
  /** Share card background image (optional) — placeholder */
  shareCardBgUrl: string;
  /** Personality icon/illustration (optional) — placeholder */
  personalityImageUrl: string;
  /** Max red-flag score for meter (e.g. 20) */
  redFlagMax: number;
}

export interface QuizResultResponse {
  title: string;
  description: string;
  secondaryLine?: string;
  traits: string[];
  redFlags: string[];
  redFlagLevel: string;
  redFlagScore: number;
  primary: PersonalityKey;
  secondary?: PersonalityKey;
  shareText: string;
  compatibility?: PersonalityKey;
  /** Display title for compatibility type */
  compatibilityTitle?: string;
  /** Present when API supports viral share card (OG + image generator) */
  shareCard?: ShareCardData;
}
