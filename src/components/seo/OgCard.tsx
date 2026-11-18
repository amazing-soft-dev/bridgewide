import { ImageResponse } from "next/og";
import { markPath, markViewBox } from "@/components/brand/mark";

/**
 * The shared Open Graph card. Routes with their own `opengraph-image.tsx`
 * call `ogCard` with the page's eyebrow, title, and one supporting line, so
 * a shared link shows the page and not only the brand.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const ink = "#111111";
const cloud = "#f4f0e8";
const brand = "#ec0000";
const stone = "#b9b1a4";

function titleSize(title: string) {
  if (title.length <= 28) return 88;
  if (title.length <= 48) return 68;
  if (title.length <= 72) return 54;
  return 44;
}

export function ogCard({
  eyebrow,
  title,
  line,
}: {
  eyebrow: string;
  title: string;
  line?: string;
}) {
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
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="84" height="50" viewBox={markViewBox} fill={brand}>
            <path d={markPath} fill={brand} />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.5, color: cloud }}>
            BridgeWide
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: brand,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: titleSize(title),
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.02,
              color: cloud,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          {line ? (
            <div style={{ fontSize: 28, lineHeight: 1.35, color: stone, maxWidth: 960 }}>{line}</div>
          ) : null}
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
