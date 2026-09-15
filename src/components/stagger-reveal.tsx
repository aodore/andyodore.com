"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Plays the Transitions.dev stagger once the first paint has landed, so
    the lines actually transition from their hidden state instead of
    appearing already shown. */
export function StaggerReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    el.querySelectorAll<HTMLElement>(".t-stagger-line").forEach((item, i) => {
      item.style.setProperty("--stagger-i", String(i));
    });

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      el.classList.add("is-shown");
    };

    // Two frames so the hidden state paints first. A timeout covers tabs
    // where requestAnimationFrame never runs (background, some previews),
    // which would otherwise leave the page blank except the header.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(show);
    });
    const fallback = window.setTimeout(show, 80);

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={root} className={className ? `t-stagger ${className}` : "t-stagger"}>
      {children}
    </div>
  );
}
