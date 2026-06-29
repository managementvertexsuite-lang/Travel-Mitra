import { useState, useMemo, useEffect } from "react"
import { ChevronLeft, Star, MapPin, Clock, Users, Check } from "lucide-react"
import FilterSidebar from "./FilterSidebar"

const DESTINATION_DATA = {
  "Kashmir": {
    title: "Kashmir Packages",
    subtitle: "Paradise on Earth",
    bgImage: "🏔️",
    packages: [
      {
        id: 1,
        name: "Amazing Kashmir Vacay with Gulmarg",
        duration: 5,
        nights: 4,
        location: "Srinagar, Gulmarg",
        price: 35608,
        originalPrice: 47500,
        rating: 4.8,
        reviews: 342,
        image: "❄️",
        flights: true,
        hotel: "4★",
        activities: ["Skiing", "Gondola", "Local Tours"],
        includes: ["3 Star Hotels", "7 Activities", "Round Trip Flights", "Airport Transfers"],
      },
      {
        id: 2,
        name: "Mystical Kashmir Trip with Houseboat",
        duration: 5,
        nights: 4,
        location: "Srinagar, Pahalgam",
        price: 19057,
        originalPrice: 25400,
        rating: 4.7,
        reviews: 215,
        image: "🛶",
        flights: false,
        hotel: "3★",
        activities: ["Boating", "Cultural Tours", "Nature Walks"],
        includes: ["3 Star Hotels & Houseboat", "8 Activities", "Airport Transfers", "Meals"],
      },
      {
        id: 3,
        name: "Luxury Kashmir Experience",
        duration: 6,
        nights: 5,
        location: "Srinagar, Gulmarg, Pahalgam",
        price: 52999,
        originalPrice: 68000,
        rating: 4.9,
        reviews: 428,
        image: "👑",
        flights: true,
        hotel: "5★",
        activities: ["Premium Tours", "Spa", "Private Guides"],
        includes: ["5 Star Hotels", "12 Activities", "Private Transfers", "All Meals"],
      },
      {
        id: 4,
        name: "Budget Kashmir Gateway",
        duration: 3,
        nights: 2,
        location: "Srinagar",
        price: 12999,
        originalPrice: 16500,
        rating: 4.5,
        reviews: 156,
        image: "🎒",
        flights: false,
        hotel: "3★",
        activities: ["City Tour", "Local Market"],
        includes: ["Budget Hotels", "4 Activities", "Local Transport"],
      },
      {
        id: 5,
        name: "Adventure Kashmir Trek",
        duration: 7,
        nights: 6,
        location: "Gulmarg, Pahalgam, Sonmarg",
        price: 45999,
        originalPrice: 59000,
        rating: 4.8,
        reviews: 289,
        image: "🥾",
        flights: true,
        hotel: "4★",
        activities: ["Trekking", "Camping", "Rock Climbing"],
        includes: ["4 Star Hotels", "15 Activities", "Professional Guides"],
      },
      {
        id: 6,
        name: "Honeymoon Paradise Kashmir",
        duration: 5,
        nights: 4,
        location: "Srinagar, Gulmarg",
        price: 58999,
        originalPrice: 75000,
        rating: 4.9,
        reviews: 567,
        image: "💑",
        flights: true,
        hotel: "5★",
        activities: ["Romantic Dinners", "Couple Spa", "Private Tours"],
        includes: ["Luxury Resorts", "Romantic Settings", "Private Transfers"],
      },
      {
        id: 7,
        name: "Family Fun Kashmir",
        duration: 4,
        nights: 3,
        location: "Srinagar, Pahalgam",
        price: 28999,
        originalPrice: 37000,
        rating: 4.6,
        reviews: 312,
        image: "👨‍👩‍👧‍👦",
        flights: false,
        hotel: "3★",
        activities: ["Kids Activities", "Nature Walks", "Local Cuisine"],
        includes: ["Family Rooms", "9 Activities", "Meal Plans"],
      },
      {
        id: 8,
        name: "Cultural Kashmir Tour",
        duration: 5,
        nights: 4,
        location: "Srinagar, Pahalgam, Kulgam",
        price: 24999,
        originalPrice: 32000,
        rating: 4.7,
        reviews: 198,
        image: "🏛️",
        flights: false,
        hotel: "3★",
        activities: ["Heritage Tours", "Artisan Visits", "Local Crafts"],
        includes: ["Heritage Hotels", "Cultural Guides", "Workshop Access"],
      },
      {
        id: 9,
        name: "Winter Wonderland Kashmir",
        duration: 6,
        nights: 5,
        location: "Gulmarg, Pahalgam",
        price: 48999,
        originalPrice: 62000,
        rating: 4.8,
        reviews: 401,
        image: "⛄",
        flights: true,
        hotel: "4★",
        activities: ["Skiing", "Snowball", "Winter Sports"],
        includes: ["Premium Lodges", "Winter Equipment", "Pro Instructors"],
      },
      {
        id: 10,
        name: "Photography Kashmir Special",
        duration: 5,
        nights: 4,
        location: "Srinagar, Sonmarg",
        price: 35999,
        originalPrice: 46000,
        rating: 4.9,
        reviews: 234,
        image: "📸",
        flights: true,
        hotel: "4★",
        activities: ["Photography Tours", "Sunrise/Sunset Sessions"],
        includes: ["Photo Guides", "Prime Locations", "Equipment Rental"],
      },
      {
        id: 11,
        name: "Wellness Retreat Kashmir",
        duration: 7,
        nights: 6,
        location: "Srinagar",
        price: 42999,
        originalPrice: 55000,
        rating: 4.8,
        reviews: 267,
        image: "🧘",
        flights: false,
        hotel: "5★",
        activities: ["Yoga", "Meditation", "Ayurveda Spa"],
        includes: ["Wellness Center", "Yoga Classes", "Ayurvedic Treatments"],
      },
      {
        id: 12,
        name: "Solo Traveler Kashmir",
        duration: 4,
        nights: 3,
        location: "Srinagar, Pahalgam",
        price: 18999,
        originalPrice: 24500,
        rating: 4.6,
        reviews: 145,
        image: "🎒",
        flights: false,
        hotel: "3★",
        activities: ["Solo Tours", "Group Activities", "Networking Events"],
        includes: ["Shared Accommodations", "Group Outings"],
      },
    ],
  },
  // Add more destinations as needed
}

