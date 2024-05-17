"use server";

import { EmailTemplate } from "@/components/Email_Template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 *
 * Send email verification mail to new users!
 *
 * @param email Email of the user
 * @param link Verification link
 * @param header Email Template Header
 * @returns true if successful
 */
export async function sendVerificationEmail(
  email: string,
  link: string,
  header: string
) {
  try {
    const data = await resend.emails.send({
      from: "DAART <onboarding@resend.dev>",
      to: [email],
      subject: "Email Verification !",
      react: EmailTemplate({ header: header, verificationLink: link }),
    });

    return true;
  } catch (error) {
    return null;
  }
}
