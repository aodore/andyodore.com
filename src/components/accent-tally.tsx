"use client";

import { useEffect, useState } from "react";
import { AboutRow } from "@/components/about-row";
import { Monogram } from "@/components/brand";
import { accents, changeExperience } from "@/lib/accent";
import { hydrateAccentLog, TALLY_EVENT } from "@/lib/accent-log";
import { type Tally, type TallyCounts } from "@/lib/tally";

function leadingCopy(counts: TallyCounts) {
  let max = 0;
  for (const accent of accents) {
    max = Math.max(max, counts[accent.name]);
  }
  if (max === 0) return null;
  const tied = accents.filter((accent) => counts[accent.name] === max);
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

/** Sitewide running count of colors posted into the slot. Every drop adds
    one, including picking again. */
export function AccentTally({
  initialCounts,
}: {
  initialCounts: TallyCounts;
}) {
  const [counts, setCounts] = useState<TallyCounts>(initialCounts);

  useEffect(() => {
    const apply = (tally: Tally) => setCounts(tally.counts);
    const sync = (event: Event) => {
      if (event instanceof CustomEvent && event.detail?.counts) {
        apply(event.detail as Tally);
      }
    };
    window.addEventListener(TALLY_EVENT, sync);
    void hydrateAccentLog().then((tally) => apply(tally));
    return () => window.removeEventListener(TALLY_EVENT, sync);
  }, []);

  const lead = leadingCopy(counts);
  const ranked = [...accents].sort(
    (a, b) => counts[b.name] - counts[a.name],
  );

  return (
    <AboutRow label="The tally">
      <p>
        I knew you were curious, here&rsquo;s the experience tally.
        {lead ? ` ${lead}` : ""}{" "}
        <a
          href="#change-experience"
          className="cursor-pointer font-semibold hover:text-accent"
          onClick={(event) => {
            event.preventDefault();
            changeExperience();
          }}
        >
          Want to change it?
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
              {counts[accent.name]}
            </span>
            <span className="sr-only">{accent.label}</span>
          </li>
        ))}
      </ul>
    </AboutRow>
  );
}
