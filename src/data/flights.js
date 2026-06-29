export const generateFlightResults = (from, to, date) => {
  const airlines = [
    { name: "Air India", logo: "AI" },
    { name: "IndiGo", logo: "6E" },
    { name: "SpiceJet", logo: "SG" },
    { name: "Vistara", logo: "UK" },
    { name: "GoAir", logo: "G8" },
    { name: "Akasa Air", logo: "QP" },
  ]

  const results = []

  for (let i = 0; i < 8; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const departureHour = 6 + Math.floor(Math.random() * 15)
    const departureMinute = Math.floor(Math.random() * 60)
    const durationHours = 2 + Math.floor(Math.random() * 4)
    const durationMinutes = Math.floor(Math.random() * 60)

    const depHour = String(departureHour).padStart(2, "0")
    const depMin = String(departureMinute).padStart(2, "0")
    const arrHour = String((departureHour + durationHours) % 24).padStart(2, "0")
    const arrMin = String(departureMinute).padStart(2, "0")

    results.push({
      id: i + 1,
      airline: airline.name,
      logo: airline.logo,
      departure: `${depHour}:${depMin}`,
      arrival: `${arrHour}:${arrMin}`,
      duration: `${durationHours}h ${durationMinutes}m`,
      price: Math.floor(Math.random() * 15000) + 5000,
      stops: Math.floor(Math.random() * 3),
      from,
      to,
      date,
      seats: Math.floor(Math.random() * 20) + 1,
    })
  }

  return results.sort((a, b) => a.price - b.price)
}
