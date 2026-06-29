export const formatDate = (date) => {
  if (!date) return ""
  if (typeof date === "string") {
    const d = new Date(date)
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export const formatDateISO = (date) => {
  if (!date) return ""
  if (typeof date === "string") return date
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const getToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const isTodayOrFuture = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d >= getToday()
}

export const isBeforeDate = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1 < d2
}

export const getDayName = (date) => {
  if (typeof date === "string") {
    const d = new Date(date)
    return d.toLocaleDateString("en-IN", { weekday: "short" })
  }
  return date.toLocaleDateString("en-IN", { weekday: "short" })
}

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export const addMonths = (date, months) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export const getMonthName = (date) => {
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
}

export const getDurationFromNow = (date) => {
  const today = getToday()
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const diff = Math.floor((d - today) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Today"
  if (diff === 1) return "Tomorrow"
  if (diff > 0) return `${diff} days away`
  return "Past date"
}
