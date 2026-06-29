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

  const handleDurationChange = (newRange) => {
    setFilters((prev) => ({
      ...prev,
      duration: newRange,
    }))
  }

  const handleBudgetChange = (newRange) => {
    setFilters((prev) => ({
      ...prev,
      budget: newRange,
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
    <div className="bg-white rounded-2xl p-6 sticky top-28 h-fit space-y-6 border border-gray-200 shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto">
      <h3 className="text-lg font-bold text-dark">FILTERS</h3>

      {/* Duration Filter */}
      <FilterSection
        title="Duration (in Nights)"
        isExpanded={expandedSections.duration}
        onToggle={() => toggleSection("duration")}
      >
        <div className="space-y-4">
          <input
            type="range"
            min="1"
            max="12"
            value={filters.duration[0]}
            onChange={(e) =>
              handleDurationChange([
                parseInt(e.target.value),
                filters.duration[1],
              ])
            }
            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #0B5ED7 0%, #0B5ED7 ${
                ((filters.duration[0] - 1) / 11) * 100
              }%, #e5e7eb ${((filters.duration[0] - 1) / 11) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex items-center justify-between text-sm font-semibold text-primary">
            <span>{filters.duration[0]}N</span>
            <span>{filters.duration[1]}N</span>
          </div>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark">&lt; 4N</span>
              <span className="text-primary font-semibold">(44)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark">4N - 5N</span>
              <span className="text-primary font-semibold">(28)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark">5N - 6N</span>
              <span className="text-primary font-semibold">(48)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark">&gt; 6N</span>
              <span className="text-primary font-semibold">(100)</span>
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Flights Filter */}
      <FilterSection
        title="Flights"
        isExpanded={expandedSections.flights}
        onToggle={() => toggleSection("flights")}
      >
        <div className="flex gap-2">
          <button
            onClick={() => handleFlightsChange("with")}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all border ${
              filters.flights === "with"
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary border-primary hover:bg-blue-50"
            }`}
          >
            With Flight (190)
          </button>
          <button
            onClick={() => handleFlightsChange("without")}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all border ${
              filters.flights === "without"
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary border-primary hover:bg-blue-50"
            }`}
          >
            Without Flight (212)
          </button>
        </div>
      </FilterSection>

      {/* Budget Filter */}
      <FilterSection
        title="Budget (per person)"
        isExpanded={expandedSections.budget}
        onToggle={() => toggleSection("budget")}
      >
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="100000"
            step="5000"
            value={filters.budget[0]}
            onChange={(e) =>
              handleBudgetChange([
                parseInt(e.target.value),
                filters.budget[1],
              ])
            }
            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center justify-between text-sm font-semibold text-primary">
            <span>₹{filters.budget[0].toLocaleString()}</span>
            <span>₹{filters.budget[1].toLocaleString()}</span>
          </div>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark">&lt; ₹25,000</span>
              <span className="text-primary font-semibold">(94)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark">₹25,000 - ₹30,000</span>
              <span className="text-primary font-semibold">(46)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark">₹30,000 - ₹45,000</span>
              <span className="text-primary font-semibold">(72)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark">&gt; ₹45,000</span>
              <span className="text-primary font-semibold">(65)</span>
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Hotel Category */}
      <FilterSection
        title="Hotel Category"
        isExpanded={expandedSections.hotel}
        onToggle={() => toggleSection("hotel")}
      >
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "<3★", count: 1 },
            { label: "3★", count: 147 },
            { label: "4★", count: 39 },
            { label: "5★", count: 53 },
          ].map((hotel) => (
            <button
              key={hotel.label}
              className="px-3 py-2 rounded-lg border border-gray-300 text-dark text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <div className="text-center">
                <div>{hotel.label}</div>
                <div className="text-xs text-primary font-semibold">({hotel.count})</div>
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
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search cities"
              value={citiesSearch}
              onChange={(e) => setCitiesSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            {visibleCities.map((city) => (
              <label key={city.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
                <span className="text-dark text-sm">{city.name}</span>
                <span className="text-primary font-semibold text-sm">({city.count})</span>
              </label>
            ))}
          </div>
          {!showMoreCities && (
            <button
              onClick={() => setShowMoreCities(true)}
              className="text-primary font-semibold text-sm hover:underline"
            >
              Show More
            </button>
          )}
        </div>
      </FilterSection>

      {/* Buy Now, Pay Later */}
      <FilterSection
        title="Buy Now, Pay Later"
        isExpanded={expandedSections.buyNow}
        onToggle={() => toggleSection("buyNow")}
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
          <span className="text-dark text-sm">Book @ ₹2,000</span>
          <span className="text-primary font-semibold text-sm">(40)</span>
        </label>
      </FilterSection>

      {/* Themes */}
      <FilterSection
        title="Themes"
        isExpanded={expandedSections.themes}
        onToggle={() => toggleSection("themes")}
      >
        <div className="space-y-2">
          {visibleThemes.map((theme) => (
            <label key={theme.name} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-dark text-sm">{theme.name}</span>
              <span className="text-primary font-semibold text-sm">({theme.count})</span>
            </label>
          ))}
        </div>
        {!showMoreThemes && (
          <button
            onClick={() => setShowMoreThemes(true)}
            className="text-primary font-semibold text-sm hover:underline mt-2"
          >
            Show More
          </button>
        )}
      </FilterSection>

      {/* Package Type */}
      <FilterSection
        title="Package Type"
        isExpanded={expandedSections.packageType}
        onToggle={() => toggleSection("packageType")}
      >
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Customizable", count: 213 },
            { label: "Group Package", count: 8 },
          ].map((type) => (
            <button
              key={type.label}
              className="px-3 py-2 rounded-lg border border-gray-300 text-dark text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <div className="text-center">
                <div>{type.label}</div>
                <div className="text-xs text-primary font-semibold">({type.count})</div>
              </div>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Premium Packages */}
      <FilterSection
        title="Premium Packages"
        isExpanded={expandedSections.premium}
        onToggle={() => toggleSection("premium")}
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
          <span className="text-dark text-sm">Premium packages</span>
          <span className="text-primary font-semibold text-sm">(41)</span>
        </label>
      </FilterSection>

      {/* Reset Filters */}
      <button className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-dark font-semibold hover:bg-gray-50 transition-colors text-sm">
        Clear Filters
      </button>
    </div>
  )
}

function FilterSection({ title, isExpanded, onToggle, children }) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 hover:text-primary transition-colors"
      >
        <h4 className="font-bold text-dark text-sm">{title}</h4>
        {isExpanded ? (
          <ChevronUp size={18} className="text-muted" />
        ) : (
          <ChevronDown size={18} className="text-muted" />
        )}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  )
}
