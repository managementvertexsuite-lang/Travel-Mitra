import { ChevronLeft, Check } from "lucide-react"
import { useState, useMemo, useEffect, useRef } from "react"
import { formatDate, formatDateISO, getToday } from "../utils/dateUtils"
import FilterSidebar from "./FilterSidebar"
import LocationSelector from "./LocationSelector"
import CalendarDropdown from "./CalendarDropdown"
import { getPackagesForDestination } from "../utils/generateDestinationPackages"
import { getPackagesForCategory } from "../utils/categoryPackages"
import { HOLIDAY_PACKAGES_HERO_IMAGE } from "../utils/constants"

function generatePackages(payload) {
  if (payload.category) {
    return getPackagesForCategory(payload.category, payload.duration)
  }
  return getPackagesForDestination(payload.to, payload.duration)
}

export default function HolidayResults({ payload, isLoading, onDestinationClick, onBackToHome, onPackageClick, onSearch }) {
  if (!payload) return null

  const allPackages = useMemo(() => generatePackages(payload), [payload])

  const [filters, setFilters] = useState({
    duration: [1, 12],
    flights: "all",
    budget: [0, 100000],
    hotelCategory: "all",
    themes: [],
    cities: [],
    budgetBucket: null,
  })
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const [localFrom, setLocalFrom] = useState(payload.from || { city: "New Delhi" })
  const [localTo, setLocalTo] = useState(payload.to || null)
  const [localDate, setLocalDate] = useState(() => {
    if (!payload.departureDate) return null
    const [y, m, d] = payload.departureDate.split("-").map(Number)
    return new Date(y, m - 1, d)
  })
  const [rooms, setRooms] = useState([{ adults: Math.max(1, payload.travelers || 2), children: 0 }])
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [travelersOpen, setTravelersOpen] = useState(false)
  const stripRef = useRef(null)

  const localTravelers = rooms.reduce((sum, room) => sum + room.adults + room.children, 0)
  const totalRooms = rooms.length

  const pageTitle = payload.categoryLabel
    ? payload.categoryLabel
    : `${localTo?.city || payload.to?.city || ""} Holiday Packages`

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (stripRef.current && !stripRef.current.contains(e.target)) {
        setFromOpen(false)
        setToOpen(false)
        setCalendarOpen(false)
        setTravelersOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

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
      if (filters.flights === "with" && !pkg.flightIncluded) return false
      if (filters.flights === "without" && pkg.flightIncluded) return false
      if (filters.hotelCategory !== "all" && pkg.hotelCategory !== filters.hotelCategory) return false
      if (filters.cities?.length && !filters.cities.includes(pkg.destination)) return false
      if (filters.themes?.length) {
        const pkgThemes = pkg.themes || ""
        if (!filters.themes.some((theme) => pkgThemes.includes(theme.toLowerCase()))) return false
      }
      return true
    })
  }, [filters, allPackages])

  const closeAll = () => {
    setFromOpen(false)
    setToOpen(false)
    setCalendarOpen(false)
    setTravelersOpen(false)
  }

  const updateRoom = (idx, field, delta) => {
    setRooms((prev) =>
      prev.map((room, roomIdx) => {
        if (roomIdx !== idx) return room
        const minValue = field === "adults" ? 1 : 0
        return { ...room, [field]: Math.max(minValue, room[field] + delta) }
      })
    )
  }

  const addRoom = () => {
    if (rooms.length < 5) setRooms((prev) => [...prev, { adults: 1, children: 0 }])
  }

  const removeRoom = (idx) => {
    if (rooms.length > 1) setRooms((prev) => prev.filter((_, roomIdx) => roomIdx !== idx))
  }

  const handleReSearch = () => {
    onSearch?.({
      ...payload,
      from: localFrom,
      to: localTo || payload.to,
      departureDate: localDate ? formatDateISO(localDate) : payload.departureDate,
      travelers: localTravelers,
    })
    closeAll()
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Search strip — sticky below MinimalHeader, interactive dropdowns */}
      <div ref={stripRef} className="sticky top-16 z-30 w-full bg-[#0d2137] shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-evenly h-20">

          {/* Starting From */}
          <div
            className="relative flex flex-col items-start cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => { setFromOpen((o) => !o); setToOpen(false); setCalendarOpen(false); setTravelersOpen(false) }}
          >
            <p className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Starting From</p>
            <p className="text-white font-bold text-[13px]">{localFrom?.city || "New Delhi"}</p>
            <LocationSelector
              isOpen={fromOpen}
              onClose={() => setFromOpen(false)}
              onSelect={(loc) => { setLocalFrom(loc); setFromOpen(false) }}
              title="Select Departure City"
              selectedLocation={localFrom}
            />
          </div>

          <div className="w-px h-8 bg-white/20 flex-shrink-0" />

          {/* Going To */}
          <div
            className="relative flex flex-col items-start cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => { setToOpen((o) => !o); setFromOpen(false); setCalendarOpen(false); setTravelersOpen(false) }}
          >
            <p className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Going To</p>
            <p className="text-white font-bold text-[13px]">{localTo?.city || payload.to?.city || payload.categoryLabel || "—"}</p>
            <LocationSelector
              isOpen={toOpen}
              onClose={() => setToOpen(false)}
              onSelect={(loc) => { setLocalTo(loc); setToOpen(false) }}
              title="Select Destination"
              selectedLocation={localTo || payload.to}
            />
          </div>

          <div className="w-px h-8 bg-white/20 flex-shrink-0" />

          {/* Starting Date */}
          <div
            className="relative flex flex-col items-start cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => { setCalendarOpen((o) => !o); setFromOpen(false); setToOpen(false); setTravelersOpen(false) }}
          >
            <p className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Starting Date</p>
            <p className="text-white font-bold text-[13px]">
              {localDate
                ? formatDate(localDate)
                : payload.departureDate
                  ? formatDate(payload.departureDate)
                  : "Select"}
            </p>
            <CalendarDropdown
              isOpen={calendarOpen}
              onClose={() => setCalendarOpen(false)}
              onSelect={(date) => { setLocalDate(date); setCalendarOpen(false) }}
              selectedDate={localDate}
              minDate={getToday()}
            />
          </div>

          <div className="w-px h-8 bg-white/20 flex-shrink-0" />

          {/* Rooms & Guests */}
          <div
            className="relative flex flex-col items-start cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => { setTravelersOpen((o) => !o); setFromOpen(false); setToOpen(false); setCalendarOpen(false) }}
          >
            <p className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Rooms &amp; Guests</p>
            <p className="text-white font-bold text-[13px]">
              {localTravelers} Guest{localTravelers > 1 ? "s" : ""}, {totalRooms} Room{totalRooms > 1 ? "s" : ""}
            </p>
            {travelersOpen && (
              <div
                className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl z-50 w-[320px] border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
                  {rooms.map((room, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">ROOM {idx + 1}</p>
                        {rooms.length > 1 && (
                          <button
                            onClick={() => removeRoom(idx)}
                            className="text-[11px] text-red-500 hover:text-red-700 font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <RoomGuestControl
                          label="Adults"
                          sublabel="Above 12 Years"
                          value={room.adults}
                          onDecrement={() => updateRoom(idx, "adults", -1)}
                          onIncrement={() => updateRoom(idx, "adults", 1)}
                        />
                        <RoomGuestControl
                          label="Children"
                          sublabel="Below 12 Years"
                          value={room.children}
                          onDecrement={() => updateRoom(idx, "children", -1)}
                          onIncrement={() => updateRoom(idx, "children", 1)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={addRoom}
                    className="flex-1 py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg font-bold text-[12px] hover:bg-blue-50 transition-colors"
                  >
                    ADD ANOTHER ROOM +
                  </button>
                  <button
                    onClick={() => setTravelersOpen(false)}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-[12px] hover:bg-blue-700 transition-colors"
                  >
                    APPLY
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="w-px h-8 bg-white/20 flex-shrink-0" />

          <button
            onClick={handleReSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-2 rounded-full font-bold tracking-wider text-sm transition-colors flex-shrink-0"
          >
            SEARCH
          </button>
        </div>

      </div>

      {/* Banner — normal flow, 350px, text at top */}
      <div
        className="bg-cover bg-center overflow-hidden flex flex-col justify-start pt-8"
        style={{
          height: 350,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url(${HOLIDAY_PACKAGES_HERO_IMAGE})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-white font-semibold mb-2 hover:text-gray-200"
          >
            <ChevronLeft size={20} />
            Back to Search
          </button>
          <h1 className="text-3xl font-bold text-white mb-1">{pageTitle}</h1>
          <p className="text-gray-200 text-sm">{localTravelers} travelers • {payload.duration} days</p>
        </div>
      </div>

      {/* Packages card — pulled up 150px over the banner */}
      <div className="max-w-7xl mx-auto px-4 pb-6 -mt-[150px] relative z-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,360px)_1fr]">
            <aside className="min-w-0 border-r border-gray-200 p-6 lg:sticky lg:top-36 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
              <div className="mb-6 flex min-h-[44px] items-center">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  Filters
                </h2>
              </div>
              <div className="pr-1">
                <FilterSidebar filters={filters} setFilters={setFilters} packages={allPackages} />
              </div>
            </aside>

            <main className="min-w-0 p-6">
              <div className="mb-6 flex min-h-[44px] items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  All Packages ({isFilterLoading ? "..." : filteredPackages.length})
                </h2>
                <select className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 font-medium flex-shrink-0">
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
                      travelers={localTravelers}
                      onClick={() => onPackageClick?.(pkg)}
                    />
                  ))}
                  <NewDestinationCard payload={payload} onClick={() => setToOpen(true)} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center py-12 md:col-span-2 border border-dashed border-blue-200 bg-blue-50/60 rounded-2xl">
                    <p className="text-gray-700 font-semibold">No packages match your filters</p>
                    <p className="text-gray-500 text-sm mt-1">Try a new destination selection or clear the filters.</p>
                  </div>
                  <NewDestinationCard payload={payload} onClick={() => setToOpen(true)} />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

function RoomGuestControl({ label, sublabel, value, onDecrement, onIncrement }) {
  return (
    <div>
      <p className="text-[12px] font-semibold text-gray-700">{label}</p>
      <p className="text-[10px] text-gray-400 mb-2">{sublabel}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg leading-none"
        >
          -
        </button>
        <span className="text-[18px] font-black text-black w-7 text-center">{String(value).padStart(2, "0")}</span>
        <button
          onClick={onIncrement}
          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}

function NewDestinationCard({ payload, onClick }) {
  const destinationName = payload.to?.city || payload.categoryLabel || "another destination"

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl overflow-hidden border border-blue-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="h-56 bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400 flex items-end p-5">
        <div>
          <p className="text-white/85 text-sm font-semibold">New selection</p>
          <h3 className="text-2xl font-black text-white leading-tight">Find packages for a different destination</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-600 text-sm">
          Currently showing {destinationName}. Choose another city from the search bar to refresh cards, counts, and images.
        </p>
      </div>
    </button>
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
      className={`bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
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
