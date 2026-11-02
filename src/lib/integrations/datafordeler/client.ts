import "server-only";

import { getDatafordelerEnv } from "@/lib/env/server";

/**
 * GraphQL client for Datafordeler (https://datafordeler.dk), the Danish
 * public registers. Server only: the API key must never reach the browser.
 *
 * The key is passed as `?apiKey=` (Datafordeler's GraphQL convention). A new
 * key can take 15 minutes or more to work everywhere.
 */

const BASE_URL = "https://graphql.datafordeler.dk";

/** Register versions in use. v1 no longer exists (404). */
export const DATAFORDELER_VERSIONS = { DAR: "v2", BBR: "v2" } as const;

export type DatafordelerRegister = keyof typeof DATAFORDELER_VERSIONS;

export class DatafordelerError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "DatafordelerError";
  }
}

/** True when the API key is configured. */
export function isDatafordelerConfigured(): boolean {
  return getDatafordelerEnv() !== undefined;
}

/**
 * Runs a GraphQL query. Throws DatafordelerError when not configured, on
 * HTTP errors, GraphQL errors or timeouts (5 s). Error messages contain no
 * user data and never the key.
 */
export async function datafordelerQuery<T>(
  register: DatafordelerRegister,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const env = getDatafordelerEnv();
  if (!env) {
    throw new DatafordelerError("Datafordeler is not configured");
  }

  const url = `${BASE_URL}/${register}/${DATAFORDELER_VERSIONS[register]}?apiKey=${encodeURIComponent(env.DATAFORDELER_API_KEY)}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
  } catch (error) {
    throw new DatafordelerError(
      `Datafordeler request failed: ${error instanceof Error ? error.name : "unknown"}`,
    );
  }

  if (!response.ok) {
    throw new DatafordelerError(`Datafordeler answered ${response.status}`, response.status);
  }
  const body = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (body.errors?.length || !body.data) {
    throw new DatafordelerError(
      `Datafordeler GraphQL error: ${body.errors?.[0]?.message ?? "no data"}`,
    );
  }
  return body.data;
}
