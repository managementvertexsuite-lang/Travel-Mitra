import { MapPin, Star, Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { formatDate } from "../utils/dateUtils"
import FilterSidebar from "./FilterSidebar"

const DESTINATION_PACKAGES = {
  "Delhi": [
    { name: "Delhi Heritage Tour", image: "🏛️", highlight: "Historic monuments" },
    { name: "Delhi & Agra Gateway", image: "🕌", highlight: "Cultural sites" },
    { name: "Old Delhi Food Walk", image: "🍜", highlight: "Street food adventure" },
    { name: "Delhi Luxury Escape", image: "✨", highlight: "5-star experience" },
    { name: "Delhi Weekend Getaway", image: "🎒", highlight: "Quick escape" },
    { name: "Delhi Photography Tour", image: "📸", highlight: "Capture the city" },
  ],
  "Mumbai": [
    { name: "Mumbai City Tour", image: "🏙️", highlight: "Bollywood & beaches" },
    { name: "Mumbai Coastal Escape", image: "🌊", highlight: "Beach hopping" },
    { name: "Gateway of India", image: "🌅", highlight: "Iconic monument" },
    { name: "Mumbai Luxury Retreat", image: "💎", highlight: "Premium hotels" },
    { name: "Mumbai Food Trail", image: "🍛", highlight: "Street cuisine" },
    { name: "Mumbai Weekend Plan", image: "🎉", highlight: "Nightlife & culture" },
  ],
  "Bengaluru": [
    { name: "Bengaluru Tech City Tour", image: "💻", highlight: "Innovation hub" },
    { name: "Bengaluru Garden Walk", image: "🌸", highlight: "Parks & nature" },
    { name: "Bengaluru Nightlife", image: "🌃", highlight: "Bars & clubs" },
    { name: "Bengaluru Coffee Trail", image: "☕", highlight: "Café culture" },
    { name: "Bengaluru Wellness", image: "🧘", highlight: "Spa & yoga" },
    { name: "Bengaluru Adventure", image: "🧗", highlight: "Outdoor activities" },
  ],
  "Kashmir": [
    { name: "Amazing Kashmir Vacay with Gulmarg", image: "❄️", highlight: "Skiing & gondola" },
    { name: "Mystical Kashmir Trip with Houseboat", image: "🛶", highlight: "Boating & culture" },
    { name: "Luxury Kashmir Experience", image: "👑", highlight: "5-star luxury" },
    { name: "Budget Kashmir Gateway", image: "🎒", highlight: "Budget friendly" },
    { name: "Adventure Kashmir Trek", image: "🥾", highlight: "Trekking & camping" },
    { name: "Honeymoon Paradise Kashmir", image: "💑", highlight: "Romantic getaway" },
  ],
  "Kerala": [
    { name: "Kerala Backwaters Cruise", image: "🚤", highlight: "Houseboat luxury" },
    { name: "Kerala Beach Paradise", image: "🏖️", highlight: "Pristine beaches" },
    { name: "Ayurveda & Wellness", image: "🧘", highlight: "Spa & healing" },
    { name: "Kerala Hill Stations", image: "🏔️", highlight: "Mountain retreat" },
    { name: "Kerala Adventure Trail", image: "🥾", highlight: "Trekking & nature" },
    { name: "Kerala Honeymoon Package", image: "💑", highlight: "Romantic escape" },
  ],
  "Himachal": [
    { name: "Himachal Trekking Adventure", image: "🥾", highlight: "Mountain trails" },
    { name: "Himachal Valley Escape", image: "🏞️", highlight: "Scenic valleys" },
    { name: "Manali Adventure Package", image: "🧗", highlight: "Adventure sports" },
    { name: "Himachal Wildlife Tour", image: "🦌", highlight: "Nature & wildlife" },
    { name: "Shimla Heritage Tour", image: "🏛️", highlight: "Colonial charm" },
    { name: "Himachal Photography Special", image: "📸", highlight: "Picture perfect" },
  ],
  "Goa": [
    { name: "Goa Beach Paradise", image: "🏖️", highlight: "Beach clubs & parties" },
    { name: "Goa Heritage Tour", image: "🏛️", highlight: "Portuguese history" },
    { name: "Goa Water Sports Adventure", image: "🏄", highlight: "Watersports" },
    { name: "Goa Wellness Retreat", image: "🧘", highlight: "Spa & yoga" },
    { name: "Goa Honeymoon Special", image: "💑", highlight: "Romantic beaches" },
    { name: "Goa Family Fun", image: "👨‍👩‍👧‍👦", highlight: "Family activities" },
  ],
}

function generatePackages(destination, duration, travelers) {
  const destName = destination?.city || "Delhi"
  const basePackages = DESTINATION_PACKAGES[destName] || DESTINATION_PACKAGES["Delhi"]
  const durationInNights = Math.max(1, duration - 1)

  return basePackages.map((pkg, idx) => ({
    id: idx + 1,
    name: pkg.name,
    destination: destName,
    price: Math.floor(Math.random() * 40000 + 15000),
    originalPrice: Math.floor(Math.random() * 60000 + 25000),
    rating: parseFloat((Math.random() * 0.4 + 4.5).toFixed(1)),
    reviews: Math.floor(Math.random() * 500 + 100),
    duration: duration,
    nights: durationInNights,
    image: pkg.image,
    highlight: pkg.highlight,
    activities: ["Adventure", "Culture", "Food Tour"].slice(0, Math.floor(Math.random() * 3 + 1)),
  }))
}

export default function HolidayResults({ payload, isLoading, onDestinationClick, onBackToHome, onPackageClick }) {
  if (!payload) return null

  const totalTravelers = payload.travelers
  const allPackages = generatePackages(payload.to, payload.duration, totalTravelers)

  const [filters, setFilters] = useState({
    duration: [1, 12],
    flights: "all",
    budget: [0, 100000],
    hotelCategory: "all",
    themes: [],
  })
  const [isFilterLoading, setIsFilterLoading] = useState(false)

  useEffect(() => {
    setIsFilterLoading(true)
    const timer = setTimeout(() => setIsFilterLoading(false), 600)
    return () => clearTimeout(timer)
  }, [filters])

  const filteredPackages = useMemo(() => {
    return allPackages.filter((pkg) => {
      const nights = pkg.nights || pkg.duration - 1
      if (nights < filters.duration[0] || nights > filters.duration[1]) return false
      if (filters.budget[0] > 0 && pkg.price < filters.budget[0]) return false
      if (filters.budget[1] < 100000 && pkg.price > filters.budget[1]) return false
      return true
    })
  }, [filters, allPackages])

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-600 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-white font-semibold mb-4 hover:text-blue-100"
          >
            <ChevronLeft size={20} />
            Back to Search
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {payload.to?.city} Holiday Packages
          </h1>
          <p className="text-blue-100">
            {totalTravelers} travelers • {payload.duration} days
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-1">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          <main className="lg:col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                All Packages ({isFilterLoading ? "..." : filteredPackages.length})
              </h2>
              <select className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 font-medium">
                <option>Sort by: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>

            {isLoading ? (
              <ShimmerLoader />
            ) : isFilterLoading ? (
              <PackageSkeletonLoader />
            ) : filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPackages.map((pkg) => (
                  <HolidayCard
                    key={pkg.id}
                    package={pkg}
                    travelers={totalTravelers}
                    onClick={() => onPackageClick?.(pkg)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No packages match your filters</p>
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

function HolidayCard({ package: pkg, travelers, onClick }) {
  const discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
  const totalPrice = pkg.price * travelers

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 h-40 flex items-center justify-center">
        <span className="text-6xl">{pkg.image}</span>
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{pkg.name}</h3>
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-3">
          <MapPin size={16} />
          {pkg.destination}
        </div>

        <p className="text-sm text-gray-600 mb-3 italic">{pkg.highlight}</p>

        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900 text-sm">{pkg.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({pkg.reviews})</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock size={16} />
          {pkg.duration}D / {pkg.nights}N
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-blue-600">₹{pkg.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">per person</p>
          <p className="text-sm font-semibold text-gray-900">
            Total: ₹{totalPrice.toLocaleString()}
          </p>
        </div>

        <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-all">
          View Details
        </button>
      </div>
    </div>
  )
}

function ShimmerLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="h-40 bg-gray-200 shimmer-skeleton" />
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
