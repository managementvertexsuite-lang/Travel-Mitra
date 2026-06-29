import { destinations } from "../data/destinations";

export const CATEGORY_TABS = [
  { id: "search", label: "Search", isSearch: true },
  { id: "honeymoon", label: "Honeymoon", emoji: "🌅" },
  { id: "visa-free", label: "Visa Free Packages", emoji: "🛂" },
  { id: "group-tour", label: "Group Tour Packages", emoji: "👥" },
  { id: "disney-cruise", label: "Disney Cruise", emoji: "🚢" },
  { id: "last-minute", label: "Last Minute Deals", emoji: "🏝️" },
];

const CATEGORY_PACKAGE_CONFIG = {
  honeymoon: {
    packages: [
      { name: "Romantic Bali Honeymoon", dest: "Bali", days: 6, nights: 5, price: 65000 },
      { name: "Maldives Overwater Escape", dest: "Maldives", days: 5, nights: 4, price: 95000 },
      { name: "Goa Beach Romance", dest: "Goa", days: 4, nights: 3, price: 32000 },
      { name: "Kerala Backwaters Couple Retreat", dest: "Kerala", days: 5, nights: 4, price: 48000 },
      { name: "Dubai Luxury Honeymoon", dest: "Dubai", days: 5, nights: 4, price: 78000 },
      { name: "Manali Snow Romance", dest: "Manali", days: 5, nights: 4, price: 42000 },
      { name: "Paris & Swiss Honeymoon", dest: "Europe", days: 8, nights: 7, price: 185000 },
      { name: "Andaman Island Paradise", dest: "Andaman", days: 5, nights: 4, price: 55000 },
    ],
    highlights: ["Private Candlelight Dinner", "Couple Spa Session", "Sunset Cruise", "Room Decoration"],
  },
  "visa-free": {
    packages: [
      { name: "Thailand Visa Free Getaway", dest: "Thailand", days: 5, nights: 4, price: 35000 },
      { name: "Mauritius No Visa Holiday", dest: "Mauritius", days: 6, nights: 5, price: 72000 },
      { name: "Nepal Visa Free Trek", dest: "Nepal", days: 5, nights: 4, price: 28000 },
      { name: "Bhutan Visa Free Discovery", dest: "Bhutan", days: 6, nights: 5, price: 58000 },
      { name: "Maldives Visa Free Escape", dest: "Maldives", days: 4, nights: 3, price: 88000 },
      { name: "Sri Lanka Visa Free Tour", dest: "Sri Lanka", days: 5, nights: 4, price: 38000 },
      { name: "Indonesia Visa Free Bali", dest: "Bali", days: 5, nights: 4, price: 42000 },
      { name: "Seychelles Visa Free Beach", dest: "Seychelles", days: 6, nights: 5, price: 92000 },
    ],
    highlights: ["No Visa Hassle", "Quick Documentation", "All-Inclusive Stay", "Guided Tours"],
  },
  "group-tour": {
    packages: [
      { name: "Europe Group Explorer", dest: "Europe", days: 10, nights: 9, price: 145000 },
      { name: "Bali Group Adventure", dest: "Bali", days: 6, nights: 5, price: 38000 },
      { name: "Dubai Group Tour", dest: "Dubai", days: 5, nights: 4, price: 52000 },
      { name: "Kashmir Group Getaway", dest: "Jammu & Kashmir", days: 6, nights: 5, price: 35000 },
      { name: "Thailand Group Fun", dest: "Thailand", days: 5, nights: 4, price: 32000 },
      { name: "Singapore Group Tour", dest: "Singapore", days: 4, nights: 3, price: 48000 },
      { name: "Himachal Group Trek", dest: "Manali", days: 6, nights: 5, price: 29000 },
      { name: "South India Group Heritage", dest: "Kerala", days: 7, nights: 6, price: 42000 },
    ],
    highlights: ["Dedicated Tour Manager", "Group Discounts", "Fixed Departures", "Shared Experiences"],
  },
  "disney-cruise": {
    packages: [
      { name: "Disney Caribbean Cruise", dest: "Caribbean", days: 7, nights: 6, price: 165000 },
      { name: "Disney Mediterranean Voyage", dest: "Mediterranean", days: 8, nights: 7, price: 195000 },
      { name: "Disney Alaska Adventure Cruise", dest: "Alaska", days: 7, nights: 6, price: 175000 },
      { name: "Disney Bahamas Family Cruise", dest: "Bahamas", days: 4, nights: 3, price: 125000 },
      { name: "Disney Northern Europe Cruise", dest: "Europe", days: 9, nights: 8, price: 210000 },
      { name: "Disney Halloween Cruise Special", dest: "Caribbean", days: 5, nights: 4, price: 138000 },
    ],
    highlights: ["Disney Character Meet & Greet", "Onboard Entertainment", "Kids Club Access", "All Meals Included"],
  },
  "last-minute": {
    packages: [
      { name: "Goa Flash Sale Package", dest: "Goa", days: 3, nights: 2, price: 18999 },
      { name: "Dubai Last Minute Deal", dest: "Dubai", days: 4, nights: 3, price: 45000 },
      { name: "Manali Weekend Escape", dest: "Manali", days: 3, nights: 2, price: 15999 },
      { name: "Bali Spontaneous Getaway", dest: "Bali", days: 4, nights: 3, price: 38000 },
      { name: "Shimla Last Minute Trip", dest: "Shimla", days: 3, nights: 2, price: 14999 },
      { name: "Kerala Quick Retreat", dest: "Kerala", days: 4, nights: 3, price: 24999 },
      { name: "Darjeeling Flash Deal", dest: "Darjeeling", days: 3, nights: 2, price: 16999 },
      { name: "Ooty Last Minute Holiday", dest: "Ooty", days: 3, nights: 2, price: 13999 },
    ],
    highlights: ["Instant Confirmation", "Limited Time Offer", "Best Price Guarantee", "Flexible Dates"],
  },
};

const DEFAULT_INCLUSIONS = [
  "4-Star Hotel",
  "Daily Breakfast",
  "Airport Transfers",
  "Sightseeing Tours",
  "Professional Guide",
];

function collectGalleryImages() {
  return destinations.flatMap((d) => d.gallery || [d.coverImage]).filter(Boolean);
}

export function getPackagesForCategory(categoryId, duration) {
  const config = CATEGORY_PACKAGE_CONFIG[categoryId];
  if (!config) return [];

  const gallery = collectGalleryImages();
  const durationInNights = duration ? Math.max(1, duration - 1) : null;

  return config.packages.map((pkg, idx) => {
    const nights = durationInNights ?? pkg.nights;
    const days = duration ?? pkg.days;

    return {
      id: `${categoryId}_PKG_${idx + 1}`,
      name: pkg.name,
      destination: pkg.dest,
      price: pkg.price,
      originalPrice: Math.round(pkg.price * 1.35),
      rating: parseFloat((4.4 + (idx % 5) * 0.1).toFixed(1)),
      reviews: 200 + idx * 45,
      duration: days,
      nights,
      image: gallery[idx % gallery.length] || "",
      itinerary: `${nights}N ${pkg.dest}`,
      inclusions: DEFAULT_INCLUSIONS,
      highlights: config.highlights,
      gallery: gallery.slice(idx, idx + 5),
    };
  });
}
