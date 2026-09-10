import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Heart, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAME = "My Lady";

const NO_REACTIONS = [
  "Nice try 😏 not happening!",
  "Catch me if you can 🏃‍♀️💨",
  "Nuh uh 🙅‍♀️",
  "Error 404: 'No' not found 🚫",
  "My heart said no before I could 😂",
  "You really thought? 😭",
  "The 'No' button has left the chat 💨",
  "Bold of you to assume I'd let you click that 😌",
  "Access denied, try love instead 🚨💕",
  "Try again, bestie 😆",
  "This button is allergic to your cursor 🤧",
  "Yes is right there... 👉😏",
  "I'm too fast for you 🏃💨😆",
  "This button only responds to good decisions 💅",
  "Sorry, 'No' doesn't live here anymore 🏠💨",
  "Plot twist: you can't 😌✨",
];

const BURST_EMOJIS = ["😂", "🤣", "😅", "😆", "💨", "😏", "🙅‍♀️", "😭", "👀", "💫"];

type Burst = { id: number; top: number; left: number; emoji: string };
type FloatingHeart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  emoji: string;
};
type Confetto = {
  id: number;
  left: number;
  duration: number;
  delay: number;
  emoji: string;
};

const HEART_EMOJIS = ["💗", "💖", "💕", "❤️", "💓", "💞"];
const CONFETTI_EMOJIS = ["🎉", "💖", "✨", "💕", "🎊", "💗", "🌸"];

const EDGE_MARGIN = 20;
const YES_BUFFER = 28;
const NO_BTN_FALLBACK = { width: 96, height: 44 };

type Rect = { left: number; top: number; width: number; height: number };

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function measureSize(el: HTMLElement | null, fallback: { width: number; height: number }) {
  if (!el) return fallback;
  const rect = el.getBoundingClientRect();
  return {
    width: rect.width || fallback.width,
    height: rect.height || fallback.height,
  };
}

function expandRect(rect: DOMRect, by: number): Rect {
  return {
    left: rect.left - by,
    top: rect.top - by,
    width: rect.width + by * 2,
    height: rect.height + by * 2,
  };
}

function rectsOverlap(a: Rect, b: Rect) {
  return (
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.top + a.height > b.top
  );
}

