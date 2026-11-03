import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signing of deliveries, so a partner can check that a lead came from us
 * and was not changed or replayed. Server only (node:crypto). Pure apart
 * from the clock, which is passed in, so it is unit tested.
 *
 * Header: `X-Lead-Signature: t=<unix seconds>,v1=<hex>`, where v1 is
 * HMAC-SHA256 of `<t>.<raw body>` with the partner's webhook secret. The
 * partner recomputes it and rejects old timestamps (we suggest 5 minutes).
 */

export const SIGNATURE_HEADER = "X-Lead-Signature";

function hmac(secret: string, timestamp: number, body: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

export function signDelivery(secret: string, body: string, now: Date): string {
  const timestamp = Math.floor(now.getTime() / 1000);
  return `t=${timestamp},v1=${hmac(secret, timestamp, body)}`;
}

/**
 * What a partner does on their side; here for tests and as a reference
 * implementation in the partner documentation.
 */
export function verifyDeliverySignature(
  secret: string,
  body: string,
  header: string,
  now: Date,
  toleranceSeconds = 300,
): boolean {
  const parts = Object.fromEntries(
    header.split(",").map((part) => part.trim().split("=", 2)),
  );
  const timestamp = Number(parts.t);
  if (!Number.isInteger(timestamp) || typeof parts.v1 !== "string") {
    return false;
  }
  if (Math.abs(now.getTime() / 1000 - timestamp) > toleranceSeconds) {
    return false;
  }
  const expected = Buffer.from(hmac(secret, timestamp, body), "hex");
  const actual = Buffer.from(parts.v1, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
