import "server-only";

import nodemailer from "nodemailer";

import { getSmtpEnv } from "@/lib/env/server";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

/** `error` is a short code, never personal data. */
export type EmailResult = { ok: true } | { ok: false; error: string };

/**
 * Sends one e-mail over SMTP with STARTTLS required, so a lead is never sent
 * unencrypted. Never throws. Accepted by the SMTP server counts as sent.
 */
export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const smtp = getSmtpEnv();
  if (!smtp) {
    return { ok: false, error: "smtp_not_configured" };
  }
  try {
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      requireTLS: smtp.port !== 465,
      auth: { user: smtp.user, pass: smtp.password },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
    const info = await transport.sendMail({
      from: smtp.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });
    return info.rejected.length > 0 ? { ok: false, error: "smtp_rejected" } : { ok: true };
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code: unknown }).code)
        : error instanceof Error
          ? error.name
          : "unknown";
    return { ok: false, error: `smtp_${code}`.slice(0, 60) };
  }
}
