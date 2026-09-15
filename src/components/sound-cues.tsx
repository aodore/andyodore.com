"use client";

import { bind, setVolume } from "cuelume";
import { useEffect } from "react";

/**
 * Wires up every `data-cuelume-*` attribute in the document, once. The
 * listeners are delegated from the document and resolved when an event fires,
 * so navigations and re-renders keep their sounds without a rebind.
 */
export function SoundCues() {
  useEffect(() => {
    setVolume(0.5);
    bind();
  }, []);

  return null;
}
