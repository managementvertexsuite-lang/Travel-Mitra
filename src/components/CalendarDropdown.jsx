import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  formatDate,
  formatDateISO,
  getToday,
  getDaysInMonth,
  getFirstDayOfMonth,
  addMonths,
  getMonthName,
  isTodayOrFuture,
} from "../utils/dateUtils"

export default function CalendarDropdown({
  isOpen,
  onClose,
  onSelect,
  selectedDate,
  minDate,
  maxDate,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [nextMonth, setNextMonth] = useState(addMonths(currentMonth, 1))

  useEffect(() => {
    if (isOpen && minDate) {
      setCurrentMonth(new Date(minDate))
      setNextMonth(addMonths(new Date(minDate), 1))
    } else if (isOpen) {
      const today = getToday()
      setCurrentMonth(today)
      setNextMonth(addMonths(today, 1))
    }
  }, [isOpen, minDate])

  const handlePrevMonth = () => {
    if (minDate) {
      const min = new Date(minDate)
      const prev = addMonths(currentMonth, -1)
      if (prev >= min) {
        setCurrentMonth(prev)
        setNextMonth(addMonths(prev, 1))
      }
    }
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
    setNextMonth(addMonths(currentMonth, 2))
  }

  const handleSelectDate = (day, month) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day)
    onSelect(date)
    onClose()
  }

  const isDateDisabled = (day, month) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day)
    if (!isTodayOrFuture(date)) return true
    if (maxDate && date > new Date(maxDate)) return true
    return false
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />
      )}

      <div
        className={`absolute top-full left-0 bg-white rounded-2xl shadow-2xl p-4 z-50 transition-all duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex gap-4">
          {/* Current Month */}
          <CalendarMonth
            month={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={(day) => handleSelectDate(day, currentMonth)}
            isDateDisabled={(day) => isDateDisabled(day, currentMonth)}
            onPrev={handlePrevMonth}
            onNext={() => {
              setCurrentMonth(nextMonth)
              setNextMonth(addMonths(nextMonth, 1))
            }}
            showPrev={true}
          />

          {/* Next Month */}
          <CalendarMonth
            month={nextMonth}
            selectedDate={selectedDate}
            onSelectDate={(day) => handleSelectDate(day, nextMonth)}
            isDateDisabled={(day) => isDateDisabled(day, nextMonth)}
            onPrev={() => {
              setCurrentMonth(addMonths(currentMonth, -1))
              setNextMonth(currentMonth)
            }}
            onNext={handleNextMonth}
            showNext={true}
          />
        </div>
      </div>
    </>
  )
}

function CalendarMonth({
  month,
  selectedDate,
  onSelectDate,
  isDateDisabled,
  onPrev,
  onNext,
  showPrev,
  showNext,
}) {
  const daysInMonth = getDaysInMonth(month)
  const firstDay = getFirstDayOfMonth(month)
  const today = getToday()

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2">
        {showPrev && (
          <button
            onClick={onPrev}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={18} className="text-muted" />
          </button>
        )}
        <h3 className="font-semibold text-dark flex-1 text-center">
          {getMonthName(month)}
        </h3>
        {showNext && (
          <button
            onClick={onNext}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={18} className="text-muted" />
          </button>
        )}
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const date = new Date(month.getFullYear(), month.getMonth(), day)
          const isSelected =
            selectedDate &&
            date.toDateString() === new Date(selectedDate).toDateString()
          const isToday = date.toDateString() === today.toDateString()
          const disabled = isDateDisabled(day)

          return (
            <button
              key={day}
              onClick={() => !disabled && onSelectDate(day)}
              disabled={disabled}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                disabled
                  ? "text-gray-300 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary text-white"
                  : isToday
                  ? "border-2 border-primary text-primary"
                  : "hover:bg-gray-100 text-dark"
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
