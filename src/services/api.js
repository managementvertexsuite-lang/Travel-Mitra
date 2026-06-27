import { locations, popularCities } from "../data/locations"
import { generateFlightResults } from "../data/flights"
import { API_ENDPOINTS } from "../config/apiConfig"

// Dummy async function to simulate API calls
// Replace these with real Axios calls to your backend

export const fetchLocations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: locations,
      })
    }, 300)
  })
}

export const fetchPopularCities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const popularData = locations.filter((loc) =>
        popularCities.includes(loc.city)
      )
      resolve({
        success: true,
        data: popularData,
      })
    }, 200)
  })
}

export const fetchTrips = async (searchPayload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fromCity = searchPayload.from?.city || "Unknown"
      const toCity = searchPayload.to?.city || "Unknown"
      const date = searchPayload.departureDate || "2026-06-28"

      const results = generateFlightResults(fromCity, toCity, date)

      resolve({
        success: true,
        data: {
          from: searchPayload.from,
          to: searchPayload.to,
          departureDate: searchPayload.departureDate,
          returnDate: searchPayload.returnDate || null,
          tripType: searchPayload.tripType,
          travellers: searchPayload.travellers,
          class: searchPayload.class,
          results: results,
          total: results.length,
        },
      })
    }, 1500)
  })
}

export const fetchAvailableDates = async (from, to, startDate) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dates = []
      const baseDate = new Date(startDate)

      for (let i = 0; i < 30; i++) {
        const date = new Date(baseDate)
        date.setDate(date.getDate() + i)
        dates.push({
          date: date.toISOString().split("T")[0],
          available: Math.random() > 0.1,
          minPrice: Math.floor(Math.random() * 10000) + 3000,
        })
      }

      resolve({
        success: true,
        data: dates,
      })
    }, 400)
  })
}

export const fetchTravellerClasses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          { id: 1, name: "Economy", priceMultiplier: 1.0 },
          { id: 2, name: "Premium Economy", priceMultiplier: 1.5 },
          { id: 3, name: "Business", priceMultiplier: 2.5 },
          { id: 4, name: "First Class", priceMultiplier: 3.5 },
        ],
      })
    }, 300)
  })
}

// Real API calls with Axios (uncomment when backend is ready)
/*
import axios from 'axios'

export const fetchLocations = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.LOCATIONS)
    return response.data
  } catch (error) {
    console.error('Error fetching locations:', error)
    throw error
  }
}

export const fetchPopularCities = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.POPULAR_CITIES)
    return response.data
  } catch (error) {
    console.error('Error fetching popular cities:', error)
    throw error
  }
}

export const fetchTrips = async (searchPayload) => {
  try {
    const response = await axios.post(API_ENDPOINTS.TRIPS, searchPayload)
    return response.data
  } catch (error) {
    console.error('Error fetching trips:', error)
    throw error
  }
}

export const fetchAvailableDates = async (from, to, startDate) => {
  try {
    const response = await axios.get(API_ENDPOINTS.AVAILABLE_DATES, {
      params: { from, to, startDate },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching available dates:', error)
    throw error
  }
}

export const fetchTravellerClasses = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.TRAVELLER_CLASSES)
    return response.data
  } catch (error) {
    console.error('Error fetching traveller classes:', error)
    throw error
  }
}
*/
