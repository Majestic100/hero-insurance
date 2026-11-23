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
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#004a7c",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="104" height="104" viewBox="0 0 100 100">
          <defs>
            <mask id="tick">
              <rect width="100" height="100" fill="#fff" />
              <path
                d="M41 64 L47.5 70.5 L59.5 58.5"
                fill="none"
                stroke="#000"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          <path
            d="M7 49 L50 12 L93 49"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 46 V79 A7 7 0 0 0 28 86 H72 A7 7 0 0 0 79 79 V46"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.55"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="64" r="16" fill="#ffffff" mask="url(#tick)" />
        </svg>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          {SITE.name}
        </div>
      </div>
      <div
        style={{
          marginTop: 32,
          fontSize: 40,
          lineHeight: 1.3,
          color: "#e8f1f5",
        }}
      >
        Udfyld én formular, og få tilbud fra op til 3 forsikringsselskaber og
        -formidlere.
      </div>
      <div
        style={{
          marginTop: 56,
          display: "flex",
          alignSelf: "flex-start",
          padding: "18px 36px",
          borderRadius: 16,
          background: "#e8f1f5",
          color: "#004a7c",
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        Gratis og uforpligtende
      </div>
    </div>,
    size,
  );
}
