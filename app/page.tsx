"use client";

import { useState, useCallback } from "react";
import type { QuizResultResponse } from "@/lib/types";

import quizWeightsData from "@/data/quiz-weights.json";

type QuizQuestionDisplay = {
  id: number;
  text: string;
  answers: Record<string, { text?: string; weights: Record<string, number>; redFlag: number }>;
};
const quizWeights = quizWeightsData as unknown as { questions: QuizQuestionDisplay[] };

const TOTAL = 10;

const ANSWER_LABELS: Record<number, Record<string, string>> = {
  2: { B: "Overthinking everything", C: "Acting nonchalant but stalking", D: "Romanticizing bare minimum", E: "Leaving first so you don't get left" },
  3: { A: "Candlelit dinner", B: "Arcade + chaos", C: "Staying home but deeply vibing", D: "Surprise picnic under fairy lights", E: "Dates are cringe" },
  4: { A: "Emotionally available", B: "Situationship veteran", C: "In my healing era", D: "Manifesting someone", E: "Emotionally retired" },
  5: { A: "Taylor Swift love ballad", B: "SZA heartbreak anthem", C: "The Weeknd villain energy", D: "Lana Del Rey cinematic romance", E: "Doja Cat chaotic energy" },
  6: { A: "Being alone", B: "Catching feelings", C: "Being vulnerable", D: "Being misunderstood", E: "Being too invested" },
  7: { A: "Words of affirmation", B: "Physical touch", C: "Quality time", D: "Acts of service", E: "Sending memes" },
  8: { A: "You deserve better.", B: "You fall too fast.", C: "You pretend you don't care.", D: "You're delusional but we support you.", E: "Please seek therapy." },
  9: { A: "Respond immediately", B: "Wait 2 hours strategically", C: "Screenshot and analyze", D: "Reply who is this?", E: "Type a paragraph then delete" },
  10: { A: "Soft pink + roses", B: "Dark red + wine", C: "Cozy sweater + fairy lights", D: "Main character city lights", E: "Black outfit + confidence" },
};

function getAnswerLabel(qIndex: number, key: string, option: { text?: string }): string {
  const override = ANSWER_LABELS[qIndex + 1]?.[key];
  if (override) return override;
  return option.text || `Option ${key}`;
}

