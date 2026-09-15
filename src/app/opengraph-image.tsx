import { ImageResponse } from "next/og";
import { monogramDataUri } from "@/lib/monogram";
import { siteDescription, siteName } from "@/lib/site";

export const alt = `${siteName}. ${siteDescription}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const src = await monogramDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fffdf4",
          color: "#2a170f",
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={src} width={128} height={128} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#776660",
              lineHeight: 1.35,
            }}
          >
            {siteDescription}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
