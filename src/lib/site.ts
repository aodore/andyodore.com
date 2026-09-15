export const siteUrl = "https://andyodore.com";

export const siteName = "Andy O’Dore";

export const siteHeadline =
  "Great products start with curiosity and craft.";

/** Self-contained for crawlers: the homepage lede’s “either” only reads
    against the headline, so this spells curiosity and craft out. */
export const siteDescription =
  "I build systems and foundations that let organizations scale without losing curiosity or craft.";

export const siteEmail = "aodore@gmail.com";

export const siteSameAs = [
  "https://instagram.com/andyodore",
  "https://www.linkedin.com/in/andyodore/",
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export const personJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: siteName,
      url: siteUrl,
      jobTitle: "Lead Product Designer",
      worksFor: { "@type": "Organization", name: "Atlassian" },
      email: `mailto:${siteEmail}`,
      sameAs: [...siteSameAs],
    },
  ],
};
