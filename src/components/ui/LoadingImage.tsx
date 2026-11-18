"use client";

import Image, { type ImageProps } from "next/image";
import { useImageLoaded } from "@/components/pages/use-image-loaded";
import { Skeleton } from "@/components/ui/Skeleton";

function sourceKey(src: ImageProps["src"]) {
  if (typeof src === "string") return src;
  return "default" in src ? src.default.src : src.src;
}

/**
 * A `fill` next/image with a shimmer behind it until the photo has loaded. The
 * parent must be positioned, as it already is for any `fill` image.
 */
export function LoadingImage({
  tone = "cloud",
  onLoad,
  alt,
  ...props
}: ImageProps & { tone?: "ink" | "cloud" }) {
  const { loaded, onLoad: markLoaded } = useImageLoaded(sourceKey(props.src));
  return (
    <>
      {loaded ? null : <Skeleton tone={tone} className="absolute inset-0" />}
      <Image
        {...props}
        alt={alt}
        onLoad={(event) => {
          markLoaded();
          onLoad?.(event);
        }}
      />
    </>
  );
}
