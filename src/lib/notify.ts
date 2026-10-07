import { config } from "@/config";

function parseGoogleForm(link: string) {
  const idMatch = link.match(/\/forms\/d\/e\/([^/]+)\//);
  const entryMatch = link.match(/(entry\.\d+)=/);
  if (!idMatch || !entryMatch) return null;
  return { formId: idMatch[1], entryId: entryMatch[1] };
}

function formatTimestamp() {
  return new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Silently submits to your Google Form so you know what she did. */
export function trackEvent(message: string) {
  const parsed = parseGoogleForm(config.googleFormPrefilledLink);
  if (!parsed) return;

  const body = new URLSearchParams();
  body.set(parsed.entryId, `[${formatTimestamp()}] ${message}`);

  fetch(`https://docs.google.com/forms/d/e/${parsed.formId}/formResponse`, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    body,
  }).catch(() => {
    // Best effort only; never interrupt her experience.
  });
}

export function trackPageOpen() {
  trackEvent("👀 OPENED the page");
}

export function trackSaidYes(dodges: number) {
  trackEvent(
    dodges > 0
      ? `💘 Clicked YES — after chasing the No button ${dodges} time${dodges === 1 ? "" : "s"} 😂`
      : "💘 Clicked YES on the first try (zero hesitation!)",
  );
}

export function trackReachedEnd() {
  trackEvent("💌 REACHED the final letter");
}

export function trackLetterFinished() {
  trackEvent("📖 Watched the whole letter type out (she read everything!)");
}

export function trackWhatsAppClicked() {
  trackEvent("💬 Tapped the WhatsApp button!!");
}

export function trackAbandoned(where: string) {
  trackEvent(`🚪 LEFT while on: ${where}`);
}

/** Builds the wa.me link for the optional message button, or null if not configured. */
export function whatsappLink() {
  const digits = config.whatsapp.number.replace(/\D/g, "");
  if (!digits) return null;

  const text = encodeURIComponent(config.whatsapp.message);
  return `https://wa.me/${digits}?text=${text}`;
}
