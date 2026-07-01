import { destinations } from "../data/destinations";

export const MEGA_MENU_DATA = {
  honeymoon: {
    headline: "Travel Mitra Honeymoon Packages",
    col1: ["Seychelles", "Europe", "Thailand", "Mauritius", "Vietnam"],
    col2: ["North East", "South India", "Andaman", "Goa", "Kerala"],
    featured: ["Bali", "Maldives", "Manali"],
  },
  "visa-free": {
    headline: "Dream Destinations, Zero Paperwork!",
    col1: ["Malaysia", "Hong Kong", "Bhutan", "Mauritius", "Seychelles"],
    col2: ["Kazakhstan", "Qatar", "Nepal"],
    featured: ["Maldives", "Thailand", "Sri Lanka"],
  },
  "group-tour": {
    headline: "Expertly Planned Group Tours",
    col1: ["Europe", "Japan", "New Zealand", "South Africa", "Singapore"],
    col2: ["Char Dham", "Kashmir", "Vietnam", "Ladakh", "Thailand"],
    featured: ["Kashmir", "Bali", "Dubai"],
  },
  "disney-cruise": {
    headline: "Book Your Sailings Now!",
    col1: ["Short Cruise 3N", "Epic Cruise 4N", "Disney Voyage 5N", "Disney Cruise 6N", "Grand Cruise 7N"],
    col2: ["Majestic Cruise 8N"],
    featured: ["Caribbean", "Europe"],
  },
  "last-minute": {
    headline: "Flash Deals - Book Now!",
    col1: ["Goa", "Dubai", "Manali", "Bali", "Shimla"],
    col2: ["Kerala", "Darjeeling", "Ooty"],
    featured: ["Goa", "Dubai", "Manali"],
  },
};

const FEATURED_IMAGE_FALLBACKS = {
  andaman: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?q=80&w=900&auto=format&fit=crop",
  bhutan: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=900&auto=format&fit=crop",
  caribbean: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=900&auto=format&fit=crop",
  europe: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=900&auto=format&fit=crop",
  hongkong: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=900&auto=format&fit=crop",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop",
  ladakh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=900&auto=format&fit=crop",
  malaysia: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=900&auto=format&fit=crop",
  maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=900&auto=format&fit=crop",
  mauritius: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=900&auto=format&fit=crop",
  mediterranean: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=900&auto=format&fit=crop",
  nepal: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=900&auto=format&fit=crop",
  "new zealand": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=900&auto=format&fit=crop",
  "north east": "https://images.unsplash.com/photo-1627894485200-4abf0187339b?q=80&w=900&auto=format&fit=crop",
  qatar: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=900&auto=format&fit=crop",
  seychelles: "https://images.unsplash.com/photo-1589979481223-deb893043163?q=80&w=900&auto=format&fit=crop",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=900&auto=format&fit=crop",
  "south africa": "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?q=80&w=900&auto=format&fit=crop",
  "south india": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=900&auto=format&fit=crop",
  "sri lanka": "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=900&auto=format&fit=crop",
  thailand: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=900&auto=format&fit=crop",
  vietnam: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=900&auto=format&fit=crop",
};

const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function getMegaMenuImage(name) {
  const normalized = normalizeName(name);
  const destination = destinations.find((dest) => {
    const destName = normalizeName(dest.name);
    return destName.includes(normalized) || normalized.includes(destName);
  });

  return (
    destination?.coverImage ||
    destination?.gallery?.[0] ||
    FEATURED_IMAGE_FALLBACKS[normalized] ||
    null
  );
}
