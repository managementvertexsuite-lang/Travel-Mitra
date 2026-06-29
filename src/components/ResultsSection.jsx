import { Clock, Users, Plane, ChevronRight } from "lucide-react"
import { formatDate } from "../utils/dateUtils"

export default function ResultsSection({ payload, isLoading }) {
  if (!payload) return null

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Summary */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
            Showing trips from {payload.from?.city} to {payload.to?.city}
          </h2>
          <p className="text-muted">
            Departure: {formatDate(payload.departureDate)}
            {payload.returnDate && ` • Return: ${formatDate(payload.returnDate)}`}
          </p>
        </div>

        {/* Results */}
        {isLoading ? (
          <ShimmerLoader />
        ) : payload.results && payload.results.length > 0 ? (
          <div className="space-y-4">
            {payload.results.map((flight) => (
              <FlightCard key={flight.id} flight={flight} payload={payload} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Plane className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-muted text-lg">No flights found for your search</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FlightCard({ flight, payload }) {
  const travelers =
    payload.travellers.adults +
    payload.travellers.children +
    payload.travellers.infants

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
        {/* Airline */}
        <div>
          <p className="text-xs text-muted uppercase font-semibold mb-1">Airline</p>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary text-sm">{flight.logo}</span>
            </div>
            <div>
              <p className="font-semibold text-dark">{flight.airline}</p>
              <p className="text-xs text-muted">
                {flight.stops === 0
                  ? "Non-stop"
                  : `${flight.stops} ${flight.stops === 1 ? "stop" : "stops"}`}
              </p>
            </div>
          </div>
        </div>

        {/* Departure */}
        <div>
          <p className="text-xs text-muted uppercase font-semibold mb-1">Departure</p>
          <p className="text-2xl font-bold text-dark">{flight.departure}</p>
          <p className="text-xs text-muted">{flight.from}</p>
        </div>

        {/* Duration */}
        <div className="sm:text-center">
          <p className="text-xs text-muted uppercase font-semibold mb-2">Duration</p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-gray-300" />
            <p className="text-sm font-medium text-dark whitespace-nowrap">
              {flight.duration}
            </p>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
        </div>

        {/* Arrival */}
        <div>
          <p className="text-xs text-muted uppercase font-semibold mb-1">Arrival</p>
          <p className="text-2xl font-bold text-dark">{flight.arrival}</p>
          <p className="text-xs text-muted">{flight.to}</p>
        </div>

        {/* Price & Button */}
        <div className="sm:text-right">
          <p className="text-xs text-muted uppercase font-semibold mb-2">Price</p>
          <p className="text-2xl font-bold text-primary mb-3">₹{flight.price}</p>
          <button className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            Book Now
            <ChevronRight size={18} />
          </button>
          <p className="text-xs text-muted mt-2">For {travelers} travellers</p>
        </div>
      </div>
    </div>
  )
}

function ShimmerLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Airline Shimmer */}
            <div>
              <div className="h-3 bg-gray-200 rounded mb-3 w-20 shimmer-skeleton" />
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded shimmer-skeleton" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1 shimmer-skeleton" />
                  <div className="h-3 bg-gray-200 rounded w-16 shimmer-skeleton" />
                </div>
              </div>
            </div>

            {/* Departure Shimmer */}
            <div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-20 shimmer-skeleton" />
              <div className="h-6 bg-gray-200 rounded mb-2 w-24 shimmer-skeleton" />
              <div className="h-3 bg-gray-200 rounded w-16 shimmer-skeleton" />
            </div>

            {/* Duration Shimmer */}
            <div className="sm:text-center">
              <div className="h-3 bg-gray-200 rounded mb-3 w-20 mx-auto shimmer-skeleton" />
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto shimmer-skeleton" />
            </div>

            {/* Arrival Shimmer */}
            <div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-20 shimmer-skeleton" />
              <div className="h-6 bg-gray-200 rounded mb-2 w-24 shimmer-skeleton" />
              <div className="h-3 bg-gray-200 rounded w-16 shimmer-skeleton" />
            </div>

            {/* Price Shimmer */}
            <div className="sm:text-right">
              <div className="h-3 bg-gray-200 rounded mb-2 w-20 ml-auto shimmer-skeleton" />
              <div className="h-6 bg-gray-200 rounded mb-3 w-24 ml-auto shimmer-skeleton" />
              <div className="h-10 bg-gray-200 rounded w-full shimmer-skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
