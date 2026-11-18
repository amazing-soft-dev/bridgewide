"use client";

import { useCallback, useState } from "react";

/** True once `src` has fired its load event. A new `src` starts unloaded again. */
export function useImageLoaded(src: string) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const onLoad = useCallback(() => setLoadedSrc(src), [src]);
  return { loaded: loadedSrc === src, onLoad };
}
