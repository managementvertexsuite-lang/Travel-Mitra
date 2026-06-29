import { useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

export default function FilterSidebar({ filters, setFilters }) {
  const [expandedSections, setExpandedSections] = useState({
    duration: true,
    flights: true,
    budget: true,
    hotel: true,
    cities: true,
    buyNow: false,
    themes: true,
    packageType: true,
    premium: false,
  })
  const [citiesSearch, setCitiesSearch] = useState("")
  const [showMoreCities, setShowMoreCities] = useState(false)
  const [showMoreThemes, setShowMoreThemes] = useState(false)

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleDurationChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      duration: [parseInt(e.target.value), prev.duration[1]],
    }))
  }

  const handleBudgetChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      budget: [parseInt(e.target.value), prev.budget[1]],
    }))
  }

  const handleFlightsChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      flights: value === filters.flights ? "all" : value,
    }))
  }

  const allCities = [
    { name: "Srinagar", count: 190 },
    { name: "Pahalgam", count: 145 },
    { name: "Gulmarg", count: 144 },
    { name: "Katra", count: 31 },
    { name: "Sonmarg", count: 28 },
    { name: "Sonamarg", count: 25 },
  ]

  const visibleCities = showMoreCities ? allCities : allCities.slice(0, 4)

  const allThemes = [
    { name: "Culture", count: 82 },
    { name: "Adventure", count: 29 },
    { name: "Offbeat", count: 28 },
    { name: "Honeymoon", count: 10 },
    { name: "Family", count: 35 },
    { name: "Wellness", count: 22 },
  ]

  const visibleThemes = showMoreThemes ? allThemes : allThemes.slice(0, 4)

  return (
    <div className="bg-white sticky top-28 h-fit max-h-[calc(100vh-120px)] overflow-y-auto w-full">
      <div className="px-5 pt-5 pb-4 border-b border-gray-200">
        <h3 className="text-[13px] font-bold text-gray-600 uppercase tracking-wide">FILTERS</h3>
      </div>

      <div className="px-5 pb-6">
        {/* Duration Filter */}
        <FilterSection
          title="Duration (in Nights)"
          isExpanded={expandedSections.duration}
          onToggle={() => toggleSection("duration")}
        >
          <div className="pt-2 pb-4">
            <div className="relative w-full h-1.5 bg-[#007aff] rounded-full mb-3 flex items-center">
              <div className="absolute -left-2 w-6 h-6 bg-white border border-gray-200 shadow-sm rounded-full"></div>
              <div className="absolute -right-2 w-6 h-6 bg-white border border-gray-200 shadow-sm rounded-full"></div>
            </div>
            <div className="flex items-center justify-between text-[13px] text-gray-600 font-medium">
              <span>2N</span>
              <span>10N</span>
            </div>
          </div>
        </FilterSection>

        {/* Flights Filter */}
        <FilterSection
          title="Flights"
          isExpanded={expandedSections.flights}
          onToggle={() => toggleSection("flights")}
        >
          <div className="flex gap-3 pt-2 pb-2">
            <button
              onClick={() => handleFlightsChange("with")}
              className={`flex-1 py-3 px-1 border rounded-lg flex flex-col items-center justify-center text-[13px] transition-colors ${
                filters.flights === "with"
                  ? "border-[#007aff] bg-blue-50 text-[#007aff] font-medium"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>With Flight</span>
              <span>(159)</span>
            </button>
            <button
              onClick={() => handleFlightsChange("without")}
              className={`flex-1 py-3 px-1 border rounded-lg flex flex-col items-center justify-center text-[13px] transition-colors ${
                filters.flights === "without"
                  ? "border-[#007aff] bg-blue-50 text-[#007aff] font-medium"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>Without Flight</span>
              <span>(158)</span>
            </button>
          </div>
        </FilterSection>

        {/* Budget Filter */}
        <FilterSection
          title="Budget (per person)"
          isExpanded={expandedSections.budget}
          onToggle={() => toggleSection("budget")}
        >
          <div className="pt-2 pb-2">
            <div className="relative w-full h-1.5 bg-[#007aff] rounded-full mb-3 flex items-center">
              <div className="absolute -left-2 w-6 h-6 bg-white border border-gray-200 shadow-sm rounded-full"></div>
              <div className="absolute -right-2 w-6 h-6 bg-white border border-gray-200 shadow-sm rounded-full"></div>
            </div>
            <div className="flex items-center justify-between text-[13px] text-gray-600 font-medium mb-6">
              <span>₹0</span>
              <span>₹105,000</span>
            </div>
            
            <div className="space-y-3">
              <CheckboxRow label="< ₹40,000" count="68" />
              <CheckboxRow label="₹40,000 - ₹50,000" count="69" />
              <CheckboxRow label="₹50,000 - ₹60,000" count="56" />
              <CheckboxRow label="> ₹60,000" count="47" />
            </div>
          </div>
        </FilterSection>

        {/* Hotel Category */}
        <FilterSection
          title="Hotel Category"
          isExpanded={expandedSections.hotel}
          onToggle={() => toggleSection("hotel")}
        >
          <div className="flex gap-2 flex-wrap pt-2">
            {[
              { label: "<3★", count: 1 },
              { label: "3★", count: 147 },
              { label: "4★", count: 39 },
              { label: "5★", count: 53 },
            ].map((hotel) => (
              <button
                key={hotel.label}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <div>{hotel.label}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">({hotel.count})</div>
                </div>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Cities */}
        <FilterSection
          title="Cities"
          isExpanded={expandedSections.cities}
          onToggle={() => toggleSection("cities")}
        >
          <div className="space-y-4 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cities"
                value={citiesSearch}
                onChange={(e) => setCitiesSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-[#007aff]"
              />
            </div>
            <div className="space-y-4">
              {visibleCities.map((city) => (
                <CheckboxRow key={city.name} label={city.name} count={city.count} />
              ))}
            </div>
            {!showMoreCities && (
              <button
                onClick={() => setShowMoreCities(true)}
                className="text-[#007aff] font-semibold text-[13px] hover:underline"
              >
                Show More
              </button>
            )}
          </div>
        </FilterSection>

        {/* Themes */}
        <FilterSection
          title="Themes"
          isExpanded={expandedSections.themes}
          onToggle={() => toggleSection("themes")}
        >
          <div className="space-y-4 pt-2">
            {visibleThemes.map((theme) => (
              <CheckboxRow key={theme.name} label={theme.name} count={theme.count} />
            ))}
            {!showMoreThemes && (
              <button
                onClick={() => setShowMoreThemes(true)}
                className="text-[#007aff] font-semibold text-[13px] hover:underline mt-2"
              >
                Show More
              </button>
            )}
          </div>
        </FilterSection>

        {/* Clear Filters */}
        <button className="w-full mt-6 py-3 px-4 border border-[#007aff] text-[#007aff] rounded-lg font-bold hover:bg-blue-50 transition-colors text-[14px]">
          CLEAR FILTERS
        </button>
      </div>
    </div>
  )
}

function FilterSection({ title, isExpanded, onToggle, children }) {
  return (
    <div className="border-b border-gray-200 pb-5 mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 hover:text-[#007aff] transition-colors"
      >
        <h4 className="text-[17px] font-bold text-black">{title}</h4>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-600" />
        ) : (
          <ChevronDown size={20} className="text-gray-600" />
        )}
      </button>
      {isExpanded && <div className="mt-1">{children}</div>}
    </div>
  )
}

function CheckboxRow({ label, count }) {
  return (
    <label className="flex items-center justify-between cursor-pointer w-full group">
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          className="w-[18px] h-[18px] border-2 border-gray-400 rounded-sm accent-[#007aff] cursor-pointer" 
        />
        <span className="text-[14px] text-gray-700">{label}</span>
      </div>
      <span className="text-[14px] text-gray-500">({count})</span>
    </label>
  )
}
