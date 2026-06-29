import { MapPin, Star, Clock, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { formatDate } from "../utils/dateUtils"
import FilterSidebar from "./FilterSidebar"
import { getPackagesForDestination } from "../utils/generateDestinationPackages"
import { getPackagesForCategory } from "../utils/categoryPackages"
import { HOLIDAY_PACKAGES_HERO_IMAGE } from "../utils/constants"

function generatePackages(payload) {
  if (payload.category) {
    return getPackagesForCategory(payload.category, payload.duration)
  }
  return getPackagesForDestination(payload.to, payload.duration)
}

export default function HolidayResults({ payload, isLoading, onDestinationClick, onBackToHome, onPackageClick }) {
  if (!payload) return null

  const totalTravelers = payload.travelers || 2
  const allPackages = generatePackages(payload)

  const pageTitle = payload.categoryLabel
    ? payload.categoryLabel
    : `${payload.to?.city} Holiday Packages`

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
      <div
        className="py-6 px-4 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.50)), url(${HOLIDAY_PACKAGES_HERO_IMAGE})`,
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-white font-semibold mb-4 hover:text-gray-200"
          >
            <ChevronLeft size={20} />
            Back to Search
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {pageTitle}
          </h1>
          <p className="text-gray-200">
            {totalTravelers} travelers • {payload.duration} days
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,360px)_1fr] gap-8">
          <aside className="min-w-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          <main className="min-w-0">
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
  const hasImage = pkg.image && pkg.image.startsWith("http")

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`relative h-56 flex items-center justify-center ${!hasImage ? "bg-gradient-to-br from-blue-400 to-blue-600" : ""}`}
        style={
          hasImage
            ? {
                backgroundImage: `url('${pkg.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
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
