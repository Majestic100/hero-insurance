import { ImageResponse } from "next/og";

/** Home screen icon on iPhone: the house on the deep blue, like icon.svg. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#004a7c",
      }}
    >
      <svg width="124" height="124" viewBox="0 0 100 100">
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
    </div>,
    size,
  );
}
