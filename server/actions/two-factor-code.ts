"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { twoFactorCodes } from "../schema";
import { sendEmail } from "./email";

export async function generateVerificationCode(email: string) {
  const code = Math.floor(Math.random() * 899999 + 100000).toString();
  const date = new Date();
  date.setMinutes(date.getMinutes() + 1);
  const expires = date;

  const newCode = await db
    .insert(twoFactorCodes)
    .values({
      email,
      code,
      expires,
    })
    .returning();

  return newCode[0].code;
}

export async function SendTwoFactorCodeEmail(email: string) {
  const existingCode = await db.query.twoFactorCodes.findFirst({
    where: eq(twoFactorCodes.email, email),
  });

  if (!existingCode || existingCode.expires < new Date()) {
    await db.delete(twoFactorCodes).where(eq(twoFactorCodes.email, email));

    const newTwoFactorCode = await generateVerificationCode(email);

    await sendEmail({
      email: email,
      subject: "Waves Music - Verification Email",
      text: "Your verification code",
      code: newTwoFactorCode,
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
