"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { verificationTokens } from "../schema";
import { sendEmail } from "./email";

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const date = new Date();
  date.setHours(date.getHours() + 1);
  const expires = date;

  const newToken = await db
    .insert(verificationTokens)
    .values({
      email,
      expires,
      token,
    })
    .returning();

  return newToken[0].token;
}

export async function checkVerificationToken(email: string, password: string) {
  const existingToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.email, email),
  });

  if (!existingToken || existingToken.expires < new Date()) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));

    const newVerificationToken = await generateVerificationToken(email);

    await sendEmail({
      email: email,
      subject: "Waves Music - Verification Email",
      text: "Click the link below to",
      linkText: "Verify your email",
      tokenLink: `http://localhost:3000/auth/verify?email=${email}&password=${password}&token=${newVerificationToken}`,
    });
    return;
  }

  await sendEmail({
    email: email,
    subject: "Waves Music - Verification Email",
    text: "Click the link below to",
    linkText: "Verify your email",
    tokenLink: `http://localhost:3000/auth/verify?email=${email}&password=${password}&token=${existingToken.token}`,
  });
  return;
}
