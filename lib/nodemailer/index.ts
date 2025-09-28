import nodemailer from "nodemailer";
import {WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

export const transporter = nodemailer.createTransport({
  from: process.env.EMAIL_FROM,
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_SMTP_USER,
    pass: process.env.GOOGLE_SMTP_PASS,
  },
});

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const emailBody = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro,
  );

  const emailOptions = {
    from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME} - your stock market toolkit is ready 🚀🚀🚀`,
    text: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}! Thanks for joining!`,
    html: emailBody,
  };

  await transporter.sendMail(emailOptions);
};
