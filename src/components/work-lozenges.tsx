/** Ghost chips naming the kind of work. Small on the home cards, a step
    larger under the case-study meta line. */

const sizes = {
  card: {
    list: "flex flex-wrap gap-1.5",
    chip: "text-label rounded-md border border-label/50 px-2 py-0.5 text-[11px] leading-none",
  },
  page: {
    list: "flex flex-wrap gap-2",
    chip: "text-ink rounded-md border border-ink/35 px-2.5 py-1 text-sm leading-none",
  },
} as const;

export function WorkLozenges({
  tags,
  size = "card",
  className,
}: {
  tags: string[];
  size?: keyof typeof sizes;
  className?: string;
}) {
  const { list, chip } = sizes[size];

  return (
    <ul
      aria-label="Type of work"
      className={className ? `${list} ${className}` : list}
    >
      {tags.map((tag) => (
        <li key={tag} className={`${chip} whitespace-nowrap`}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
