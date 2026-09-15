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

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        el.classList.add("is-shown");
      });
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  return (
    <div ref={root} className={className ? `t-stagger ${className}` : "t-stagger"}>
      {children}
    </div>
  );
}
