import { useState } from "react"
import { ArrowRightLeft, Search, ChevronLeft, ChevronRight } from "lucide-react"
import LocationSelector from "./LocationSelector"
import CalendarDropdown from "./CalendarDropdown"
import { formatDate, formatDateISO, getToday } from "../utils/dateUtils"

export default function HolidaySearchCard({ onSearch, onDestinationClick, onPackageClick }) {
  // Mock user location for carousel packages
  const mockFromLocation = { id: 1, city: "Delhi" }
  // Location states
  const [fromLocation, setFromLocation] = useState(null)
  const [toLocation, setToLocation] = useState(null)
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)

  // Date states
  const [departureDate, setDepartureDate] = useState(null)
  const [departureCalendarOpen, setDepartureCalendarOpen] = useState(false)

  // Duration state
  const [duration, setDuration] = useState("5")

  // Traveller state
  const [travelers, setTravelers] = useState("2")

  // Validation state
  const [errors, setErrors] = useState({})

  const swapLocations = () => {
    setFromLocation(toLocation)
    setToLocation(fromLocation)
  }

  const validateSearch = () => {
    const newErrors = {}

    if (!fromLocation) newErrors.from = "Please select departure city"
    if (!toLocation) newErrors.to = "Please select destination"
    if (fromLocation && toLocation && fromLocation.id === toLocation.id) {
      newErrors.location = "Departure and destination cannot be the same"
    }
    if (!departureDate) newErrors.departure = "Please select departure date"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSearch = () => {
    if (!validateSearch()) return

    const payload = {
      from: fromLocation,
      to: toLocation,
      departureDate: formatDateISO(departureDate),
      duration: parseInt(duration),
      travelers: parseInt(travelers),
    }

    onSearch(payload)
  }

  return (
    <div className="relative py-12 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-3">
            Holiday Packages
          </h1>
          <p className="text-muted text-lg">
            Explore amazing holiday destinations with curated packages
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Error Messages */}
          {Object.values(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              {errors.location && (
                <p className="text-sm text-red-600 font-medium">{errors.location}</p>
              )}
              {errors.from && (
                <p className="text-sm text-red-600 font-medium">{errors.from}</p>
              )}
              {errors.to && (
                <p className="text-sm text-red-600 font-medium">{errors.to}</p>
              )}
              {errors.departure && (
                <p className="text-sm text-red-600 font-medium">{errors.departure}</p>
              )}
            </div>
          )}

          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end mb-8">
            {/* From */}
            <div className="relative">
              <label className="block text-sm font-semibold text-dark mb-2">
                From
              </label>
              <button
                onClick={() => setFromOpen(true)}
                className={`w-full px-4 py-3 text-left rounded-xl border-2 transition-all focus:outline-none ${
                  errors.from
                    ? "border-red-300 bg-red-50"
                    : fromOpen
                    ? "border-primary bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className={fromLocation ? "text-dark font-medium" : "text-muted"}>
                  {fromLocation?.city || "Select city"}
                </span>
              </button>
              {errors.from && <p className="text-xs text-red-600 mt-1">{errors.from}</p>}
              <LocationSelector
                isOpen={fromOpen}
                onClose={() => setFromOpen(false)}
                onSelect={setFromLocation}
                title="Select Departure City"
                selectedLocation={fromLocation}
              />
            </div>

            {/* Swap Button */}
            <div className="hidden lg:flex justify-center">
              <button
                onClick={swapLocations}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                title="Swap locations"
              >
                <ArrowRightLeft className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-semibold text-dark mb-2">
                Destination
              </label>
              <button
                onClick={() => setToOpen(true)}
                className={`w-full px-4 py-3 text-left rounded-xl border-2 transition-all focus:outline-none ${
                  errors.to
                    ? "border-red-300 bg-red-50"
                    : toOpen
                    ? "border-primary bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className={toLocation ? "text-dark font-medium" : "text-muted"}>
                  {toLocation?.city || "Select city"}
                </span>
              </button>
              {errors.to && <p className="text-xs text-red-600 mt-1">{errors.to}</p>}
              <LocationSelector
                isOpen={toOpen}
                onClose={() => setToOpen(false)}
                onSelect={setToLocation}
                title="Select Destination"
                selectedLocation={toLocation}
              />
            </div>

            {/* Departure Date */}
            <div className="relative">
              <label className="block text-sm font-semibold text-dark mb-2">
                Departure
              </label>
              <button
                onClick={() => setDepartureCalendarOpen(true)}
                className={`w-full px-4 py-3 text-left rounded-xl border-2 transition-all focus:outline-none ${
                  errors.departure
                    ? "border-red-300 bg-red-50"
                    : departureCalendarOpen
                    ? "border-primary bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className={departureDate ? "text-dark font-medium" : "text-muted"}>
                  {departureDate ? formatDate(departureDate) : "Select date"}
                </span>
              </button>
              {errors.departure && (
                <p className="text-xs text-red-600 mt-1">{errors.departure}</p>
              )}
              <CalendarDropdown
                isOpen={departureCalendarOpen}
                onClose={() => setDepartureCalendarOpen(false)}
                onSelect={setDepartureDate}
                selectedDate={departureDate}
                minDate={getToday()}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-primary focus:outline-none transition-all font-medium text-dark"
              >
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
                <option value="10">10 Days</option>
                <option value="14">14 Days</option>
              </select>
            </div>
          </div>

          {/* Second Row: Travelers */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-dark mb-2">
              Number of Travelers
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-primary focus:outline-none transition-all font-medium text-dark"
              >
                <option value="1">1 Traveler</option>
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4 Travelers</option>
                <option value="5">5 Travelers</option>
                <option value="6">6 Travelers</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Search size={24} />
            Explore Holiday Packages
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard
            icon="✈️"
            title="Curated Packages"
            description="Hand-picked holiday destinations"
          />
          <FeatureCard
            icon="🎯"
            title="Best Prices"
            description="Competitive rates on all packages"
          />
          <FeatureCard
            icon="💬"
            title="24/7 Support"
            description="Round-the-clock customer assistance"
          />
        </div>
      </div>

      {/* Carousel Sections */}
      <div className="mt-16 space-y-16">
        <CarouselSection
          title="All Moods of Travel SALE!"
          subtitle="Up to 40% OFF* • Use Code: TRAVELMOOD"
          packages={ALL_MOODS_PACKAGES}
          onSearch={onSearch}
          mockFromLocation={mockFromLocation}
        />
        <CarouselSection
          title="Last-Minute Escape Sale!"
          subtitle="Book your spontaneous getaway. Use code: LASTMINUTE"
          packages={LAST_MINUTE_PACKAGES}
          onSearch={onSearch}
          mockFromLocation={mockFromLocation}
        />
        <CarouselSection
          title="Spiritual Escapes at Lowest prices!"
          subtitle="Explore Pilgrimage packages"
          packages={SPIRITUAL_PACKAGES}
          onSearch={onSearch}
          mockFromLocation={mockFromLocation}
        />
        <CarouselSection
          title="Adventure Awaits!"
          subtitle="Adrenaline rush and outdoor activities"
          packages={ADVENTURE_PACKAGES}
          onSearch={onSearch}
          mockFromLocation={mockFromLocation}
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-dark mb-2">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  )
}

const ALL_MOODS_PACKAGES = [
  { id: 1, name: "Kashmir", image: "🏔️", price: "₹28,999", rating: 4.8 },
  { id: 2, name: "Himachal", image: "⛰️", price: "₹24,999", rating: 4.7 },
  { id: 3, name: "Kerala", image: "🌴", price: "₹22,999", rating: 4.9 },
  { id: 4, name: "North East", image: "🌄", price: "₹25,999", rating: 4.6 },
  { id: 5, name: "Coorg & Ooty", image: "🏞️", price: "₹19,999", rating: 4.8 },
  { id: 6, name: "Goa", image: "🏝️", price: "₹18,999", rating: 4.7 },
  { id: 7, name: "Maldives", image: "🏖️", price: "₹45,999", rating: 4.9 },
  { id: 8, name: "Thailand", image: "🎭", price: "₹35,999", rating: 4.8 },
  { id: 9, name: "Bali", image: "🌺", price: "₹42,999", rating: 4.7 },
  { id: 10, name: "Ladakh", image: "🏜️", price: "₹32,999", rating: 4.9 },
  { id: 11, name: "Rajasthan", image: "🏰", price: "₹21,999", rating: 4.6 },
  { id: 12, name: "Lakshadweep", image: "🌊", price: "₹52,999", rating: 4.9 },
]

const LAST_MINUTE_PACKAGES = [
  { id: 1, name: "South India", image: "🐘", price: "₹15,999", rating: 4.7 },
  { id: 2, name: "Kerala Backwaters", image: "🚣", price: "₹18,999", rating: 4.8 },
  { id: 3, name: "Kashmir Tour", image: "🏞️", price: "₹26,999", rating: 4.9 },
  { id: 4, name: "Shimla & Manali", image: "❄️", price: "₹22,999", rating: 4.6 },
  { id: 5, name: "Goa Getaway", image: "🏖️", price: "₹16,999", rating: 4.7 },
  { id: 6, name: "Sikkim Adventure", image: "🏔️", price: "₹24,999", rating: 4.8 },
  { id: 7, name: "Thailand Beach", image: "🌴", price: "₹32,999", rating: 4.9 },
  { id: 8, name: "Andaman Islands", image: "🏝️", price: "₹38,999", rating: 4.7 },
  { id: 9, name: "Rajasthan Fort", image: "🏰", price: "₹19,999", rating: 4.6 },
  { id: 10, name: "Vietnam Tour", image: "🗿", price: "₹28,999", rating: 4.8 },
  { id: 11, name: "Sri Lanka", image: "🏛️", price: "₹25,999", rating: 4.9 },
  { id: 12, name: "Dubai Escape", image: "🌆", price: "₹48,999", rating: 4.7 },
]

const SPIRITUAL_PACKAGES = [
  { id: 1, name: "Varanasi Pilgrimage", image: "🕉️", price: "₹12,999", rating: 4.9 },
  { id: 2, name: "Haridwar & Rishikesh", image: "🙏", price: "₹14,999", rating: 4.8 },
  { id: 3, name: "Ayodhya Divine", image: "🛕", price: "₹13,999", rating: 4.9 },
  { id: 4, name: "Mathura Krishna Tour", image: "🪈", price: "₹11,999", rating: 4.7 },
  { id: 5, name: "Ujjain Sacred", image: "🔱", price: "₹10,999", rating: 4.8 },
  { id: 6, name: "Amritsar Golden Temple", image: "✨", price: "₹9,999", rating: 4.9 },
  { id: 7, name: "Tirupati Temple", image: "⛩️", price: "₹8,999", rating: 4.7 },
  { id: 8, name: "Rameswaram Dham", image: "🌊", price: "₹11,999", rating: 4.8 },
  { id: 9, name: "Puri Jagannath", image: "🏛️", price: "₹10,999", rating: 4.9 },
  { id: 10, name: "Rishikesh Yoga", image: "🧘", price: "₹15,999", rating: 4.8 },
  { id: 11, name: "Kedarnath Trek", image: "⛩️", price: "₹18,999", rating: 4.9 },
  { id: 12, name: "Meenakshi Temple Tour", image: "🕉️", price: "₹12,999", rating: 4.7 },
]

const ADVENTURE_PACKAGES = [
  { id: 1, name: "Skydiving Thrills", image: "🪂", price: "₹34,999", rating: 4.8 },
  { id: 2, name: "Mountain Climbing", image: "🧗", price: "₹28,999", rating: 4.9 },
  { id: 3, name: "Scuba Diving", image: "🤿", price: "₹32,999", rating: 4.7 },
  { id: 4, name: "Paragliding Himalayas", image: "🪁", price: "₹22,999", rating: 4.8 },
  { id: 5, name: "Rafting Adventure", image: "🚣", price: "₹12,999", rating: 4.9 },
  { id: 6, name: "Trekking Expedition", image: "🥾", price: "₹16,999", rating: 4.7 },
  { id: 7, name: "Desert Safari", image: "🏜️", price: "₹18,999", rating: 4.8 },
  { id: 8, name: "Zip-lining Fun", image: "🎢", price: "₹8,999", rating: 4.9 },
  { id: 9, name: "Jungle Safari", image: "🦁", price: "₹21,999", rating: 4.6 },
  { id: 10, name: "Rock Climbing", image: "🧗", price: "₹15,999", rating: 4.8 },
  { id: 11, name: "White Water Rafting", image: "💦", price: "₹14,999", rating: 4.7 },
  { id: 12, name: "Bungee Jumping", image: "🎪", price: "₹25,999", rating: 4.9 },
]

function CarouselSection({ title, subtitle, packages, onSearch, mockFromLocation }) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction) => {
    const container = document.getElementById(`carousel-${title}`)
    const scrollAmount = 320
    if (direction === "left") {
      container.scrollLeft -= scrollAmount
    } else {
      container.scrollLeft += scrollAmount
    }
  }

  const handleCardClick = (pkg) => {
    // Simulate search form submission with carousel package destination
    const today = new Date()
    const departureDate = new Date(today)
    departureDate.setDate(departureDate.getDate() + 5)

    const payload = {
      from: mockFromLocation,
      to: { city: pkg.name, id: pkg.id },
      departureDate: departureDate.toISOString().split('T')[0],
      duration: 5,
      travelers: 2,
    }
    onSearch && onSearch(payload)
  }

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-dark mb-2">{title}</h2>
        <p className="text-muted">{subtitle}</p>
      </div>

      <div className="relative">
        {/* Carousel Container */}
        <div
          id={`carousel-${title}`}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleCardClick(pkg)}
              className="flex-shrink-0 w-72 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              {/* Card Background */}
              <div className="relative h-full bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-center overflow-hidden">
                {/* Image Emoji */}
                <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">
                  {pkg.image}
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹{pkg.price}</span>
                    <div className="flex items-center gap-1 bg-yellow-400 text-dark px-3 py-1 rounded-full">
                      <span>⭐</span>
                      <span className="font-semibold">{pkg.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all z-10"
        >
          ←
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all z-10"
        >
          →
        </button>
      </div>
    </div>
  )
}
