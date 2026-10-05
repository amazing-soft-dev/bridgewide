import { ImageResponse } from "next/og";
import { markPath, markViewBox } from "@/components/brand/mark";

export const size = {
  width: 180,
  height: 180,
};

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
          background: "#111111",
        }}
      >
        <svg width="132" height="79" viewBox={markViewBox} fill="#F30100">
          <path d={markPath} fill="#F30100" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
