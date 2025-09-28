import {Inngest} from "inngest";

export const inngestClient = new Inngest({
  id: process.env.NEXT_PUBLIC_APP_NAME as string,
  ai: { gemini: { apiKey: process.env.GOOGLE_GEMINI_API_KEY as string } },
});
