import { ImageResponse } from "next/og";

import { SITE } from "@/config/site";

/**
 * The image shown when a page is shared (Facebook, Messenger, LinkedIn).
 * Brand colors from globals.css. Says what we do, makes no price claim.
 */
export const alt = `${SITE.name}: få tilbud på dine forsikringer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#293681",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>{SITE.name}</div>
        <div style={{ marginTop: 32, fontSize: 40, lineHeight: 1.3, color: "#d0e7e6" }}>
          Udfyld én formular, og få tilbud fra op til 3 forsikringsselskaber og -formidlere.
        </div>
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignSelf: "flex-start",
            padding: "18px 36px",
            borderRadius: 16,
            background: "#95ccdd",
            color: "#293681",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          Gratis og uforpligtende
        </div>
      </div>
    ),
    size,
  );
}
