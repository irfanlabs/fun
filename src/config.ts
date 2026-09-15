// Fill these in once. Nothing here is secret, so it's fine to keep it in the code.

export const config = {
  // 1) Google Form (silent tracking — you'll get a row for each event)
  //
  // Events look like:
  //   👀 OPENED the page
  //   ✅ STEP 3/8: "Stage 3: I'm totally fine" completed
  //   💌 REACHED the final letter
  //   🚪 LEFT at step 5: "..." (if she closes the tab early)
  //
  // In your Google Form click the ⋮ menu (top right) -> "Get pre-filled link",
  // type anything in the answer box, click "Get link" -> "Copy link",
  // and paste the whole URL here.
  googleFormPrefilledLink:
    "https://docs.google.com/forms/d/e/1FAIpQLScd5YXjZ7IIi3AwqwWEvNtRHmm-R-Fhk0U-lIQGuaxGBl9bPA/viewform?usp=pp_url&entry.122245142=yes",

  // 2) Optional WhatsApp button on the final page (no pressure)
  whatsapp: {
    // Your number, digits only, with country code and no "+", spaces or dashes.
    // Example: "923001234567" for +92 300 1234567
    number: "923079888720",
    // The message that will be pre-typed for her (she can edit it before sending).
    message: "I read your letter… and I smiled 😄❤️",
  },
};