type Step = "landing" | "quiz" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(TOTAL).fill(""));
  const [result, setResult] = useState<QuizResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const question = quizWeights.questions[index];
  const progress = step === "quiz" ? ((index + 1) / TOTAL) * 100 : 0;
  const selected = answers[index];

  const setAnswer = useCallback((key: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = key;
      return next;
    });
  }, [index]);

  const canNext = selected !== "";
  const canSubmit = step === "quiz" && answers.every((a) => a !== "");

  const goNext = useCallback(() => {
    if (index < TOTAL - 1) setIndex((i) => i + 1);
    else {
      setLoading(true);
      fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
        .then((r) => r.json())
        .then((data) => {
          setResult(data);
          setStep("result");
        })
        .catch(() => setResult(null))
        .finally(() => setLoading(false));
    }
  }, [index, answers]);

  const goBack = useCallback(() => {
    if (index > 0) setIndex((i) => i - 1);
  }, [index]);

  const copyShare = useCallback(() => {
    if (!result) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${result.shareText} ${url}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const shareNative = useCallback(() => {
    if (!result || !navigator.share) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.share({
      title: result.title,
      text: result.shareText,
      url,
    }).catch(() => {});
  }, [result]);

  if (step === "landing") {
    return (
      <main className="quiz-container">
        <div className="landing-header animate-in">
          <h1>Your Valentine&apos;s Personality Will Reveal Why You&apos;re Still Single (Respectfully)</h1>
          <p className="sub">10 questions. Chaos. Self-awareness. No judgment.</p>
        </div>
        <p className="valentine-wish">
          Happy Valentine&apos;s Day — <span>we hope you get the ick or the one.</span>
        </p>
        <div className="landing-cta">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setStep("quiz");
              setIndex(0);
              setAnswers(Array(TOTAL).fill(""));
            }}
          >
            Start the quiz 💘
          </button>
        </div>
      </main>
    );
  }

  if (step === "result" && result) {
    const sc = result.shareCard;
    const redFlagMax = sc?.redFlagMax ?? 20;
    const redFlagPct = Math.min(100, (result.redFlagScore / redFlagMax) * 100);
    const meterColor =
      result.redFlagScore <= 5
        ? "var(--success)"
        : result.redFlagScore <= 10
          ? "#e6c229"
          : result.redFlagScore <= 15
            ? "#e8952e"
            : "var(--accent)";

    const sendToSomeone = () => {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const msg = `We're most compatible 💘 Me: ${result.title}. You: ${result.compatibilityTitle ?? "?"}. Happy Valentine's Day! Take the quiz: ${url}`;
      navigator.clipboard.writeText(msg).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    const copyLinkOnly = () => {
      const url = typeof window !== "undefined" ? window.location.href : "";
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <main className="quiz-container result-page">
        <p className="valentine-wish">
          Happy Valentine&apos;s Day — <span>here&apos;s why you&apos;re still single (respectfully).</span>
        </p>

        {/* 1. Hero Reveal */}
        <section className="hero-reveal animate-in">
          <div className="confetti-wrap" aria-hidden>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="confetti-dot" />
            ))}
          </div>
          <div className="hero-label">💘 Your Valentine Profile</div>
          <h1 className="hero-title">{result.title}</h1>
          <p className="hero-tagline">&ldquo;{sc?.energyLine ?? result.secondaryLine ?? result.title}&rdquo;</p>
        </section>

        {/* 2. Red Flag Meter */}
        <section className="red-flag-meter-wrap animate-in">
          <div className="red-flag-meter-label">
            <span>Red flag level</span>
            <span>{result.redFlagLevel}</span>
          </div>
          <div className="red-flag-meter-bar">
            <div
              className="red-flag-meter-fill"
              style={{
                width: `${redFlagPct}%`,
                background: meterColor,
              }}
            />
          </div>
        </section>

        {/* 3. Strengths & Red Flags */}
        <section className="strengths-red-section animate-in">
          <div className="strengths-card">
            <h3>✨ Your Strengths</h3>
            <ul>
              {(result.traits ?? []).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="red-flags-card">
            <h3>🚩 Your Red Flags</h3>
            <ul>
              {(result.redFlags ?? []).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Compatibility */}
        {result.compatibilityTitle && (
          <section className="compat-card animate-in">
            <p>You&apos;re most compatible with:</p>
            <div className="compat-name">{result.compatibilityTitle}</div>
            <button type="button" className="btn-send" onClick={sendToSomeone}>
              Send this to one 💌
            </button>
          </section>
        )}

        {/* 5. Share Card Preview — screenshot-friendly; image placeholders */}
        <section className="share-card-preview animate-in">
          <div className="share-card-bg">
            {sc?.shareCardBgUrl && (
              <img
                src={sc.shareCardBgUrl}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const wrap = e.currentTarget.parentElement;
                  if (wrap?.querySelector(".share-card-placeholder-bg")) return;
                  const pl = document.createElement("div");
                  pl.className = "share-card-placeholder-bg";
                  pl.textContent = "📷 Add share-card-bg.png (1200×630) — see public/images/IMAGES_REQUIRED.md";
                  wrap?.appendChild(pl);
                }}
              />
            )}
            {sc?.personalityImageUrl && (
              <img
                src={sc.personalityImageUrl}
                alt=""
                className="share-card-personality-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {!sc?.shareCardBgUrl && (
              <div className="share-card-placeholder-bg">
                📷 Placeholder: add <strong>share-card-bg.png</strong> (1200×630)
              </div>
            )}
          </div>
          <div className="share-card-body">
            <div className="share-card-logo">💘 Valentine Profile</div>
            <div className="share-card-title">{sc?.title ?? result.title}</div>
            <div className="share-card-energy">Energy: {sc?.energyLine ?? result.secondaryLine ?? "—"}</div>
            <div className="share-card-meta">Red Flag Level: {result.redFlagLevel}</div>
          </div>
          <div className="share-card-placeholder">
            Screenshot this card to share on Instagram or stories
          </div>
        </section>

        {/* 6. CTA Section */}
        <section className="cta-section animate-in">
          <button type="button" className="btn-ig" onClick={copyShare}>
            📲 Share to Instagram
          </button>
          <button type="button" className="share-btn" onClick={copyLinkOnly}>
            🔗 Copy Link
          </button>
          {copied && <p className="copy-hint">Copied to clipboard!</p>}
          <button
            type="button"
            className="btn-retake"
            onClick={() => {
              setStep("quiz");
              setIndex(0);
              setAnswers(Array(TOTAL).fill(""));
              setResult(null);
            }}
          >
            🎭 Retake Quiz
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="quiz-container">
      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="question-card animate-in">
        <div className="question-number">Question {index + 1} of {TOTAL}</div>
        <h2 className="question-text">{question.text}</h2>
        <div className="answers">
          {Object.entries(question.answers).map(([key, option]) => (
            <button
              key={key}
              type="button"
              className={`answer-btn ${selected === key ? "selected" : ""}`}
              onClick={() => setAnswer(key)}
            >
              {getAnswerLabel(index, key, option)}
            </button>
          ))}
        </div>
        <div className="nav-row">
          {index > 0 ? (
            <button type="button" className="btn-secondary" onClick={goBack}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={goNext}
            disabled={!canNext || loading}
          >
            {loading ? "..." : index < TOTAL - 1 ? "Next" : "See my result"}
          </button>
        </div>
      </div>
    </main>
  );
}
