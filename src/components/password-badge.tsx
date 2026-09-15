"use client";

import { LockIcon } from "@/components/brand";
import { useWorkGate } from "@/components/work-gate";

/** Cream chip from Figma node 58:3240. Sits on the photo like the card labels,
    so the fill and taupe stay put in both themes instead of following --ink. */
export function PasswordBadge() {
  const { unlocked } = useWorkGate();
  if (unlocked) return null;

  return (
    <span className="bg-label text-[var(--taupe)] absolute top-6 right-6 z-10 flex h-[42px] min-w-[42px] items-center justify-center rounded-full px-3 ring-1 ring-label ring-inset">
      <LockIcon className="size-4 shrink-0" />
      <span className="sr-only">Password protected. </span>
      <span
        aria-hidden
        className="max-w-0 overflow-hidden text-base leading-[1.4375] font-normal whitespace-nowrap opacity-0 group-hover:ml-1 group-hover:max-w-[147px] group-hover:opacity-100 group-focus-visible:ml-1 group-focus-visible:max-w-[147px] group-focus-visible:opacity-100 motion-safe:transition-[max-width,margin,opacity] motion-safe:duration-[400ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        Password protected
      </span>
    </span>
  );
}
