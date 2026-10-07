import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CLOSING_LINE,
  LETTER_PARAGRAPHS,
  LETTER_SUBTITLE,
  NAME,
  NO_SURRENDERS_AFTER,
  QUESTION,
} from "@/content/steps";
import {
  trackAbandoned,
  trackLetterFinished,
  trackPageOpen,
  trackReachedEnd,
  trackSaidYes,
  trackWhatsAppClicked,
  whatsappLink,
} from "@/lib/notify";

const FLOAT_EMOJIS = ["💗", "❤️", "✨", "😄", "💫", "💭"];

type Phase = "question" | "letter";

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function FloatingEmojis() {
  const [floaters] = useState(() =>
    Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: randBetween(0, 100),
      size: randBetween(14, 30),
      duration: randBetween(10, 20),
      delay: randBetween(0, 14),
      drift: randBetween(-30, 30),
      emoji: FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)],
    })),
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {floaters.map((f) => (
        <span
          key={f.id}
          className="animate-float-up absolute bottom-0 select-none opacity-0"
          style={
            {
              left: `${f.left}%`,
              fontSize: `${f.size}px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--drift": `${f.drift}px`,
            } as React.CSSProperties
          }
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}

function QuestionScreen({ onYes }: { onYes: (dodges: number) => void }) {
  const [dodges, setDodges] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const lastDodgeAt = useRef(0);

  const surrendered = dodges >= NO_SURRENDERS_AFTER;
  const noLabel = surrendered
    ? QUESTION.surrenderLabel
    : QUESTION.noLabels[Math.min(dodges, QUESTION.noLabels.length - 1)];
  const yesScale = 1 + Math.min(dodges, NO_SURRENDERS_AFTER) * 0.1;

  const dodge = useCallback(() => {
    const now = Date.now();
    if (now - lastDodgeAt.current < 250) return;
    lastDodgeAt.current = now;

    const btn = noRef.current;
    const w = btn?.offsetWidth ?? 160;
    const h = btn?.offsetHeight ?? 48;
    const pad = 16;

    // Re-roll until the button lands away from the center, where "Yes" lives.
    let x = 0;
    let y = 0;
    for (let i = 0; i < 10; i++) {
      x = randBetween(pad, Math.max(pad + 1, window.innerWidth - w - pad));
      y = randBetween(pad, Math.max(pad + 1, window.innerHeight - h - pad));
      const dx = x + w / 2 - window.innerWidth / 2;
      const dy = y + h / 2 - window.innerHeight / 2;
      if (Math.hypot(dx, dy) > 180) break;
    }

    setNoPos({ x, y });
    setDodges((d) => d + 1);
  }, []);

  return (
    <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <Heart
        className="animate-heartbeat mb-6 size-14 fill-rose-500 text-rose-500 sm:size-16"
        strokeWidth={1.5}
      />

      <p className="animate-pop-in text-base font-semibold text-rose-700 sm:text-lg">
        {QUESTION.intro}
      </p>

      <h1 className="animate-pop-in mt-4 max-w-3xl text-balance text-3xl font-extrabold leading-tight text-rose-950 sm:text-5xl">
        {QUESTION.line}
      </h1>

      <p className="animate-pop-in mt-4 text-sm font-medium text-rose-900/60 sm:text-base">
        {QUESTION.hint}
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button
          type="button"
          size="lg"
          onClick={() => onYes(dodges)}
          style={{ transform: `scale(${yesScale})` }}
          className="h-13 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-10 text-lg font-bold text-white shadow-xl transition-transform duration-300 hover:from-rose-700 hover:to-pink-700"
        >
          {QUESTION.yesLabel}
        </Button>

        <button
          ref={noRef}
          type="button"
          onPointerEnter={surrendered ? undefined : dodge}
          onPointerDown={surrendered ? undefined : (e) => {
            e.preventDefault();
            dodge();
          }}
          onClick={surrendered ? () => onYes(dodges) : undefined}
          style={
            noPos
              ? { position: "fixed", left: noPos.x, top: noPos.y, zIndex: 50 }
              : undefined
          }
          className="h-12 rounded-full border-2 border-rose-300 bg-white/80 px-8 text-base font-semibold text-rose-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white"
        >
          {noLabel}
        </button>
      </div>

      {dodges > 0 && !surrendered && (
        <p className="mt-8 text-sm italic text-rose-900/50">
          The No button seems scared of you… wonder why. 🤔
        </p>
      )}
    </div>
  );
}

/** Flattens the letter into one char count so typing speed is a single number. */
function useTypewriter(paragraphs: readonly string[], speedMs: number) {
  const bounds = useMemo(() => {
    const cumulative: number[] = [];
    let total = 0;
    for (const p of paragraphs) {
      total += p.length;
      cumulative.push(total);
    }
    return { cumulative, total };
  }, [paragraphs]);

  const [count, setCount] = useState(0);
  const done = count >= bounds.total;

  useEffect(() => {
    if (done) return;
    // Longer pause when a paragraph just finished, so it breathes like real writing.
    const atBoundary = bounds.cumulative.includes(count) && count > 0;
    const timer = setTimeout(() => setCount((c) => c + 1), atBoundary ? 500 : speedMs);
    return () => clearTimeout(timer);
  }, [count, done, bounds, speedMs]);

  const visible = useMemo(
    () =>
      paragraphs.map((p, i) => {
        const start = i === 0 ? 0 : bounds.cumulative[i - 1];
        return p.slice(0, Math.max(0, Math.min(p.length, count - start)));
      }),
    [count, paragraphs, bounds],
  );

  return { visible, done, skip: () => setCount(bounds.total) };
}

function FinalLetter() {
  const waLink = whatsappLink();
  const { visible, done, skip } = useTypewriter(LETTER_PARAGRAPHS, 16);
  const bottomRef = useRef<HTMLDivElement>(null);
  const trackedFinish = useRef(false);

  useEffect(() => {
    if (done && !trackedFinish.current) {
      trackedFinish.current = true;
      trackLetterFinished();
    }
  }, [done]);

  // Follow the typing, but only while she's already near the bottom.
  useEffect(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 160;
    if (nearBottom) bottomRef.current?.scrollIntoView({ block: "end" });
  }, [visible]);

  return (
    <div className="relative z-10 mx-auto min-h-svh w-full max-w-2xl px-6 py-12 sm:py-16">
      <div className="animate-pop-in text-center">
        <Heart
          className="mx-auto mb-3 size-12 fill-rose-500 text-rose-500 sm:size-14"
          strokeWidth={1.5}
        />
        <h1 className="flex items-center justify-center gap-2 text-balance text-3xl font-bold text-rose-950 sm:text-4xl">
          For you, {NAME} <Sparkles className="size-7 text-amber-500" />
        </h1>
        <p className="mt-2 text-sm text-rose-900/70 sm:text-base">{LETTER_SUBTITLE}</p>
      </div>

      <div className="mt-10 space-y-5 text-[16px] leading-relaxed text-rose-950/90 sm:text-lg">
        {visible.map((text, i) =>
          text.length === 0 ? null : (
            <p key={LETTER_PARAGRAPHS[i]}>
              {text}
              {!done && text.length < LETTER_PARAGRAPHS[i].length && (
                <span className="animate-pulse text-rose-500">▍</span>
              )}
            </p>
          ),
        )}

        {done && (
          <p className="animate-pop-in pt-2 text-right italic">{CLOSING_LINE}</p>
        )}
      </div>

      {!done && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={skip}
            className="text-sm font-semibold text-rose-500 underline-offset-4 hover:underline"
          >
            Skip to the end ✨
          </button>
        </div>
      )}

      {done && waLink && (
        <div className="animate-pop-in mt-10 flex flex-col items-center gap-2 pb-8">
          <p className="text-sm text-rose-900/70">No pressure, only if you want to 👇</p>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-emerald-500 px-8 text-base font-semibold text-white shadow-lg hover:bg-emerald-600"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClicked()}
            >
              <MessageCircle className="size-5" />
              Say hi on WhatsApp 💌
            </a>
          </Button>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState<Phase>("question");
  const trackedOpen = useRef(false);
  const reachedEnd = useRef(false);
  const phaseRef = useRef<Phase>("question");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (trackedOpen.current) return;
    trackedOpen.current = true;
    trackPageOpen();
  }, []);

  useEffect(() => {
    function handleBeforeUnload() {
      if (reachedEnd.current) return;
      trackAbandoned(
        phaseRef.current === "question" ? "the question screen" : "the letter",
      );
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleYes = useCallback((dodges: number) => {
    trackSaidYes(dodges);
    reachedEnd.current = true;
    trackReachedEnd();
    setPhase("letter");
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative min-h-svh w-full bg-gradient-to-br from-rose-200 via-pink-200 to-rose-100">
      <FloatingEmojis />
      {phase === "question" ? <QuestionScreen onYes={handleYes} /> : <FinalLetter />}
    </div>
  );
}

export default App;
