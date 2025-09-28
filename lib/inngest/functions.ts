import {inngestClient} from "@/lib/inngest/client";
import {PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {logger} from "@/lib/logger";
import {sendWelcomeEmail} from "@/lib/nodemailer";

export const sendSignUpEmail = inngestClient.createFunction(
  { id: "send-welcome-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const userProfile = `
    - Country: ${event.data.country}
    - Investments Goal: ${event.data.investmentGoals}
    - Risk Tolerance: ${event.data.riskTolerance}
    - Preferred Industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile.trim(),
    );

    logger.info({ prompt });

    const response = await step.ai.infer("generate-welcome-email", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: { contents: [{ role: "user", parts: [{ text: prompt }] }] },
    });

    logger.info({ response });

    await step.run("send-welcome-email", async () => {
      const aiEmailContent = response.candidates?.[0].content?.parts[0];

      const emailContent =
        aiEmailContent && "text" in aiEmailContent
          ? aiEmailContent.text.trim()
          : "Thanks for joining! You now have the tools to track markets and make smart moves";

      logger.info({ emailContent });

      await sendWelcomeEmail({
        email: event.data.email,
        name: event.data.fullName,
        intro: emailContent,
      });

      return {
        success: true,
        message: `Welcome email successfully sent to ${event.data.email}`,
      };
    });
  },
);
