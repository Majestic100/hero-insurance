/** Query parameters of the quote form (/tilbud). No React, safe anywhere. */

/** Current step id in the URL, so the browser back button works. */
export const STEP_PARAM = "trin";

/**
 * Preselects insurance types by slug. Accepts a comma list
 * (?forsikring=bil,hus) and repeated params (?forsikring=bil&forsikring=hus,
 * as a GET form with checkboxes sends them).
 */
export const PRESELECT_PARAM = "forsikring";

/**
 * Step value meaning "the step after the selection": used by the homepage
 * picker, where the user has already chosen. Falls back to the selection
 * step when nothing is selected.
 */
export const SKIP_SELECTION_STEP = "videre";
