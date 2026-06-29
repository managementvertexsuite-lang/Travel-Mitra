import { MapPin, Star, Clock, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { formatDate } from "../utils/dateUtils"
import FilterSidebar from "./FilterSidebar"
import { packages } from "../data/packages"

function generatePackages(destination, duration, travelers) {
  const destName = destination?.city?.toUpperCase() || "BALI"
  let basePackages = packages.filter(pkg => pkg.destinationId === destName)
  
  if (!basePackages || basePackages.length === 0) {
    basePackages = packages // Fallback to all packages if destination not found
  }

  const durationInNights = duration ? Math.max(1, duration - 1) : 5

  return basePackages.map((pkg, idx) => ({
    id: pkg.packageId || idx + 1,
    name: pkg.packageName,
    destination: destination?.city || "Bali",
    price: pkg.minBudget || Math.floor(Math.random() * 40000 + 15000),
    originalPrice: pkg.maxBudget || Math.floor(Math.random() * 60000 + 25000),
    rating: pkg.rating || parseFloat((Math.random() * 0.4 + 4.5).toFixed(1)),
    reviews: pkg.totalReviews || Math.floor(Math.random() * 500 + 100),
    duration: duration || pkg.durationDays,
    nights: duration ? durationInNights : pkg.durationNights,
    image: pkg.coverImage || (pkg.gallery && pkg.gallery[0]),
    itinerary: `${duration ? durationInNights : pkg.durationNights}N ${destination?.city || "Bali"}`,
    inclusions: pkg.inclusions || ["Round Trip Flights", "3 Star Hotels", "7 Activities", "Intercity Car Transfers", "Airport Transfers", "Selected Meals"],
    highlights: pkg.highlights || ["Tea Tasting Session at Local Tea lounge", "Complimentary 1 Lunch or refreshment on Day 1", "Tour Manager"],
    gallery: pkg.gallery || [],
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
  const totalPrice = pkg.price * travelers

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`relative h-56 flex items-center justify-center`}
        style={{
          backgroundImage: `url('${pkg.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-4 left-0 bg-white text-purple-700 px-3 py-1 text-xs font-bold rounded-r-lg border border-purple-200 border-l-0 shadow-sm">
          Deal of the day
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start gap-4 mb-1">
          <h3 className="text-xl font-black text-black leading-tight">{pkg.name}</h3>
          <div className="border border-blue-800 text-blue-900 px-1.5 py-0.5 rounded text-[13px] font-semibold whitespace-nowrap">
            {pkg.nights}N/{pkg.duration}D
          </div>
        </div>

        <p className="text-gray-500 text-[15px] mb-4">{pkg.itinerary}</p>

        <hr className="border-t border-gray-200 my-4" />

        <div className="grid grid-cols-2 gap-y-2.5 mb-5">
          {pkg.inclusions.slice(0, 6).map((inc, i) => (
            <div key={i} className="flex items-center gap-2 text-[14px] text-gray-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0"></span>
              <span className="truncate">{inc}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {pkg.highlights.slice(0, 3).map((hl, i) => (
            <div key={i} className="flex items-start gap-2 text-[14px] text-teal-700 font-medium">
              <Check className="w-4 h-4 mt-0.5 text-teal-600 flex-shrink-0" strokeWidth={3} />
              <span className="leading-snug">{hl}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#f2f4f7] rounded-xl p-4 flex justify-between items-center border border-gray-100">
          <p className="text-gray-600 text-[13px] max-w-[50%] leading-tight font-medium">
            This price is lower than the average price in July
          </p>
          <div className="text-right flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-black text-black">₹{pkg.price.toLocaleString()}</span>
              <span className="text-[13px] text-gray-500 font-medium">/Person</span>
            </div>
            <div className="text-[13px] text-gray-500 font-medium mt-0.5">
              Total Price ₹{totalPrice.toLocaleString()}
            </div>
          </div>
        </div>
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
