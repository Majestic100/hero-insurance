import { ImageResponse } from "next/og";

/** Home screen icon on iPhone: the umbrella on the deep blue, like icon.svg. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
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
        <svg width="128" height="128" viewBox="0 0 100 100">
          <path d="M14 52 A36 36 0 0 1 86 52 Z" fill="#ffffff" />
          <path
            d="M50 52 V75 A8 8 0 0 1 34 75"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
