/**
 * The five monograms on the entry (Figma nodes 89:6107 and 89:6173) and the
 * palette each one hands the rest of the site. Four of them are hues the case
 * studies already own; ember is the entry's own.
 *
 * The palettes themselves live in `globals.css` as `html.accent-*` classes,
 * so a choice is one class on the document root and every semantic slot
 * follows. The light/dark toggle is untouched by all of this: a monogram
 * picks the hue, the sun/moon still picks the time of day.
 */

export const ACCENT_STORAGE_KEY = "accent";

export type AccentName = "amber" | "ember" | "meadow" | "rose" | "tide";

export type Accent = {
  name: AccentName;
  /** Names the choice for screen readers and voice control. */
  label: string;
};

/**
 * Document order is the seating order: the first monogram takes twelve
 * o'clock and the rest follow clockwise, 72 degrees apart, matching the
 * design's pentagon.
 */
export const accents = [
  { name: "amber", label: "Amber" },
  { name: "ember", label: "Ember" },
  { name: "meadow", label: "Meadow" },
  { name: "rose", label: "Rose" },
  { name: "tide", label: "Tide" },
] as const satisfies readonly Accent[];

const names = new Set<string>(accents.map((accent) => accent.name));

export function isAccentName(value: string): value is AccentName {
  return names.has(value);
}

const pattern = accents.map((accent) => accent.name).join("|");

/**
 * Runs in the document head before first paint, alongside the theme script.
 *
 * A stored choice becomes the palette class and that is all. No stored choice
 * raises the entry instead, which is the only reason the gate never flashes
 * the home page behind it. Two consequences worth knowing: a visitor without
 * JavaScript goes straight to the home page, and so does anyone arriving on
 * an `?unlock=` link, since they came for a case study and the password
 * dialog would otherwise open on the top layer above the entry.
 */
export const accentScript = `try{var a=localStorage.getItem("${ACCENT_STORAGE_KEY}");var r=document.documentElement;if(/^(${pattern})$/.test(a||""))r.classList.add("accent-"+a);else if(!/[?&]unlock=/.test(location.search))r.classList.add("entry-pending")}catch(e){}`;

/** The header monogram fires this when a visitor wants to pick again. First
    the home page staggers off (`entry-leaving`); then this event raises the
    gate. The accent class stays until cream has covered the themed page. */
export const ENTRY_REOPEN_EVENT = "entry:reopen";

/** Marks the home page as staggering out. The overlay stays down until
    that motion (and the header mark flying off) has finished. */
export function leaveHome() {
  document.documentElement.classList.add("entry-leaving");
}

export function reopenEntry() {
  try {
    localStorage.removeItem(ACCENT_STORAGE_KEY);
  } catch {
    // Private mode still gets a fresh choice; it just will not persist.
  }
  const root = document.documentElement;
  root.classList.remove("entry-revealed", "entry-leaving");
  root.classList.add("entry-pending");
  window.dispatchEvent(new Event(ENTRY_REOPEN_EVENT));
}