function App() {
  const [accepted, setAccepted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [reaction, setReaction] = useState(
    "Go ahead, pick one... 👀 (we both know which one 😏)",
  );
  const [noPos, setNoPos] = useState({ top: 120, left: 120 });
  const [bursts, setBursts] = useState<Burst[]>([]);
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const lastReactionIndex = useRef(-1);
  const burstIdRef = useRef(0);

  const [floatingHearts] = useState<FloatingHeart[]>(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: randBetween(0, 100),
      size: randBetween(14, 30),
      duration: randBetween(9, 18),
      delay: randBetween(0, 12),
      drift: randBetween(-40, 40),
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    })),
  );

  const [confetti, setConfetti] = useState<Confetto[]>([]);

  function celebrate() {
    setConfetti(
      Array.from({ length: 90 }).map((_, i) => ({
        id: i,
        left: randBetween(0, 100),
        duration: randBetween(3, 6),
        delay: randBetween(0, 2.5),
        emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
      })),
    );
    setAccepted(true);
  }

  useEffect(() => {
    if (bursts.length === 0) return;
    const timer = setTimeout(() => {
      setBursts((prev) => prev.slice(1));
    }, 900);
    return () => clearTimeout(timer);
  }, [bursts]);

  function pickReaction() {
    let idx = Math.floor(Math.random() * NO_REACTIONS.length);
    if (NO_REACTIONS.length > 1) {
      while (idx === lastReactionIndex.current) {
        idx = Math.floor(Math.random() * NO_REACTIONS.length);
      }
    }
    lastReactionIndex.current = idx;
    return NO_REACTIONS[idx];
  }

  function pickSpot(cursor?: { x: number; y: number }) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const noSize = measureSize(noBtnRef.current, NO_BTN_FALLBACK);
    const yesRectRaw = yesBtnRef.current?.getBoundingClientRect() ?? null;
    const yesRect = yesRectRaw ? expandRect(yesRectRaw, YES_BUFFER) : null;

    const minLeft = EDGE_MARGIN;
    const maxLeft = Math.max(minLeft, vw - EDGE_MARGIN - noSize.width);
    const minTop = EDGE_MARGIN;
    const maxTop = Math.max(minTop, vh - EDGE_MARGIN - noSize.height);

    const currentCenter = {
      x: noPos.left + noSize.width / 2,
      y: noPos.top + noSize.height / 2,
    };

    let best = { top: minTop, left: minLeft };
    let bestScore = -Infinity;
    for (let i = 0; i < 30; i++) {
      const left = randBetween(minLeft, maxLeft);
      const top = randBetween(minTop, maxTop);
      const candidateRect = { left, top, width: noSize.width, height: noSize.height };
      if (yesRect && rectsOverlap(candidateRect, yesRect)) continue;

      const centerX = left + noSize.width / 2;
      const centerY = top + noSize.height / 2;
      const distFromCursor = cursor ? Math.hypot(centerX - cursor.x, centerY - cursor.y) : 0;
      const distFromCurrent = Math.hypot(centerX - currentCenter.x, centerY - currentCenter.y);
      const score = distFromCursor + distFromCurrent;
      if (score > bestScore) {
        bestScore = score;
        best = { top, left };
      }
    }

    return best;
  }

  function dodge(clientX?: number, clientY?: number) {
    const cursor = clientX !== undefined && clientY !== undefined ? { x: clientX, y: clientY } : undefined;
    const next = pickSpot(cursor);

    setBursts((prev) => [
      ...prev,
      {
        id: burstIdRef.current++,
        top: noPos.top,
        left: noPos.left,
        emoji: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
      },
    ]);

    setNoPos(next);
    setAttempts((a) => a + 1);
    setReaction(pickReaction());
  }

  useLayoutEffect(() => {
    setNoPos(pickSpot());

    function handleResize() {
      setNoPos((prev) => {
        const noSize = measureSize(noBtnRef.current, NO_BTN_FALLBACK);
        const maxLeft = Math.max(EDGE_MARGIN, window.innerWidth - EDGE_MARGIN - noSize.width);
        const maxTop = Math.max(EDGE_MARGIN, window.innerHeight - EDGE_MARGIN - noSize.height);
        return {
          left: Math.min(Math.max(prev.left, EDGE_MARGIN), maxLeft),
          top: Math.min(Math.max(prev.top, EDGE_MARGIN), maxTop),
        };
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNoPointerEnter(e: React.PointerEvent<HTMLButtonElement>) {
    if (e.pointerType === "touch") return;
    dodge(e.clientX, e.clientY);
  }

  function handleNoTouchStart(e: React.TouchEvent<HTMLButtonElement>) {
    const touch = e.touches[0];
    dodge(touch?.clientX, touch?.clientY);
  }

  function handleNoClick(e: React.MouseEvent<HTMLButtonElement>) {
    // Safety net: even in the unlikely event a click lands, it never counts as "no".
    dodge(e.clientX, e.clientY);
  }

  const yesScale = Math.min(1 + attempts * 0.045, 1.7);

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-gradient-to-br from-rose-200 via-pink-300 to-red-300">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingHearts.map((h) => (
          <span
            key={h.id}
            className="animate-float-up absolute bottom-0 select-none opacity-0"
            style={
              {
                left: `${h.left}%`,
                fontSize: `${h.size}px`,
                animationDuration: `${h.duration}s`,
                animationDelay: `${h.delay}s`,
                "--drift": `${h.drift}px`,
              } as React.CSSProperties
            }
          >
            {h.emoji}
          </span>
        ))}
      </div>

      {accepted && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map((c) => (
            <span
              key={c.id}
              className="animate-confetti-fall absolute top-0 select-none"
              style={{
                left: `${c.left}%`,
                fontSize: `${randBetween(14, 26)}px`,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`,
              }}
            >
              {c.emoji}
            </span>
          ))}
        </div>
      )}

      {!accepted && (
        <>
          {bursts.map((b) => (
            <span
              key={b.id}
              className="animate-burst-float pointer-events-none fixed z-50 text-2xl"
              style={{ top: `${b.top}px`, left: `${b.left}px` }}
            >
              {b.emoji}
            </span>
          ))}

          <button
            ref={noBtnRef}
            type="button"
            onPointerEnter={handleNoPointerEnter}
            onTouchStart={handleNoTouchStart}
            onClick={handleNoClick}
            className="fixed z-50 h-11 rounded-full border border-transparent bg-rose-100 px-7 text-base font-semibold text-rose-900 shadow-lg transition-[top,left] duration-300 ease-out hover:bg-rose-100"
            style={{ top: `${noPos.top}px`, left: `${noPos.left}px` }}
          >
            No
          </button>
        </>
      )}

      <div className="relative z-10 flex min-h-svh items-center justify-center p-4 sm:p-6">
        {!accepted ? (
          <div
            className={cn(
              "animate-pop-in w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8",
              attempts > 0 && "animate-card-shake",
            )}
            key={attempts > 0 ? `shake-${attempts}` : "still"}
          >
            <Heart
              className="animate-heartbeat mx-auto mb-3 size-12 fill-rose-500 text-rose-500 sm:size-14"
              strokeWidth={1.5}
            />
            <h1 className="text-balance text-2xl font-bold text-rose-950 sm:text-3xl">
              Do you love me, {NAME}? 💕
            </h1>
            <p className="mt-2 text-sm text-rose-900/70 sm:text-base">
              No pressure, but there's only one right answer here 😏
            </p>

            <p className="mt-6 min-h-12 text-balance text-base font-medium text-rose-800 sm:text-lg">
              {reaction}
            </p>

            <div className="mt-6 flex select-none items-center justify-center">
              <Button
                ref={yesBtnRef}
                type="button"
                size="lg"
                onClick={celebrate}
                className="h-11 rounded-full bg-rose-600 px-7 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:bg-rose-700"
                style={{ transform: `scale(${yesScale})` }}
              >
                Yes 💖
              </Button>
            </div>

            {attempts > 3 && (
              <p className="mt-4 text-xs text-rose-900/50">
                {attempts} failed attempts and counting 😂
              </p>
            )}
          </div>
        ) : (
          <div className="animate-pop-in w-full max-w-lg rounded-3xl border border-white/60 bg-white/85 p-6 text-center shadow-2xl backdrop-blur-md sm:p-10">
            <PartyPopper
              className="animate-heartbeat mx-auto mb-2 size-12 text-rose-500 sm:size-14"
              strokeWidth={1.5}
            />
            <h1 className="flex items-center justify-center gap-2 text-balance text-2xl font-bold text-rose-950 sm:text-3xl">
              She said YES! <Sparkles className="size-7 text-amber-500" />
            </h1>

            <div className="mt-6 space-y-4 text-left text-[15px] leading-relaxed text-rose-950/90 sm:text-base">
              <p>{NAME},</p>
              <p>
                You said yes. 💗 (I mean… did you really have a choice? 😏)
              </p>
              <p>
                I still remember the first time I called out your name —
                you looked so confused, like you couldn't figure out why some
                guy was shouting it across the room. Then I worked up the
                courage to ask for your number, and you gave it to me even
                though you really didn't want to. But somewhere, deep down,
                some part of you already knew something was about to change.
                I think about that moment more than you know.
              </p>
              <p>
                Someone once told me to love someone for their heart, not
                their face — but somehow, I got impossibly lucky, because you
                have both. The kindest, warmest, most beautiful heart I've
                ever known, wrapped around a face I genuinely cannot stop
                smiling at.
              </p>
              <p>
                I love how you laugh at your own jokes before you even
                finish telling them. I love how safe and calm I feel just
                existing next to you. And out of everyone in the world, I
                still can't believe you're the one who's mine.
              </p>
              <p>
                So here it is, in writing, forever: I love you. Not just
                today, not just because you clicked a button — I love you on
                the ordinary days, the bad days, and the "it's 3am, I can't
                sleep, let's talk about nothing" days. All of them.
              </p>
              <p>Thank you for saying yes to me — then, and now. 💍✨</p>
              <p className="pt-2 text-right italic">
                Forever yours, the guy who's been in love with you since
                that confused look on your face. 😄❤️
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
