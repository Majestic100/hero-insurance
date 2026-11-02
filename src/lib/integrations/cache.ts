/**
 * A small in-memory cache with expiry, for register answers that rarely
 * change. Per server instance, so it only saves calls; never rely on it.
 */
export function createTtlCache<V>(ttlMs: number, maxEntries = 1000) {
  const entries = new Map<string, { value: V; expires: number }>();
  return {
    get(key: string): V | undefined {
      const entry = entries.get(key);
      if (!entry) {
        return undefined;
      }
      if (entry.expires <= Date.now()) {
        entries.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key: string, value: V): void {
      if (entries.size >= maxEntries) {
        // Drop the oldest entry (Maps keep insertion order).
        const oldest = entries.keys().next().value;
        if (oldest !== undefined) {
          entries.delete(oldest);
        }
      }
      entries.set(key, { value, expires: Date.now() + ttlMs });
    },
  };
}
