import { randomUUID } from "crypto";
import db from "@/configs/db";
import { verificationTokens } from "@/db/users.schema";
import { sendVerificationEmail } from "./sendEmail";
import { eq } from "drizzle-orm";

export const generatePasswordResetVerificationToken = async (
  name: string,
  email: string
) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  try {
    const data = await db
      .update(verificationTokens)
      .set({
        email: email,
        passwordResetToken: token,
        passwordResetTokenExpires: expires,
      })
      .where(eq(verificationTokens.email, email))
      .returning();

    if (data[0].token) {
      const link = `https://burnamala.com/password_reset?token=${data[0].token}`;
      const head = `${name}, Please update your password by visiting the link below `;

      const emailSent = await sendVerificationEmail(email, link, head);

      if (emailSent) return true;
      else return false;
    }

    return false;
  } catch (error) {
    return false;
  }
};
