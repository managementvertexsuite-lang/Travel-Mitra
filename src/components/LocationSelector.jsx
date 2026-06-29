import { useState, useEffect } from "react"
import { Search, LocateFixed, Loader } from "lucide-react"
import { fetchLocations, fetchPopularCities } from "../services/api"

export default function LocationSelector({ isOpen, onClose, onSelect, title, selectedLocation }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [allLocations, setAllLocations] = useState([])
  const [popularLocs, setPopularLocs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filteredLocations, setFilteredLocations] = useState([])

  useEffect(() => {
    if (isOpen) {
      loadData()
      setSearchQuery(selectedLocation?.city || "")
    }
  }, [isOpen, selectedLocation])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [locRes, popRes] = await Promise.all([
        fetchLocations(),
        fetchPopularCities(),
      ])
      setAllLocations(locRes.data)
      setPopularLocs(popRes.data)
      setFilteredLocations(locRes.data)
    } catch (error) {
      console.error("Error loading locations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations(allLocations)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allLocations.filter(
      (loc) =>
        loc.city.toLowerCase().includes(query) ||
        loc.code.toLowerCase().includes(query) ||
        loc.state.toLowerCase().includes(query)
    )
    setFilteredLocations(filtered)
  }, [searchQuery, allLocations])

  const handleSelect = (location) => {
    onSelect(location)
    setSearchQuery("")
    onClose()
  }

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 w-80 max-h-96 overflow-hidden flex flex-col z-50 transition-all duration-200 ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="p-2">
          {/* Search Bar */}
          <div className="relative mb-1 flex items-center">
            <Search className="absolute left-3 text-gray-800 w-4 h-4 font-bold" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-4 py-2 border-none outline-none font-bold text-lg text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>

          <div className="w-full h-[1px] bg-gray-100 my-1"></div>

          {/* Current Location */}
          <button className="w-full text-left px-3 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-md">
            <div className="text-blue-500 flex items-center justify-center">
              <LocateFixed size={18} strokeWidth={2.5} />
            </div>
            <span className="text-gray-800 font-medium text-[15px]">Use Current Location</span>
          </button>

          <div className="w-full h-[1px] bg-gray-200 my-2"></div>

          {/* Content */}
          <div className="overflow-y-auto max-h-60 px-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader className="animate-spin text-blue-500 w-5 h-5" />
              </div>
            ) : searchQuery.trim() && searchQuery.trim() !== selectedLocation?.city ? (
              <>
                {filteredLocations.length > 0 ? (
                  <div className="space-y-0.5">
                    {filteredLocations.map((location) => (
                      <LocationItem
                        key={location.id}
                        location={location}
                        onClick={() => handleSelect(location)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No locations found</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Top Searches Section */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2 mt-1">
                    Top Searches
                  </h4>
                  <div className="space-y-0.5">
                    {popularLocs.map((location) => (
                      <LocationItem
                        key={location.id}
                        location={location}
                        onClick={() => handleSelect(location)}
                      />
                    ))}
                  </div>
                </div>

                {/* All Cities Section */}
                {allLocations.length > popularLocs.length && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                      All Cities
                    </h4>
                    <div className="space-y-0.5">
                      {allLocations
                        .filter((loc) => !popularLocs.find((p) => p.id === loc.id))
                        .map((location) => (
                          <LocationItem
                            key={location.id}
                            location={location}
                            onClick={() => handleSelect(location)}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function LocationItem({ location, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2 py-2 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-md"
    >
      {location.city}
    </button>
  )
}
