export type Step = {
  id: string;
  /** Escalating "I tried..." emotional line */
  line: string;
  /** Funny punchy one-liner right after the emotional line */
  punchline: string;
  buttonLabel: string;
  /** Looping clip shown for a few seconds after she clicks the button */
  gif: {
    /** .gif URL (fallback) */
    url: string;
    /** .mp4 URL of the same clip (used for true infinite looping) */
    videoUrl: string;
    alt: string;
    caption: string;
  };
};

export const NAME = "Alieha";

export const STEPS: Step[] = [
  {
    id: "tried-best",
    line: "I tried my best to make you mine.",
    punchline: "Turns out \"trying your best\" doesn't come with a discount code for someone's heart. 😅",
    buttonLabel: "And then?",
    gif: {
      url: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGFsZXY4cmhnYXdnMzl3c2l5aTBkbWQzM2pxanhibXZvdzFjY2puNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sbHHDbDc5O6M0bP4Ko/giphy.gif",
      videoUrl:
        "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGFsZXY4cmhnYXdnMzl3c2l5aTBkbWQzM2pxanhibXZvdzFjY2puNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sbHHDbDc5O6M0bP4Ko/giphy.mp4",
      alt: "Facepalm reaction",
      caption: "Nice try, right? 🤦‍♂️",
    },
  },
  {
    id: "tried-harder",
    line: "When that wasn't enough, I tried even harder.",
    punchline: "At that point my texts had their own subscription plan and my WiFi router filed a formal complaint. 📶😂",
    buttonLabel: "Keep going...",
    gif: {
      url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWdjNXp4NG10YmF4NnFuczdrYWg4OThjN2Jsc3AwZjhhNmRtenNvMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JXIA2Pzge00ww/giphy.gif",
      videoUrl:
        "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWdjNXp4NG10YmF4NnFuczdrYWg4OThjN2Jsc3AwZjhhNmRtenNvMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JXIA2Pzge00ww/giphy.mp4",
      alt: "Friend-zoned fail reaction",
      caption: "Yeah... that's about how it went. 💀",
    },
  },
  {
    id: "kept-trying",
    line: "I kept trying long after most people would've quietly given up.",
    punchline: "Even Google Maps said \"recalculating\" at some point and I still didn't take the hint. 🗺️😭",
    buttonLabel: "There's more...",
    gif: {
      url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTk2bTRqdzBjeG50dGxkcG01bmZ2cXVhNG5yYmpkNHcyMXgyNTJoMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/G3d2yVhl4nEXyXObTu/giphy.gif",
      videoUrl:
        "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTk2bTRqdzBjeG50dGxkcG01bmZ2cXVhNG5yYmpkNHcyMXgyNTJoMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/G3d2yVhl4nEXyXObTu/giphy.mp4",
      alt: "Still going goofy dance",
      caption: "Me, still going. 🕺",
    },
  },
  {
    id: "finally-stopped",
    line: "And then you told me you weren't ready — so for the first time, I actually stopped trying.",
    punchline: "Certified emotional-support clown, officially retiring the crown. 🤡👑",
    buttonLabel: "Okay, one last thing",
    gif: {
      url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3Btb2JlazF6bWI3d3lmaG9tamw1anhsNm9mNmNjdWg4ZmVsNGZ0NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a8HPmwQSMxKmxhqPaN/giphy.gif",
      videoUrl:
        "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3Btb2JlazF6bWI3d3lmaG9tamw1anhsNm9mNmNjdWg4ZmVsNGZ0NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a8HPmwQSMxKmxhqPaN/giphy.mp4",
      alt: "Playful cartoon slap",
      caption: "Fine, I probably deserved that. 😂",
    },
  },
];

export const CLOSING_LINE =
  "Forever yours, the guy who's been in love with you since that confused look on your face. 😄❤️";
