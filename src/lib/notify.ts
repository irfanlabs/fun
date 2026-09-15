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

export function trackStepComplete(stepIndex: number, stepTitle: string, totalSteps: number) {
  trackEvent(`✅ STEP ${stepIndex + 1}/${totalSteps}: "${stepTitle}" completed`);
}

export function trackReachedEnd() {
  trackEvent("💌 REACHED the final letter (she read the whole thing!)");
}

export function trackAbandoned(stepIndex: number, stepTitle: string) {
  trackEvent(`🚪 LEFT at step ${stepIndex + 1}: "${stepTitle}"`);
}

/** Builds the wa.me link for the optional message button, or null if not configured. */
export function whatsappLink() {
  const digits = config.whatsapp.number.replace(/\D/g, "");
  if (!digits) return null;

  const text = encodeURIComponent(config.whatsapp.message);
  return `https://wa.me/${digits}?text=${text}`;
}
