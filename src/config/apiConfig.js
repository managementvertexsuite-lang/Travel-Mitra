// API Configuration
// Change this to your actual backend URL when ready

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"

const API_ENDPOINTS = {
  LOCATIONS: `${API_BASE_URL}/locations`,
  POPULAR_CITIES: `${API_BASE_URL}/locations/popular`,
  TRIPS: `${API_BASE_URL}/trips/search`,
  AVAILABLE_DATES: `${API_BASE_URL}/trips/available-dates`,
  TRAVELLER_CLASSES: `${API_BASE_URL}/traveller-classes`,
}

export { API_BASE_URL, API_ENDPOINTS }
