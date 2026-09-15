"use client";

import { MoonIcon, SunIcon } from "@/components/brand";
import { quietCues } from "@/lib/sound";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function activeTheme() {
  const root = document.documentElement;
  if (root.classList.contains("theme-dark")) return "dark";
  if (root.classList.contains("theme-light")) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  function toggle() {
    const next = activeTheme() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${next}`);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage is unavailable in private mode; the class still applies.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-ink hover:bg-ink/8 group relative grid size-8 cursor-pointer place-items-center rounded-full transition-colors"
      {...quietCues}
    >
      <SunIcon className="theme-face-sun size-4" />
      <MoonIcon className="theme-face-moon text-muted size-4" />
      <span className="theme-face-sun sr-only">Switch to dark theme</span>
      <span className="theme-face-moon sr-only">Switch to light theme</span>
      {/* Flavor text only. The sr-only labels above stay the accessible name,
          so screen readers and voice control get the actual action. */}
      <span
        aria-hidden
        className="bg-ink text-canvas pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="theme-face-sun">Nighty night</span>
        <span className="theme-face-moon">Wake me up</span>
      </span>
    </button>
  );
}
