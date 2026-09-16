import type { SoundName } from "cuelume";

/**
 * Everything interactive twinkles the same way on the way out; only the sound
 * under the cursor changes. Spread the result onto the element itself so
 * cuelume's `bind()` finds it.
 *
 * `toggle` is cuelume's click hook, not a statement about the element — it is
 * the only attribute that follows native activation, so it also covers Enter.
 */
function cues(hover: SoundName, click: SoundName = "sparkle") {
  return {
    "data-cuelume-hover": hover,
    "data-cuelume-toggle": click,
  } satisfies Record<string, SoundName>;
}

/** Links that lead somewhere: a warm swell under the cursor. */
export const linkCues = cues("bloom");

/** The small chrome — footer icons, the theme toggle — where a full bloom is
    too much for something you sweep past on the way somewhere else. */
export const quietCues = cues("whisper");

/** Close and dismiss: the refusal that says this is going away. */
export const dismissCues = cues("whisper", "error");

/** The one invitation in the header, so it gets the cue that resolves. */
export const helloCues = cues("ready");

/** The previous/next cards, whose click-clack suits stepping through the work
    one project at a time. The sound shares a name with the click attribute
    above by coincidence; the two are unrelated. */
export const navCues = cues("toggle");
