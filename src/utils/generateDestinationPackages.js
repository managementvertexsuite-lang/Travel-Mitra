import { packages } from "../data/packages";
import { findDestination, resolveDestinationId } from "./destinationUtils";

const PACKAGE_TEMPLATES = [
  {
    prefix: "Ultimate",
    suffix: "Romance Escape",
    days: 6,
    nights: 5,
    minBudget: 40000,
    maxBudget: 95000,
    ratingOffset: 0,
  },
  {
    prefix: "Family",
    suffix: "Adventure",
    days: 7,
    nights: 6,
    minBudget: 45000,
    maxBudget: 105000,
    ratingOffset: 0.1,
  },
  {
    prefix: "Solo Traveler's",
    suffix: "Paradise",
    days: 5,
    nights: 4,
    minBudget: 50000,
    maxBudget: 115000,
    ratingOffset: 0.2,
  },
  {
    prefix: "Luxury",
    suffix: "Honeymoon",
    days: 6,
    nights: 5,
    minBudget: 55000,
    maxBudget: 125000,
    ratingOffset: 0.1,
  },
  {
    prefix: "",
    suffix: "Beach & Culture Blend",
    days: 5,
    nights: 4,
    minBudget: 38000,
    maxBudget: 88000,
    ratingOffset: 0,
  },
  {
    prefix: "Adventure Seeker's",
    suffix: "Quest",
    days: 6,
    nights: 5,
    minBudget: 42000,
    maxBudget: 98000,
    ratingOffset: 0.15,
  },
  {
    prefix: "Wellness & Spa",
    suffix: "Retreat",
    days: 5,
    nights: 4,
    minBudget: 48000,
    maxBudget: 110000,
    ratingOffset: 0.05,
  },
  {
    prefix: "",
    suffix: "Hidden Gems Tour",
    days: 6,
    nights: 5,
    minBudget: 36000,
    maxBudget: 82000,
    ratingOffset: 0,
  },
  {
    prefix: "Budget",
    suffix: "Explorer",
    days: 4,
    nights: 3,
    minBudget: 25000,
    maxBudget: 55000,
    ratingOffset: -0.1,
  },
  {
    prefix: "Premium",
    suffix: "Experience",
    days: 7,
    nights: 6,
    minBudget: 60000,
    maxBudget: 140000,
    ratingOffset: 0.2,
  },
];

const DEFAULT_INCLUSIONS = [
  "4-Star Hotel",
  "Daily Breakfast",
  "Airport Transfers",
  "Sightseeing Tours",
  "Professional Guide",
];

function buildPackageName(template, destName) {
  if (template.prefix && template.suffix === "Retreat") {
    return `${template.prefix} ${template.suffix}`;
  }
  if (template.prefix === "Budget" || template.prefix === "Premium") {
    return `${template.prefix} ${destName} ${template.suffix}`;
  }
  if (template.prefix) {
    return `${template.prefix} ${destName} ${template.suffix}`;
  }
  return `${destName} ${template.suffix}`;
}

function generateFromDestination(dest, duration) {
  const destName = dest.name;
  const gallery = dest.gallery?.length ? dest.gallery : [dest.coverImage].filter(Boolean);
  const highlights = dest.popularActivities?.length
    ? dest.popularActivities
    : ["Sightseeing", "Local Culture", "Adventure Activities"];

  const durationInNights = duration ? Math.max(1, duration - 1) : null;

  return PACKAGE_TEMPLATES.map((template, idx) => {
    const image = gallery[idx % gallery.length] || dest.coverImage || "";
    const nights = durationInNights ?? template.nights;
    const days = duration ?? template.days;

    return {
      id: `${dest.destinationId}_PKG_${idx + 1}`,
      name: buildPackageName(template, destName),
      destination: destName,
      price: template.minBudget,
      originalPrice: template.maxBudget,
      rating: Math.min(
        5,
        parseFloat((dest.averageRating + template.ratingOffset).toFixed(1)),
      ),
      reviews: dest.totalReviews - idx * 50,
      duration: days,
      nights,
      image,
      itinerary: `${nights}N ${destName}`,
      inclusions: DEFAULT_INCLUSIONS,
      highlights: highlights.slice(0, 5),
      gallery,
      flightIncluded: idx % 2 === 0,
      hotelCategory: idx % 5 === 3 ? 5 : idx % 3 === 0 ? 4 : 3,
      themes: [template.suffix, ...highlights].join(" ").toLowerCase(),
    };
  });
}

export function getPackagesForDestination(destination, duration) {
  const destId = resolveDestinationId(destination);
  const destRecord = findDestination(destination);
  const cityName = destination?.city || destRecord?.name || "Bali";

  let basePackages = packages.filter((pkg) => pkg.destinationId === destId);

  if (basePackages.length === 0 && destRecord) {
    return generateFromDestination(destRecord, duration);
  }

  if (basePackages.length === 0) {
    basePackages = packages;
  }

  const durationInNights = duration ? Math.max(1, duration - 1) : null;

  return basePackages.map((pkg, idx) => ({
    id: pkg.packageId || idx + 1,
    name: pkg.packageName,
    destination: cityName,
    price: pkg.minBudget,
    originalPrice: pkg.maxBudget,
    rating: pkg.rating,
    reviews: pkg.totalReviews,
    duration: duration || pkg.durationDays,
    nights: durationInNights ?? pkg.durationNights,
    image: pkg.coverImage || pkg.gallery?.[0] || "",
    itinerary: `${durationInNights ?? pkg.durationNights}N ${cityName}`,
    inclusions: pkg.inclusions || DEFAULT_INCLUSIONS,
    highlights: pkg.highlights || [],
    gallery: pkg.gallery || [],
    flightIncluded: idx % 2 === 0,
    hotelCategory: idx % 5 === 3 ? 5 : idx % 3 === 0 ? 4 : 3,
    themes: [pkg.category, ...(pkg.tags || []), ...(pkg.highlights || [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  }));
}
