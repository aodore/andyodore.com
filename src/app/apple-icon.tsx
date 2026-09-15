import { ImageResponse } from "next/og";
import { monogramDataUri } from "@/lib/monogram";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const src = await monogramDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={src} width={180} height={180} />
      </div>
    ),
    { ...size },
  );
}
