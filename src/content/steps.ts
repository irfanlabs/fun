export const NAME = "Alieha";

/** Screen 1 — the one-question screen with the runaway "No" button. */
export const QUESTION = {
  intro: "Hi Alieha. One tiny question… 👀",
  line: "Do you still think about me sometimes?",
  hint: "Be honest. The buttons already know. 😌",
  yesLabel: "Yes 😳",
  /** Shown in order, one per escape. The last one repeats if she keeps chasing it. */
  noLabels: [
    "No 🙅‍♀️",
    "Nope",
    "Catch me first 😏",
    "Not happening 🏃‍♀️",
    "Why are you chasing a button?",
    "Your heart hesitated just now 😌",
  ],
  /** After enough escapes the No button gives up and becomes clickable with this label. */
  surrenderLabel: "Okay fine… maybe 🙈",
} as const;

/** How many times "No" runs away before it surrenders. */
export const NO_SURRENDERS_AFTER = 6;

export const LETTER_SUBTITLE = "Mostly honest. Slightly dramatic. Fully yours.";

/**
 * Screen 2 — the letter, typed out live.
 * Paragraphs 5 and 6 (first met + heart/face) are kept word-for-word. Don't touch them.
 */
export const LETTER_PARAGRAPHS = [
  `${NAME},`,
  "So you clicked Yes. Or the No button just got tired of running. Either way, it counts. 😏",
  "I know you left. I'm not going to argue with that, and I'm not trying to make this heavy. But you opened this page, you read this far, and I'm pretty sure you smiled at least once already. Don't deny it, I know exactly which smile it was.",
  "Here's the honest part. I still care about you. Quietly, without expecting anything back. You still cross my mind at random times, and I still catch myself hoping your day went well.",
  "I still remember the first time I called out your name. You looked so confused, like you couldn't figure out why some guy was shouting it across the room. Then I worked up the courage to ask for your number, and you gave it to me even though you really didn't want to. But somewhere, deep down, some part of you already knew something was about to change. I think about that moment more than you know.",
  "Someone once told me to love someone for their heart, not their face. But somehow I got impossibly lucky, because you have both. The kindest, warmest, most beautiful heart I've ever known, wrapped around a face I genuinely cannot stop smiling at.",
  "No pressure, and no expectations. The door was never locked. If one day you feel like walking back through it, even just to say hi, you know where to find me. Till then I'll keep updating this little site for you, time to time, just because I want to. And because some part of me will always be a little bit yours.",
];

export const CLOSING_LINE =
  "Forever yours, the guy who's been in love with you since that confused look on your face. 😄❤️";
