import { InstagramIcon, LinkedinIcon, MailIcon } from "@/components/brand";
import { linkCues, quietCues } from "@/lib/sound";

const socials = [
  { label: "Instagram", href: "https://instagram.com/andyodore", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/andyodore/", icon: LinkedinIcon },
  { label: "Email", href: "mailto:aodore@gmail.com", icon: MailIcon },
];

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-6 pt-[var(--back-to-top-clearance)] sm:flex-row sm:items-center sm:justify-between">
      <p className="t-stagger-line max-w-[1566px] text-xs leading-[1.46] xl:text-[13px]">
        © Andy O&rsquo;Dore 2026.
        <br />
        This telecast is copyrighted by the NFL for the private use of our
        audience. Any other use of this telecast or of any pictures,
        descriptions, or accounts of the game without the NFL&rsquo;s consent is
        prohibited. Just kidding.{" "}
        <a
          href="https://youtu.be/uirrNk0OFgU?t=10"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent underline-offset-[3px] transition-colors hover:underline"
          {...linkCues}
        >
          Go birds
        </a>
        .
      </p>
      <ul className="t-stagger-line flex items-center gap-[11px]">
        {socials.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              className="hover:text-accent block transition-colors"
              {...quietCues}
            >
              <Icon className="size-4" />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
