"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";
import { motionGate, useMediaQuery } from "@/hooks/use-media-query";
import { subscribeScrollFrame, trackProgress } from "@/hooks/scroll-frame";

/**
 * Scroll progress (0..1) of a tall track element with a sticky stage inside.
 *
 * `onProgress` runs in the shared frame's read phase; the function it returns
 * runs in the write phase. When the motion gate matches (narrow viewport or
 * reduced motion) the track is not measured and `onGated` runs once instead.
 * Returns `gated`, so callers can also switch markup.
 */
export function useTrackProgress(
  trackRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void | (() => void),
  onGated?: () => void,
) {
  const gated = useMediaQuery(motionGate);
  const measure = useEffectEvent((track: HTMLElement) => onProgress(trackProgress(track)));
  const settle = useEffectEvent(() => onGated?.());

  useEffect(() => {
    if (gated) {
      settle();
      return;
    }
    return subscribeScrollFrame(() => {
      const track = trackRef.current;
      if (!track) return;
      return measure(track);
    });
  }, [gated, trackRef]);

  return gated;
}
