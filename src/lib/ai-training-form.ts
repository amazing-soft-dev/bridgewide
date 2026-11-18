import {
  emailField,
  fieldErrors,
  honeypotTripped,
  isRecord,
  limits,
  textField,
  type FieldResult,
} from "@/lib/form";
import {
  availabilities,
  englishLevels,
  experienceBands,
  formRegions,
  workTypes,
  type Availability,
  type EnglishLevel,
  type ExperienceBand,
  type TrainingFormRegionSlug,
  type WorkTypeSlug,
} from "@/content/ai-training";

export { emailField, fieldErrors, honeypotTripped, isRecord, limits, textField };

export function choiceField<T extends string>(
  value: unknown,
  allowed: readonly T[],
  error: string,
): FieldResult<T> {
  if (typeof value !== "string" || !allowed.includes(value.trim() as T)) {
    return { ok: false, error };
  }
  return { ok: true, value: value.trim() as T };
}

const regionSlugs = formRegions.map((region) => region.slug);
const workSlugs = workTypes.map((type) => type.slug);
const experienceSlugs = experienceBands.map((band) => band.value);
const englishSlugs = englishLevels.map((level) => level.value);
const availabilitySlugs = availabilities.map((item) => item.value);

export function trainingRegionField(value: unknown): FieldResult<TrainingFormRegionSlug> {
  return choiceField(value, regionSlugs, "Choose a region.");
}

export function workTypeField(value: unknown): FieldResult<WorkTypeSlug> {
  return choiceField(value, workSlugs, "Choose a kind of work.");
}

export function experienceField(value: unknown): FieldResult<ExperienceBand> {
  return choiceField(value, experienceSlugs, "Choose your experience.");
}

export function englishField(value: unknown): FieldResult<EnglishLevel> {
  return choiceField(value, englishSlugs, "Choose your English level.");
}

export function availabilityField(value: unknown): FieldResult<Availability> {
  return choiceField(value, availabilitySlugs, "Choose part-time or full-time.");
}

export function consentField(value: unknown): FieldResult<"yes"> {
  if (value !== "yes") {
    return {
      ok: false,
      error: "Confirm that your profile is shared only after you agree.",
    };
  }
  return { ok: true, value: "yes" };
}
