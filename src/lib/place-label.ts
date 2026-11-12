/** Region labels that are just another spelling of a country. */
const regionAsCountry: Record<string, string> = {
  USA: "United States",
  Canada: "Canada",
};

/**
 * "Country (Region)", with the bracket left off when the region only repeats
 * the country: "Canada" and "United States", not "Canada (Canada)" or
 * "United States (USA)". A city goes in front: "Chicago, United States".
 */
export function placeLabel(country: string, region: string, city?: string): string {
  const repeats = (regionAsCountry[region] ?? region) === country;
  const place = repeats ? country : `${country} (${region})`;
  return city ? `${city}, ${place}` : place;
}
