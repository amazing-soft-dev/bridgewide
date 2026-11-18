"use client";

import Link from "next/link";
import { useState } from "react";
import { trainingRegion, type TrainingRegionSlug } from "@/content/ai-training";

const canadaZones = new Set([
  "America/Toronto",
  "America/Vancouver",
  "America/Winnipeg",
  "America/Edmonton",
  "America/Halifax",
  "America/St_Johns",
  "America/Regina",
  "America/Whitehorse",
  "America/Yellowknife",
  "America/Iqaluit",
  "America/Moncton",
  "America/Goose_Bay",
  "America/Glace_Bay",
  "America/Blanc-Sablon",
  "America/Atikokan",
  "America/Creston",
  "America/Dawson",
  "America/Dawson_Creek",
  "America/Fort_Nelson",
  "America/Inuvik",
  "America/Rankin_Inlet",
  "America/Resolute",
  "America/Swift_Current",
  "America/Cambridge_Bay",
  "America/Coral_Harbour",
  "America/Rainy_River",
  "America/Thunder_Bay",
  "America/Nipigon",
  "America/Pangnirtung",
]);

const latamZones = new Set([
  "America/Mexico_City",
  "America/Cancun",
  "America/Merida",
  "America/Monterrey",
  "America/Mazatlan",
  "America/Chihuahua",
  "America/Bahia_Banderas",
  "America/Hermosillo",
  "America/Matamoros",
  "America/Ojinaga",
  "America/Tijuana",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Punta_Arenas",
  "America/Sao_Paulo",
  "America/Bahia",
  "America/Belem",
  "America/Fortaleza",
  "America/Recife",
  "America/Maceio",
  "America/Noronha",
  "America/Santarem",
  "America/Araguaina",
  "America/Boa_Vista",
  "America/Campo_Grande",
  "America/Cuiaba",
  "America/Eirunepe",
  "America/Manaus",
  "America/Porto_Velho",
  "America/Rio_Branco",
  "America/Buenos_Aires",
  "America/Cordoba",
  "America/Salta",
  "America/Jujuy",
  "America/Tucuman",
  "America/Catamarca",
  "America/La_Rioja",
  "America/San_Juan",
  "America/Mendoza",
  "America/San_Luis",
  "America/Rio_Gallegos",
  "America/Ushuaia",
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Cordoba",
  "America/Argentina/Salta",
  "America/Argentina/Jujuy",
  "America/Argentina/Tucuman",
  "America/Argentina/Catamarca",
  "America/Argentina/La_Rioja",
  "America/Argentina/San_Juan",
  "America/Argentina/Mendoza",
  "America/Argentina/San_Luis",
  "America/Argentina/Rio_Gallegos",
  "America/Argentina/Ushuaia",
  "America/Argentina/ComodRivadavia",
  "America/Caracas",
  "America/La_Paz",
  "America/Montevideo",
  "America/Asuncion",
  "America/Guayaquil",
  "America/Guyana",
  "America/Paramaribo",
  "America/Cayenne",
  "America/Managua",
  "America/Panama",
  "America/Costa_Rica",
  "America/Guatemala",
  "America/Tegucigalpa",
  "America/El_Salvador",
  "America/Belize",
  "America/Havana",
  "America/Jamaica",
  "America/Port-au-Prince",
  "America/Santo_Domingo",
]);

const usaZones = new Set([
  "America/New_York",
  "America/Detroit",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Indiana/Indianapolis",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Vevay",
  "America/Chicago",
  "America/Indiana/Tell_City",
  "America/Indiana/Knox",
  "America/Menominee",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/North_Dakota/Beulah",
  "America/Denver",
  "America/Boise",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Juneau",
  "America/Sitka",
  "America/Metlakatla",
  "America/Yakutat",
  "America/Nome",
  "America/Adak",
  "Pacific/Honolulu",
  "America/Honolulu",
  "America/Puerto_Rico",
  "America/St_Thomas",
  "America/Virgin",
  "Pacific/Guam",
  "Pacific/Pago_Pago",
]);

function regionFromTimeZone(timeZone: string): TrainingRegionSlug | null {
  if (timeZone.startsWith("Europe/")) return "europe";
  if (timeZone.startsWith("Asia/")) return "asia";
  if (canadaZones.has(timeZone)) return "canada";
  if (latamZones.has(timeZone)) return "latam";
  if (usaZones.has(timeZone)) return "usa";
  return null;
}

export function RegionHint() {
  const [slug] = useState<TrainingRegionSlug | null>(() =>
    regionFromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone),
  );
  const [hidden, setHidden] = useState(false);

  if (!slug || hidden) return null;
  const region = trainingRegion(slug);
  if (!region) return null;

  return (
    <p className="border-b border-cloud-soft bg-cloud-soft">
      <span className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm text-ink">
        <span>Based in your time zone? See roles for you.</span>
        <Link
          href={`/ai-training/${region.slug}`}
          className="font-medium text-ink underline decoration-brand underline-offset-4"
        >
          {region.name}
        </Link>
        <button
          type="button"
          className="eyebrow-muted"
          onClick={() => setHidden(true)}
        >
          Dismiss
        </button>
      </span>
    </p>
  );
}
