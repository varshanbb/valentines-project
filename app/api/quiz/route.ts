import { NextRequest, NextResponse } from "next/server";
import type { PersonalityKey } from "@/lib/types";
import { getRedFlagComment, getPrimaryAndSecondary } from "@/lib/score";

import quizWeightsData from "@/data/quiz-weights.json";
import personalitiesData from "@/data/personalities.json";
import secondaryMatrixData from "@/data/secondary-matrix.json";
import redFlagCommentsData from "@/data/red-flag-comments.json";
import compatibilityMapData from "@/data/compatibility-map.json";

interface QuizQuestionPayload {
  id: number;
  answers: Record<string, { weights?: Record<string, number>; redFlag: number }>;
}
const quizWeights = quizWeightsData as unknown as { questions: QuizQuestionPayload[] };
const personalities = personalitiesData as Record<string, { title: string; coreDescription: string; strengths: string[]; redFlags: string[]; shareLines: string[] }>;
const secondaryMatrix = secondaryMatrixData as Record<string, Record<string, string>>;
const redFlagComments = redFlagCommentsData as Record<string, string>;
const compatibilityMap = compatibilityMapData as Record<string, string>;

const TOTAL_QUESTIONS = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const answers: string[] = Array.isArray(body.answers) ? body.answers : [];

    if (answers.length !== TOTAL_QUESTIONS) {
      return NextResponse.json(
        { error: `Expected ${TOTAL_QUESTIONS} answers, got ${answers.length}` },
        { status: 400 }
      );
    }

    const personalityScores: Record<string, number> = {};
    let redFlagScore = 0;

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const q = quizWeights.questions[i];
      const choice = answers[i]?.toUpperCase?.() || "A";
      const option = q?.answers[choice];
      if (!option) continue;

      redFlagScore += option.redFlag ?? 0;
      const weights = (option.weights ?? {}) as Record<string, number>;
      for (const [key, value] of Object.entries(weights)) {
        personalityScores[key] = (personalityScores[key] ?? 0) + value;
      }
    }

    const { primary, secondary } = getPrimaryAndSecondary(personalityScores as Record<PersonalityKey, number>);
    const template = personalities[primary];
    const redFlagLevel = getRedFlagComment(redFlagScore, redFlagComments);

    let secondaryLine: string | undefined;
    if (secondary && secondaryMatrix[primary]?.[secondary]) {
      secondaryLine = secondaryMatrix[primary][secondary];
    }

    const shareLine = template.shareLines[Math.floor(Math.random() * template.shareLines.length)];
    const compatibility = compatibilityMap[primary];
    const compatibilityTitle = compatibility ? (personalities[compatibility]?.title ?? compatibility) : "";

    const result = {
      title: template.title,
      description: template.coreDescription,
      secondaryLine,
      traits: template.strengths,
      redFlags: template.redFlags ?? [],
      redFlagLevel,
      redFlagScore,
      primary,
      secondary,
      shareText: `I got "${template.title}" — ${shareLine} Happy Valentine's Day! 💘 Take the quiz:`,
      compatibility,
      compatibilityTitle,
      shareCard: {
        title: template.title,
        energyLine: shareLine,
        redFlagLevel,
        compatibilityTitle,
        ogImageUrl: "/images/og-default.png",
        shareCardBgUrl: "/images/share-card-bg.png",
        // Personality image uses .jpeg extension by default; place files like
        // public/images/personality/VILLAIN_ERA.jpeg etc.
        personalityImageUrl: `/images/personality/${primary}.jpeg`,
        redFlagMax: 20,
      },
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}
