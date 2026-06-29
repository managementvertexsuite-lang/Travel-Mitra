import { Plane, Hotel, Train, Bus, Gift, Car, Globe, Heart, User } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Plane className="text-primary w-8 h-8" />
              <span className="text-2xl font-bold text-primary">
                make<span className="text-accent">MyTrip</span>
              </span>
            </div>

            {/* Links */}
            <nav className="hidden md:flex gap-8">
              <NavLink label="Flights" icon={<Plane size={18} />} />
              <NavLink label="Hotels" icon={<Hotel size={18} />} />
              <NavLink label="Trains" icon={<Train size={18} />} />
              <NavLink label="Buses" icon={<Bus size={18} />} />
              <NavLink label="Holidays" icon={<Gift size={18} />} />
              <NavLink label="Cabs" icon={<Car size={18} />} />
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe size={18} className="text-muted" />
              <span className="text-sm font-medium text-dark hidden md:inline">
                EN | INR
              </span>
            </button>

            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart size={20} className="text-muted" />
            </button>

            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
              <User size={18} />
              <span className="hidden sm:inline">Login</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden overflow-x-auto pb-3">
          <div className="flex gap-4 min-w-min">
            <MobileNavItem label="Flights" icon={<Plane size={16} />} />
            <MobileNavItem label="Hotels" icon={<Hotel size={16} />} />
            <MobileNavItem label="Trains" icon={<Train size={16} />} />
            <MobileNavItem label="Buses" icon={<Bus size={16} />} />
            <MobileNavItem label="Holidays" icon={<Gift size={16} />} />
            <MobileNavItem label="Cabs" icon={<Car size={16} />} />
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ label, icon }) {
  return (
    <button className="flex flex-col items-center gap-1 text-muted hover:text-primary transition-colors group">
      <span className="text-primary group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function MobileNavItem({ label, icon }) {
  return (
    <button className="flex flex-col items-center gap-1 px-3 py-2 text-muted hover:text-primary transition-colors min-w-fit">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
