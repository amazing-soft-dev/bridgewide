import { ImageResponse } from "next/og";
import { markPath, markViewBox } from "@/components/brand/mark";

export const alt =
  "BridgeWide. Hiring engineers across the USA, Canada, LATAM, and Europe.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const ink = "#111111";
const cloud = "#f4f0e8";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ink,
          color: cloud,
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="168" height="100" viewBox={markViewBox} fill={cloud}>
            <path d={markPath} fill={cloud} />
          </svg>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1,
              color: cloud,
            }}
          >
            BridgeWide
          </div>
        </div>
        <div
          style={{
            fontSize: 36,
            lineHeight: 1.3,
            color: "#f4f0e8",
            maxWidth: 860,
          }}
        >
          Hiring engineers across the USA, Canada, LATAM, and Europe.
        </div>
      </div>
    ),
    { ...size },
  );
}
