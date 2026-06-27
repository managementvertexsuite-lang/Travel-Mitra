import { useState, useEffect } from "react"
import { X, Plus, Minus } from "lucide-react"

const TRAVELLER_CLASSES = [
  { id: "economy", name: "Economy" },
  { id: "premium", name: "Premium Economy" },
  { id: "business", name: "Business" },
  { id: "first", name: "First Class" },
]

export default function TravellerSelector({
  isOpen,
  onClose,
  onSelect,
  selectedTravellers,
  selectedClass,
}) {
  const [adults, setAdults] = useState(selectedTravellers?.adults || 1)
  const [children, setChildren] = useState(selectedTravellers?.children || 0)
  const [infants, setInfants] = useState(selectedTravellers?.infants || 0)
  const [selectedTravelClass, setSelectedTravelClass] = useState(selectedClass || "economy")

  useEffect(() => {
    if (isOpen && selectedTravellers) {
      setAdults(selectedTravellers.adults)
      setChildren(selectedTravellers.children)
      setInfants(selectedTravellers.infants)
    }
    if (isOpen && selectedClass) {
      setSelectedTravelClass(selectedClass)
    }
  }, [isOpen, selectedTravellers, selectedClass])

  const handleApply = () => {
    onSelect({
      adults,
      children,
      infants,
      class: selectedTravelClass,
    })
    onClose()
  }

  const incrementAdults = () => setAdults((prev) => prev + 1)
  const decrementAdults = () => setAdults((prev) => Math.max(1, prev - 1))

  const incrementChildren = () => setChildren((prev) => prev + 1)
  const decrementChildren = () => setChildren((prev) => Math.max(0, prev - 1))

  const incrementInfants = () => setInfants((prev) => prev + 1)
  const decrementInfants = () => setInfants((prev) => Math.max(0, prev - 1))

  const totalTravellers = adults + children + infants

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      <div
        className={`absolute top-full right-0 bg-white rounded-2xl shadow-2xl p-6 z-50 w-96 max-w-full transition-all duration-200 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="font-semibold text-dark text-lg">Travellers & Class</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-muted" />
          </button>
        </div>

        {/* Travellers Count */}
        <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
          <TravellerRow
            label="Adults"
            sublabel="12+ years"
            value={adults}
            onIncrement={incrementAdults}
            onDecrement={decrementAdults}
            minValue={1}
          />
          <TravellerRow
            label="Children"
            sublabel="2-11 years"
            value={children}
            onIncrement={incrementChildren}
            onDecrement={decrementChildren}
            minValue={0}
          />
          <TravellerRow
            label="Infants"
            sublabel="Below 2 years"
            value={infants}
            onIncrement={incrementInfants}
            onDecrement={decrementInfants}
            minValue={0}
          />
        </div>

        {/* Travel Class */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-dark mb-3">Travel Class</h4>
          <div className="space-y-2">
            {TRAVELLER_CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedTravelClass(cls.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedTravelClass === cls.id
                    ? "bg-blue-50 border-l-4 border-primary text-primary font-medium"
                    : "hover:bg-gray-50 text-dark"
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>

        {/* Summary */}
        <p className="text-center text-xs text-muted mt-3">
          {totalTravellers} {totalTravellers === 1 ? "traveller" : "travellers"} •{" "}
          {TRAVELLER_CLASSES.find((c) => c.id === selectedTravelClass)?.name}
        </p>
      </div>
    </>
  )
}

function TravellerRow({ label, sublabel, value, onIncrement, onDecrement, minValue }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-dark">{label}</p>
        <p className="text-xs text-muted">{sublabel}</p>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={onDecrement}
          disabled={value === minValue}
          className={`p-1 rounded transition-colors ${
            value === minValue
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-white text-dark"
          }`}
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-medium text-dark">{value}</span>
        <button
          onClick={onIncrement}
          className="p-1 rounded hover:bg-white text-dark transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
