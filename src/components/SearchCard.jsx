import { useState } from "react"
import { ArrowRightLeft, Search } from "lucide-react"
import LocationSelector from "./LocationSelector"
import CalendarDropdown from "./CalendarDropdown"
import TravellerSelector from "./TravellerSelector"
import { formatDate, formatDateISO, getToday } from "../utils/dateUtils"

const TABS = [
  { id: "flights", label: "Flights", icon: "✈️" },
  { id: "hotels", label: "Hotels", icon: "🏨" },
  { id: "trains", label: "Trains", icon: "🚆" },
  { id: "buses", label: "Buses", icon: "🚌" },
  { id: "cabs", label: "Cabs", icon: "🚕" },
]

const TRIP_TYPES = [
  { id: "one-way", label: "One Way" },
  { id: "round-trip", label: "Round Trip" },
  { id: "multi-city", label: "Multi City" },
]

export default function SearchCard({ onSearch }) {
  const [activeTab, setActiveTab] = useState("flights")
  const [tripType, setTripType] = useState("round-trip")

  // Location states
  const [fromLocation, setFromLocation] = useState(null)
  const [toLocation, setToLocation] = useState(null)
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)

  // Date states
  const [departureDate, setDepartureDate] = useState(null)
  const [returnDate, setReturnDate] = useState(null)
  const [departureCalendarOpen, setDepartureCalendarOpen] = useState(false)
  const [returnCalendarOpen, setReturnCalendarOpen] = useState(false)

  // Traveller states
  const [travellers, setTravellers] = useState({ adults: 1, children: 0, infants: 0 })
  const [travelClass, setTravelClass] = useState("economy")
  const [travellerSelectorOpen, setTravellerSelectorOpen] = useState(false)

  // Validation state
  const [errors, setErrors] = useState({})

  const swapLocations = () => {
    setFromLocation(toLocation)
    setToLocation(fromLocation)
  }

  const handleTravellerSelect = (data) => {
    setTravellers({
      adults: data.adults,
      children: data.children,
      infants: data.infants,
    })
    setTravelClass(data.class)
  }

  const validateSearch = () => {
    const newErrors = {}

    if (!fromLocation) newErrors.from = "Please select departure city"
    if (!toLocation) newErrors.to = "Please select arrival city"
    if (fromLocation && toLocation && fromLocation.id === toLocation.id) {
      newErrors.location = "Departure and arrival cannot be the same"
    }
    if (!departureDate) newErrors.departure = "Please select departure date"
    if (tripType === "round-trip" && !returnDate) {
      newErrors.return = "Please select return date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSearch = () => {
    if (!validateSearch()) return

    const payload = {
      tab: activeTab,
      tripType,
      from: fromLocation,
      to: toLocation,
      departureDate: formatDateISO(departureDate),
      returnDate: tripType === "round-trip" ? formatDateISO(returnDate) : null,
      travellers,
      class: travelClass,
    }

    onSearch(payload)
  }

  return (
    <div className="relative py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-white text-dark hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {activeTab === "flights" && (
            <>
              {/* Trip Type Selector */}
              <div className="flex gap-4 mb-8 pb-6 border-b border-gray-100">
                {TRIP_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTripType(type.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      tripType === type.id
                        ? "bg-primary text-white"
                        : "text-muted hover:text-dark"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Error Messages */}
              {Object.values(errors).length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
              )}

              {/* Search Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* From */}
                <SearchField
                  label="From"
                  placeholder="Departure city"
                  value={fromLocation?.city || ""}
                  isOpen={fromOpen}
                  onClick={() => setFromOpen(true)}
                  error={errors.from}
                >
                  <LocationSelector
                    isOpen={fromOpen}
                    onClose={() => setFromOpen(false)}
                    onSelect={setFromLocation}
                    title="Select Departure City"
                    selectedLocation={fromLocation}
                  />
                </SearchField>

                {/* Swap Button */}
                <div className="hidden lg:flex justify-center">
                  <button
                    onClick={swapLocations}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Swap locations"
                  >
                    <ArrowRightLeft className="w-5 h-5 text-primary" />
                  </button>
                </div>

                {/* To */}
                <SearchField
                  label="To"
                  placeholder="Arrival city"
                  value={toLocation?.city || ""}
                  isOpen={toOpen}
                  onClick={() => setToOpen(true)}
                  error={errors.to}
                >
                  <LocationSelector
                    isOpen={toOpen}
                    onClose={() => setToOpen(false)}
                    onSelect={setToLocation}
                    title="Select Arrival City"
                    selectedLocation={toLocation}
                  />
                </SearchField>

                {/* Departure Date */}
                <SearchField
                  label="Departure"
                  placeholder="Select date"
                  value={departureDate ? formatDate(departureDate) : ""}
                  isOpen={departureCalendarOpen}
                  onClick={() => setDepartureCalendarOpen(true)}
                  error={errors.departure}
                >
                  <CalendarDropdown
                    isOpen={departureCalendarOpen}
                    onClose={() => setDepartureCalendarOpen(false)}
                    onSelect={setDepartureDate}
                    selectedDate={departureDate}
                    minDate={getToday()}
                  />
                </SearchField>

                {/* Return Date */}
                {tripType === "round-trip" && (
                  <SearchField
                    label="Return"
                    placeholder="Select date"
                    value={returnDate ? formatDate(returnDate) : ""}
                    isOpen={returnCalendarOpen}
                    onClick={() => setReturnCalendarOpen(true)}
                    error={errors.return}
                  >
                    <CalendarDropdown
                      isOpen={returnCalendarOpen}
                      onClose={() => setReturnCalendarOpen(false)}
                      onSelect={setReturnDate}
                      selectedDate={returnDate}
                      minDate={departureDate}
                    />
                  </SearchField>
                )}

                {/* Travellers & Class */}
                <SearchField
                  label="Travellers & Class"
                  placeholder="Select"
                  value={
                    travellers.adults > 0
                      ? `${travellers.adults + travellers.children + travellers.infants}T, ${
                          travelClass.charAt(0).toUpperCase() + travelClass.slice(1)
                        }`
                      : ""
                  }
                  isOpen={travellerSelectorOpen}
                  onClick={() => setTravellerSelectorOpen(true)}
                >
                  <TravellerSelector
                    isOpen={travellerSelectorOpen}
                    onClose={() => setTravellerSelectorOpen(false)}
                    onSelect={handleTravellerSelect}
                    selectedTravellers={travellers}
                    selectedClass={travelClass}
                  />
                </SearchField>
              </div>

              {/* Search Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                  <Search size={20} />
                  Search Flights
                </button>
              </div>
            </>
          )}

          {/* Other Tabs Placeholder */}
          {activeTab !== "flights" && (
            <div className="text-center py-12">
              <p className="text-muted text-lg">
                {TABS.find((t) => t.id === activeTab)?.label} search coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SearchField({
  label,
  placeholder,
  value,
  isOpen,
  onClick,
  error,
  children,
}) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-dark mb-2">{label}</label>
      <button
        onClick={onClick}
        className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-all focus:outline-none ${
          error
            ? "border-red-300 bg-red-50"
            : isOpen
            ? "border-primary bg-blue-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <span className={value ? "text-dark font-medium" : "text-muted"}>
          {value || placeholder}
        </span>
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {children}
    </div>
  )
}
