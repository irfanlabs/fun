import { useEffect, useRef, useState } from "react";

const MODAL_DURATION_MS = 10_000;
const SKIP_APPEARS_MS = 900;

export function TransitionGif({
  url,
  videoUrl,
  alt,
  caption,
  onDone,
}: {
  url: string;
  videoUrl: string;
  alt: string;
  caption: string;
  onDone: () => void;
}) {
  const [canSkip, setCanSkip] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), SKIP_APPEARS_MS);
    const closeTimer = setTimeout(() => onDoneRef.current(), MODAL_DURATION_MS);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  return (
    <div className="animate-pop-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-white/95 p-5 text-center shadow-2xl">
        {videoFailed ? (
          <img
            src={url}
            alt={alt}
            className="max-h-64 w-auto rounded-2xl object-contain shadow-md"
          />
        ) : (
          <video
            key={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoFailed(true)}
            aria-label={alt}
            className="max-h-64 w-auto rounded-2xl object-contain shadow-md"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        <p className="text-lg font-bold text-rose-900">{caption}</p>

        <button
          type="button"
          onClick={onDone}
          className={`text-sm font-semibold text-rose-500 underline-offset-4 transition-opacity hover:underline ${
            canSkip ? "opacity-100" : "opacity-0"
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
