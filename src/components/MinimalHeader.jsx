import { Plane, User } from "lucide-react"

export default function MinimalHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Plane className="text-primary w-8 h-8" />
            <span className="text-2xl font-bold text-primary">
              make<span className="text-accent">MyTrip</span>
            </span>
          </div>

          {/* Login Button */}
          <button className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <User size={18} />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  )
}
