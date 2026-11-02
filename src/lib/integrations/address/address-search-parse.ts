/**
 * Parsing for the DAR address search. Pure, so it is unit tested.
 */

export const ADDRESS_QUERY_MIN_LENGTH = 3;
export const ADDRESS_QUERY_MAX_LENGTH = 80;
export const ADDRESS_SUGGESTION_LIMIT = 8;
export const DAR_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AddressSuggestion = {
  /** DAR husnummer id, used for the BBR lookup. */
  id: string;
  /** E.g. "Strandvejen 100, 2900 Hellerup". */
  text: string;
};

export type DarHusnummerResponse = {
  DAR_Husnummer?: {
    nodes?: { id_lokalId?: string | null; adgangsadressebetegnelse?: string | null }[];
  };
};

/** Trimmed, single spaces; undefined when too short or too long. */
export function normalizeAddressQuery(query: string): string | undefined {
  const normalized = query.replace(/\s+/g, " ").trim();
  return normalized.length >= ADDRESS_QUERY_MIN_LENGTH &&
    normalized.length <= ADDRESS_QUERY_MAX_LENGTH
    ? normalized
    : undefined;
}

const upperFirst = (word: string) =>
  word.charAt(0).toLocaleUpperCase("da-DK") + word.slice(1);

/** House number letters are uppercase in DAR: "100a" -> "100A". */
const upperHouseLetters = (text: string) =>
  text.replace(/(\d)([a-zæøå])(?=$|[\s,])/g, (_, digit: string, letter: string) =>
    digit + letter.toLocaleUpperCase("da-DK"),
  );

/**
 * DAR's search is case sensitive and only matches the start of the address,
 * so we try the likely spellings: as typed, first letter capitalized, and
 * every word capitalized ("gammel kongevej 1" -> "Gammel Kongevej 1").
 */
export function casingVariants(query: string): string[] {
  const variants = [
    query,
    upperFirst(query),
    query.toLocaleLowerCase("da-DK").split(" ").map(upperFirst).join(" "),
  ].map(upperHouseLetters);
  return [...new Set(variants)];
}

/** Suggestions from all variant answers, without duplicates, in order. */
export function mergeSuggestions(
  responses: readonly DarHusnummerResponse[],
  limit = ADDRESS_SUGGESTION_LIMIT,
): AddressSuggestion[] {
  const byId = new Map<string, AddressSuggestion>();
  for (const response of responses) {
    for (const node of response.DAR_Husnummer?.nodes ?? []) {
      const id = node.id_lokalId;
      const text = node.adgangsadressebetegnelse?.trim();
      if (id && text && !byId.has(id)) {
        byId.set(id, { id, text });
      }
    }
  }
  return [...byId.values()].slice(0, limit);
}
