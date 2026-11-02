/**
 * Parsing for the DAR postal code lookup. Pure, so it is unit tested.
 */

export const POSTAL_CODE_PATTERN = /^\d{4}$/;

export type DarPostnummerResponse = {
  DAR_Postnummer?: { nodes?: { postnr?: string | null; navn?: string | null }[] };
};

/**
 * The city name for a postal code, or undefined when unknown. DAR can
 * return several versions of the same postal code; they share the name.
 */
export function cityFromResponse(
  postalCode: string,
  data: DarPostnummerResponse,
): string | undefined {
  const names = (data.DAR_Postnummer?.nodes ?? [])
    .filter((node) => node.postnr === postalCode && node.navn)
    .map((node) => node.navn!.trim());
  return names[0] || undefined;
}