export default function DestinationDetail({ destination, onBack, onPackageClick }) {
  const [filters, setFilters] = useState({
    duration: [1, 12],
    flights: "all",
    budget: [0, 100000],
    hotelCategory: "all",
    themes: [],
  })
  const [isFilterLoading, setIsFilterLoading] = useState(false)

  const destinationKey = destination.name || "Kashmir"
  const data = DESTINATION_DATA[destinationKey] || DESTINATION_DATA["Kashmir"]
  const packages = data.packages

  useEffect(() => {
    setIsFilterLoading(true)
    const timer = setTimeout(() => setIsFilterLoading(false), 600)
    return () => clearTimeout(timer)
  }, [filters])

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (pkg.nights < filters.duration[0] || pkg.nights > filters.duration[1]) return false
      if (filters.flights !== "all" && pkg.flights !== (filters.flights === "with")) return false
      if (pkg.price < filters.budget[0] || pkg.price > filters.budget[1]) return false
      return true
    })
  }, [filters, packages])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
        <div className="text-9xl opacity-30">{data.bgImage}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-white mb-2 text-center">{data.title}</h1>
          <p className="text-2xl text-blue-100">{data.subtitle}</p>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 bg-white text-primary px-4 py-3 rounded-full hover:bg-gray-100 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Packages Grid */}
          <main className="lg:col-span-4">
            {/* Results Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-dark">
                  All Packages ({filteredPackages.length})
                </h2>
                <select className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none">
                  <option>Sort by: Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                  <option>Duration: Short to Long</option>
                </select>
              </div>
            </div>

            {/* Packages Grid */}
            {isFilterLoading ? (
              <PackageSkeletonLoader />
            ) : filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} onClick={() => onPackageClick?.(pkg)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted text-lg">No packages match your filters</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function PackageSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div className="h-48 bg-gray-200 shimmer-skeleton" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded shimmer-skeleton w-3/4" />
            <div className="h-4 bg-gray-200 rounded shimmer-skeleton w-1/2" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded shimmer-skeleton" />
              <div className="h-3 bg-gray-200 rounded shimmer-skeleton w-4/5" />
            </div>
            <div className="h-10 bg-gray-200 rounded shimmer-skeleton" />
          </div>
        </div>
      ))}
    </div>
  )
}

function PackageCard({ package: pkg, onClick }) {
  const discount = Math.round(
    ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100
  )

  return (
    <div onClick={onClick} className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 ${onClick ? 'cursor-pointer' : ''}`}>
      {/* Image Section */}
      <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 h-48 flex items-center justify-center overflow-hidden">
        <span className="text-6xl">{pkg.image}</span>
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        {pkg.flights && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
            ✈️ Flights Included
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Location */}
        <h3 className="text-xl font-bold text-dark mb-2 line-clamp-2">{pkg.name}</h3>
        <div className="flex items-center gap-2 text-muted mb-4 text-sm">
          <MapPin size={16} className="text-primary" />
          {pkg.location}
        </div>

        {/* Duration & Nights */}
        <div className="flex items-center gap-4 text-sm text-muted mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-primary" />
            <span>{pkg.duration}D / {pkg.nights}N</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-dark">{pkg.rating}</span>
            <span>({pkg.reviews})</span>
          </div>
        </div>

        {/* Includes */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-dark mb-2">Package Includes:</h4>
          <ul className="space-y-1">
            {pkg.includes.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-muted">
                <Check size={14} className="text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
            <span className="text-sm text-muted line-through">
              ₹{pkg.originalPrice.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted">per person</p>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all">
          View Details & Book
        </button>
      </div>
    </div>
  )
}
