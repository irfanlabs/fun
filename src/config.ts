// Fill these in once. Nothing here is secret, so it's fine to keep it in the code.

export const config = {
  // 1) Google Form (silent "she said yes" notification to you)
  //
  // In your Google Form click the ⋮ menu (top right) -> "Get pre-filled link",
  // type anything in the answer box, click "Get link" -> "Copy link",
  // and paste the whole URL here. It looks like:
  // https://docs.google.com/forms/d/e/1FAIpQL.../viewform?usp=pp_url&entry.123456789=test
  googleFormPrefilledLink:
    "https://docs.google.com/forms/d/e/1FAIpQLScd5YXjZ7IIi3AwqwWEvNtRHmm-R-Fhk0U-lIQGuaxGBl9bPA/viewform?usp=pp_url&entry.122245142=yes",

  // 2) WhatsApp button she can tap after saying yes
  whatsapp: {
    // Your number, digits only, with country code and no "+", spaces or dashes.
    // Example: "923001234567" for +92 300 1234567
    number: "923079888720",
    // The message that will be pre-typed for her (she can edit it before sending).
    message: "I said YES 💖",
  },
};
