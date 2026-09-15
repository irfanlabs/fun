import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransitionGif } from "@/components/TransitionGif";
import { CLOSING_LINE, NAME, STEPS } from "@/content/steps";
import {
  trackAbandoned,
  trackPageOpen,
  trackReachedEnd,
  trackStepComplete,
  whatsappLink,
} from "@/lib/notify";
import { cn } from "@/lib/utils";

const FLOAT_EMOJIS = ["💗", "❤️", "✨", "😄", "💫"];
const TOTAL_SCREENS = STEPS.length + 1; // 4 steps + final letter

type Phase = "step" | "transition" | "letter";

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="mb-6 w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-rose-900/60">
        <span>
          Step {current + 1} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-rose-200/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function FinalLetter() {
  const waLink = whatsappLink();

  return (
    <div className="animate-pop-in w-full max-w-lg rounded-3xl border border-white/60 bg-white/90 p-6 text-center shadow-2xl backdrop-blur-md sm:p-10">
      <Heart
        className="mx-auto mb-2 size-12 fill-rose-500 text-rose-500 sm:size-14"
        strokeWidth={1.5}
      />
      <h1 className="flex items-center justify-center gap-2 text-balance text-2xl font-bold text-rose-950 sm:text-3xl">
        For you, {NAME} <Sparkles className="size-7 text-amber-500" />
      </h1>
      <p className="mt-2 text-sm text-rose-900/70">No jokes this time. Just me, being honest.</p>

      <div className="mt-6 space-y-4 text-left text-[15px] leading-relaxed text-rose-950/90 sm:text-base">
        <p>{NAME},</p>
        <p>
          I tried everything I could think of to make you mine. But you've told me you're not
          ready, and I actually heard you this time.
        </p>
        <p>
          I love how you laugh at your own jokes before you even finish telling them. I love how
          safe and calm I feel just existing next to you. And even though we're not doing the
          relationship thing right now, I'm still grateful that out of everyone in the world, I got
          to meet you.
        </p>
        <p>
          So I'm letting you go the way you asked — not because I stopped caring, but because you
          deserve someone who meets you where you are, not where I wish you were.
        </p>
        <p>
          This site isn't going anywhere though. I'll keep updating it for you, time to time, with
          no deadline and no pressure — just because I want to, and because some part of me will
          always be a little bit yours.
        </p>
        <p>
          I still remember the first time I called out your name — you looked so confused, like
          you couldn't figure out why some guy was shouting it across the room. Then I worked up
          the courage to ask for your number, and you gave it to me even though you really didn't
          want to. But somewhere, deep down, some part of you already knew something was about to
          change. I think about that moment more than you know.
        </p>
        <p>
          Someone once told me to love someone for their heart, not their face — but somehow, I
          got impossibly lucky, because you have both. The kindest, warmest, most beautiful heart
          I've ever known, wrapped around a face I genuinely cannot stop smiling at.
        </p>
        <p className="pt-2 text-right italic">{CLOSING_LINE}</p>
      </div>

      {waLink && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm text-rose-900/70">No pressure — only if you want to 👇</p>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-emerald-500 px-8 text-base font-semibold text-white shadow-lg hover:bg-emerald-600"
          >
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" />
              Say hi on WhatsApp 💌
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("step");
  const trackedOpen = useRef(false);
  const reachedEnd = useRef(false);
  const stepIndexRef = useRef(0);

  const step = STEPS[stepIndex];

  const [floaters] = useState(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: randBetween(0, 100),
      size: randBetween(14, 28),
      duration: randBetween(10, 20),
      delay: randBetween(0, 14),
      drift: randBetween(-30, 30),
      emoji: FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)],
    })),
  );

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  useEffect(() => {
    if (trackedOpen.current) return;
    trackedOpen.current = true;
    trackPageOpen();
  }, []);

  useEffect(() => {
    if (phase === "letter" && !reachedEnd.current) {
      reachedEnd.current = true;
      trackReachedEnd();
    }
  }, [phase]);

  useEffect(() => {
    function handleBeforeUnload() {
      if (reachedEnd.current) return;
      const idx = stepIndexRef.current;
      trackAbandoned(idx, STEPS[idx]?.line ?? "unknown");
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleButtonClick = useCallback(() => {
    trackStepComplete(stepIndex, step.line, TOTAL_SCREENS);
    setPhase("transition");
  }, [step.line, stepIndex]);

  const handleTransitionDone = useCallback(() => {
    if (stepIndex >= STEPS.length - 1) {
      setPhase("letter");
    } else {
      setStepIndex((i) => i + 1);
      setPhase("step");
    }
  }, [stepIndex]);

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-gradient-to-br from-rose-200 via-pink-200 to-rose-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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

      <div className="relative z-10 flex min-h-svh items-center justify-center p-4 sm:p-6">
        {phase === "letter" ? (
          <FinalLetter />
        ) : (
          <div
            className={cn(
              "animate-pop-in w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8",
            )}
            key={step.id}
          >
            <ProgressBar current={stepIndex} total={TOTAL_SCREENS} />

            <Heart
              className="animate-heartbeat mx-auto mb-3 size-10 fill-rose-500 text-rose-500"
              strokeWidth={1.5}
            />

            <p className="text-balance text-xl font-bold text-rose-950 sm:text-2xl">
              {step.line}
            </p>

            <p className="mt-4 text-balance text-base font-medium text-rose-700 sm:text-lg">
              {step.punchline}
            </p>

            <Button
              type="button"
              size="lg"
              onClick={handleButtonClick}
              className="mt-7 h-12 w-full rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-8 text-base font-semibold text-white shadow-lg hover:from-rose-700 hover:to-pink-700"
            >
              {step.buttonLabel}
              <ArrowRight className="size-5" />
            </Button>
          </div>
        )}
      </div>

      {phase === "transition" && (
        <TransitionGif
          url={step.gif.url}
          videoUrl={step.gif.videoUrl}
          alt={step.gif.alt}
          caption={step.gif.caption}
          onDone={handleTransitionDone}
        />
      )}
    </div>
  );
}

export default App;
