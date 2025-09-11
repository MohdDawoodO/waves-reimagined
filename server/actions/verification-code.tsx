"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { verificationCodes } from "../schema";
import { sendEmail } from "./email";

export async function generateVerificationCode(email: string) {
  const code = Math.floor(
    Math.random() * (999999 - 100000) + 100000
  ).toString();
  const date = new Date();
  date.setHours(date.getMinutes() + 1);
  const expires = date;

  const newVerificationCode = await db
    .insert(verificationCodes)
    .values({
      email,
      code,
      expires,
    })
    .returning();

  return newVerificationCode[0].code;
}

export async function checkVerificationCode(email: string, password: string) {
  const existingCode = await db.query.verificationCodes.findFirst({
    where: eq(verificationCodes.email, email),
  });

  if (!existingCode || existingCode.expires < new Date()) {
    await db
      .delete(verificationCodes)
      .where(eq(verificationCodes.email, email));

    const newVerificationCode = await generateVerificationCode(email);

    await sendEmail({
      email: email,
      subject: "Waves Music - Verification Email",
      text: "Your verification code",
      code: newVerificationCode,
    });
    return;
  }

  await sendEmail({
    email: email,
    subject: "Waves Music - Verification Email",
    text: "Your verification code",
    code: existingCode.code,
  });
  return;
}
