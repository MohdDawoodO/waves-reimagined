"use server";

import EmailTemplate from "@/components/email/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  email,
  subject,
  text,
  code,
  linkText,
  tokenLink,
}: {
  text: string;
  subject: string;
  email: string | "serious_17o@outlook.com";
  code?: string | undefined;
  linkText?: string | undefined;
  tokenLink?: string | undefined;
}) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: subject,
    react: EmailTemplate({ text, code, linkText, tokenLink }),
  });

  if (error) return console.log(error);

  console.log(data);
}
