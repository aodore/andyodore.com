export function AboutRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-y-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] lg:gap-x-10 xl:grid-cols-[516px_minmax(0,900px)] xl:gap-x-0">
      <h2 className="t-stagger-line text-accent text-lg leading-tight font-medium xl:text-2xl">
        {label}
      </h2>
      <div className="t-stagger-line text-[17px] leading-relaxed md:text-xl xl:text-[26px] xl:leading-[1.385]">
        {children}
      </div>
    </section>
  );
}
