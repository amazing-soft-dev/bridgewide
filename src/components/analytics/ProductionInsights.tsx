"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useSyncExternalStore } from "react";
import { privacyUrl } from "@/lib/analytics-privacy";

function doNotTrackEnabled() {
  return navigator.doNotTrack === "1";
}

function subscribe() {
  return () => {};
}

/**
 * Vercel Web Analytics and Speed Insights.
 * The root layout only renders this on the production Vercel deploy
 * (`VERCEL_ENV=production` and not a static export). Browsers that send
 * Do Not Track never load the scripts.
 */
export function ProductionInsights() {
  const blocked = useSyncExternalStore(subscribe, doNotTrackEnabled, () => true);

  if (blocked) return null;

  return (
    <>
      <Analytics mode="production" beforeSend={(event: BeforeSendEvent) => privacyUrl(event)} />
      <SpeedInsights beforeSend={(event) => privacyUrl(event)} />
    </>
  );
}
