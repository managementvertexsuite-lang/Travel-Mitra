import { useState, useEffect } from "react"
import { X, Search, MapPin, Loader } from "lucide-react"
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
    }
  }, [isOpen])

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
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      <div
        className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl p-6 z-50 max-h-96 overflow-hidden flex flex-col transition-all duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <h3 className="font-semibold text-dark text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-muted" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search cities or airport codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin text-primary w-6 h-6" />
            </div>
          ) : searchQuery.trim() ? (
            <>
              {filteredLocations.length > 0 ? (
                <div className="space-y-2">
                  {filteredLocations.map((location) => (
                    <LocationItem
                      key={location.id}
                      location={location}
                      isSelected={selectedLocation?.id === location.id}
                      onClick={() => handleSelect(location)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted text-sm">No locations found</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Popular Cities Section */}
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase mb-3">
                  Popular Cities
                </h4>
                <div className="space-y-2">
                  {popularLocs.map((location) => (
                    <LocationItem
                      key={location.id}
                      location={location}
                      isSelected={selectedLocation?.id === location.id}
                      onClick={() => handleSelect(location)}
                    />
                  ))}
                </div>
              </div>

              {/* All Cities Section */}
              {allLocations.length > popularLocs.length && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-muted uppercase mb-3">
                    All Cities
                  </h4>
                  <div className="space-y-2">
                    {allLocations
                      .filter((loc) => !popularLocs.find((p) => p.id === loc.id))
                      .map((location) => (
                        <LocationItem
                          key={location.id}
                          location={location}
                          isSelected={selectedLocation?.id === location.id}
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
    </>
  )
}

function LocationItem({ location, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors duration-150 ${
        isSelected
          ? "bg-blue-50 border-l-4 border-primary"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <MapPin
          size={16}
          className={`mt-1 flex-shrink-0 ${
            isSelected ? "text-primary" : "text-muted"
          }`}
        />
        <div className="flex-1">
          <p className={`font-medium ${isSelected ? "text-primary" : "text-dark"}`}>
            {location.city}
          </p>
          <p className="text-xs text-muted">
            {location.code} • {location.state}
          </p>
        </div>
      </div>
    </button>
  )
}
