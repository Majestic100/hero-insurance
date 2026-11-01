import type { FormValues } from "./step-sequence";

/**
 * Keeps the user's answers in sessionStorage, so a reload or an
 * interrupted visit does not lose them. sessionStorage is per tab and is
 * cleared when the tab closes. Drafts from another config version are
 * discarded. Contact data must not be stored here (decided in module 4).
 */

const STORAGE_KEY = "hero-insurance:form-draft";

type Draft = { version: string; values: FormValues };

export function loadDraft(version: string): FormValues | undefined {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    const draft = JSON.parse(raw) as Draft;
    return draft.version === version ? draft.values : undefined;
  } catch {
    return undefined;
  }
}

export function saveDraft(version: string, values: FormValues): void {
  try {
    const draft: Draft = { version, values };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Storage can be full or blocked (private mode). The form still works.
  }
}

export function clearDraft(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore: nothing to clear.
  }
}
