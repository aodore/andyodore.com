"use client";

import { useEffect, useState } from "react";
import { AboutRow } from "@/components/about-row";
import { Monogram } from "@/components/brand";
import { accents } from "@/lib/accent";
import {
  ACCENT_LOG_EVENT,
  emptyAccentLog,
  hydrateAccentLog,
  readAccentLog,
  type AccentLog,
} from "@/lib/accent-log";

function leadingCopy(log: AccentLog) {
  let max = 0;
  for (const accent of accents) {
    max = Math.max(max, log.counts[accent.name]);
  }
  if (max === 0) return null;
  const tied = accents.filter((accent) => log.counts[accent.name] === max);
  if (tied.length === 1) return `${tied[0].label} leads the way.`;
  if (tied.length === 2) {
    return `${tied[0].label} and ${tied[1].label} are tied.`;
  }
  const head = tied
    .slice(0, -1)
    .map((accent) => accent.label)
    .join(", ");
  return `${head}, and ${tied[tied.length - 1].label} are tied.`;
}

function changeExperience() {
  document.querySelector<HTMLButtonElement>(".home-monogram")?.click();
}

/** Running count of which palettes have been posted into the slot, kept on
    this device. Lives with the other home-page notes so the tally can grow
    each time someone picks again. */
export function AccentTally() {
  const [log, setLog] = useState<AccentLog>(emptyAccentLog);

  useEffect(() => {
    setLog(hydrateAccentLog());
    const sync = () => setLog(readAccentLog());
    window.addEventListener(ACCENT_LOG_EVENT, sync);
    return () => window.removeEventListener(ACCENT_LOG_EVENT, sync);
  }, []);

  const lead = leadingCopy(log);
  const ranked = [...accents].sort(
    (a, b) => log.counts[b.name] - log.counts[a.name],
  );

  return (
    <AboutRow label="The tally">
      <p>
        I knew you were curious, here&rsquo;s the experience tally.
        {lead ? ` ${lead}` : ""}{" "}
        <a
          href="#change-experience"
          className="hover:text-accent cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            changeExperience();
          }}
        >
          Want to change the experience?
        </a>
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {ranked.map((accent) => (
          <li
            key={accent.name}
            className={`accent-${accent.name} scheme-light flex items-center gap-3 rounded-full bg-white py-2 pr-4 pl-2`}
          >
            <Monogram className="size-16 sm:size-[72px] xl:size-[90px]" />
            <span className="text-[var(--espresso)] tabular-nums">
              {log.counts[accent.name]}
            </span>
            <span className="sr-only">{accent.label}</span>
          </li>
        ))}
      </ul>
    </AboutRow>
  );
}
