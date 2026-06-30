import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

const BUDGET_BUCKETS = [
  { id: "under40", label: "< Rs 40,000", min: 0, max: 39999 },
  { id: "40to50", label: "Rs 40,000 - Rs 50,000", min: 40000, max: 50000 },
  { id: "50to60", label: "Rs 50,000 - Rs 60,000", min: 50001, max: 60000 },
  { id: "over60", label: "> Rs 60,000", min: 60001, max: Infinity },
]

const THEME_OPTIONS = ["Culture", "Adventure", "Honeymoon", "Family", "Wellness", "Beach", "Luxury"]

export default function FilterSidebar({ filters, setFilters, packages = [] }) {
  const [expandedSections, setExpandedSections] = useState({
    duration: true,
    flights: true,
    budget: true,
    hotel: true,
    cities: true,
    themes: true,
  })
  const [citiesSearch, setCitiesSearch] = useState("")
  const [showMoreCities, setShowMoreCities] = useState(false)
  const [showMoreThemes, setShowMoreThemes] = useState(false)

  const counts = useMemo(() => {
    const cityMap = new Map()
    const themeMap = new Map()
    const hotels = { 2: 0, 3: 0, 4: 0, 5: 0 }

    packages.forEach((pkg) => {
      cityMap.set(pkg.destination, (cityMap.get(pkg.destination) || 0) + 1)
      hotels[pkg.hotelCategory || 3] = (hotels[pkg.hotelCategory || 3] || 0) + 1

      THEME_OPTIONS.forEach((theme) => {
        if ((pkg.themes || "").includes(theme.toLowerCase())) {
          themeMap.set(theme, (themeMap.get(theme) || 0) + 1)
        }
      })
    })

    return {
      withFlight: packages.filter((pkg) => pkg.flightIncluded).length,
      withoutFlight: packages.filter((pkg) => !pkg.flightIncluded).length,
      budget: Object.fromEntries(
        BUDGET_BUCKETS.map((bucket) => [
          bucket.id,
          packages.filter((pkg) => pkg.price >= bucket.min && pkg.price <= bucket.max).length,
        ]),
      ),
      hotels,
      cities: [...cityMap.entries()].map(([name, count]) => ({ name, count })),
      themes: THEME_OPTIONS.map((name) => ({ name, count: themeMap.get(name) || 0 })).filter((theme) => theme.count > 0),
    }
  }, [packages])

  const visibleCities = (showMoreCities ? counts.cities : counts.cities.slice(0, 4)).filter((city) =>
    city.name.toLowerCase().includes(citiesSearch.toLowerCase()),
  )
  const visibleThemes = showMoreThemes ? counts.themes : counts.themes.slice(0, 4)

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const clearFilters = () => {
    setFilters({
      duration: [1, 12],
      flights: "all",
      budget: [0, 100000],
      hotelCategory: "all",
      themes: [],
      cities: [],
    })
  }

  const toggleBudgetBucket = (bucket) => {
    setFilters((prev) => ({
      ...prev,
      budget: prev.budgetBucket === bucket.id ? [0, 100000] : [bucket.min, bucket.max === Infinity ? 1000000 : bucket.max],
      budgetBucket: prev.budgetBucket === bucket.id ? null : bucket.id,
    }))
  }

  const toggleHotel = (category) => {
    setFilters((prev) => ({
      ...prev,
      hotelCategory: prev.hotelCategory === category ? "all" : category,
    }))
  }

  const toggleArrayValue = (key, value) => {
    setFilters((prev) => {
      const selected = prev[key] || []
      return {
        ...prev,
        [key]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      }
    })
  }

  return (
    <div className="bg-white w-full">
      <div className="pb-6">
        <FilterSection title="Duration (in Nights)" isExpanded={expandedSections.duration} onToggle={() => toggleSection("duration")}>
          <div className="pt-2 pb-4">
            <input
              type="range"
              min="1"
              max="12"
              value={filters.duration?.[1] || 12}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, duration: [1, Number(e.target.value)] }))
              }
              className="w-full accent-[#007aff]"
            />
            <div className="flex items-center justify-between text-[13px] text-gray-600 font-medium">
              <span>1N</span>
              <span>{filters.duration?.[1] || 12}N</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Flights" isExpanded={expandedSections.flights} onToggle={() => toggleSection("flights")}>
          <div className="flex gap-3 pt-2 pb-2">
            <FlightButton active={filters.flights === "with"} onClick={() => setFilters((prev) => ({ ...prev, flights: prev.flights === "with" ? "all" : "with" }))}>
              With Flight ({counts.withFlight})
            </FlightButton>
            <FlightButton active={filters.flights === "without"} onClick={() => setFilters((prev) => ({ ...prev, flights: prev.flights === "without" ? "all" : "without" }))}>
              Without Flight ({counts.withoutFlight})
            </FlightButton>
          </div>
        </FilterSection>

        <FilterSection title="Budget (per person)" isExpanded={expandedSections.budget} onToggle={() => toggleSection("budget")}>
          <div className="space-y-3 pt-2 pb-2">
            {BUDGET_BUCKETS.map((bucket) => (
              <CheckboxRow
                key={bucket.id}
                label={bucket.label}
                count={counts.budget[bucket.id] || 0}
                checked={filters.budgetBucket === bucket.id}
                onChange={() => toggleBudgetBucket(bucket)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Hotel Category" isExpanded={expandedSections.hotel} onToggle={() => toggleSection("hotel")}>
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[2, 3, 4, 5].map((hotel) => (
              <button
                key={hotel}
                onClick={() => toggleHotel(hotel)}
                className={`px-2 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  filters.hotelCategory === hotel
                    ? "border-[#007aff] bg-blue-50 text-[#007aff]"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{hotel} Star</span>
                <span className="block text-[11px] text-gray-500 mt-0.5">({counts.hotels[hotel] || 0})</span>
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Cities" isExpanded={expandedSections.cities} onToggle={() => toggleSection("cities")}>
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
                <CheckboxRow
                  key={city.name}
                  label={city.name}
                  count={city.count}
                  checked={(filters.cities || []).includes(city.name)}
                  onChange={() => toggleArrayValue("cities", city.name)}
                />
              ))}
            </div>
            {counts.cities.length > 4 && !showMoreCities && (
              <button onClick={() => setShowMoreCities(true)} className="text-[#007aff] font-semibold text-[13px] hover:underline">
                Show More
              </button>
            )}
          </div>
        </FilterSection>

        <FilterSection title="Themes" isExpanded={expandedSections.themes} onToggle={() => toggleSection("themes")}>
          <div className="space-y-4 pt-2">
            {visibleThemes.map((theme) => (
              <CheckboxRow
                key={theme.name}
                label={theme.name}
                count={theme.count}
                checked={(filters.themes || []).includes(theme.name)}
                onChange={() => toggleArrayValue("themes", theme.name)}
              />
            ))}
            {counts.themes.length > 4 && !showMoreThemes && (
              <button onClick={() => setShowMoreThemes(true)} className="text-[#007aff] font-semibold text-[13px] hover:underline mt-2">
                Show More
              </button>
            )}
          </div>
        </FilterSection>

        <button onClick={clearFilters} className="w-full mt-6 py-3 px-4 border border-[#007aff] text-[#007aff] rounded-lg font-bold hover:bg-blue-50 transition-colors text-[14px]">
          CLEAR FILTERS
        </button>
      </div>
    </div>
  )
}

function FlightButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-2 border rounded-lg flex items-center justify-center text-[13px] whitespace-nowrap transition-colors ${
        active
          ? "border-[#007aff] bg-blue-50 text-[#007aff] font-semibold"
          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  )
}

function FilterSection({ title, isExpanded, onToggle, children }) {
  return (
    <div className="border-b border-gray-200 pb-5 mb-2">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-4 hover:text-[#007aff] transition-colors">
        <h4 className="text-[16px] font-bold text-gray-900 whitespace-nowrap leading-tight">{title}</h4>
        {isExpanded ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
      </button>
      {isExpanded && <div className="mt-1">{children}</div>}
    </div>
  )
}

function CheckboxRow({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer w-full group gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-[18px] h-[18px] border-2 border-gray-400 rounded-sm accent-[#007aff] cursor-pointer flex-shrink-0"
        />
        <span className="text-[14px] text-gray-700 truncate">{label}</span>
      </div>
      <span className="text-[14px] text-gray-500 whitespace-nowrap flex-shrink-0">({count})</span>
    </label>
  )
}
