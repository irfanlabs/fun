import { config } from "@/config";

function parseGoogleForm(link: string) {
  const idMatch = link.match(/\/forms\/d\/e\/([^/]+)\//);
  const entryMatch = link.match(/(entry\.\d+)=/);
  if (!idMatch || !entryMatch) return null;
  return { formId: idMatch[1], entryId: entryMatch[1] };
}

/** Silently submits to your Google Form so you know she clicked Yes. */
export function notifyYesViaGoogleForm(noAttempts: number) {
  const parsed = parseGoogleForm(config.googleFormPrefilledLink);
  if (!parsed) return;

  const body = new URLSearchParams();
  body.set(
    parsed.entryId,
    `She said YES 💖 on ${new Date().toLocaleString()} after ${noAttempts} failed "No" attempts 😂`,
  );

  fetch(`https://docs.google.com/forms/d/e/${parsed.formId}/formResponse`, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    body,
  }).catch(() => {
    // Best effort only; never interrupt the celebration.
  });
}

/** Builds the wa.me link for the "tell him yourself" button, or null if not configured. */
export function whatsappLink(noAttempts: number) {
  const digits = config.whatsapp.number.replace(/\D/g, "");
  if (!digits) return null;

  const suffix =
    noAttempts > 0 ? ` ...and I only tried clicking No ${noAttempts} times 😂` : "";
  const text = encodeURIComponent(`${config.whatsapp.message}${suffix}`);
  return `https://wa.me/${digits}?text=${text}`;
}
