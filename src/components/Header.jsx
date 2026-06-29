export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header
          className="relative z-10 w-full px-6 sm:px-10 py-6 flex justify-between items-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1259&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src="https://miro.medium.com/v2/resize:fit:1025/1%2AgCdn4NaRqwe-jqzyPToPXg.jpeg"
              alt="Logo"
              className="w-6 h-6 rounded-lg"
            />
            <span className="text-white text-lg drop-shadow-md font-semibold font-light font-serif leading-none tracking-wide">
              Travel Mitra
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <a
              href="#"
              className="text-white font-medium hover:text-gray-200 drop-shadow-md"
            >
              Packages
            </a>
            <a
              href="#"
              className="text-white font-medium hover:text-gray-200 drop-shadow-md"
            >
              About
            </a>
            <a
              href="#"
              className="text-white font-medium hover:text-gray-200 drop-shadow-md"
            >
              Contact
            </a>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-full font-medium transition-colors shadow-lg">
              Login
            </button>
          </div>
        </header>
      </div>
    </header>
  );
}

function NavLink({ label, icon }) {
  return (
    <button className="flex flex-col items-center gap-1 text-muted hover:text-primary transition-colors group">
      <span className="text-primary group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function MobileNavItem({ label, icon }) {
  return (
    <button className="flex flex-col items-center gap-1 px-3 py-2 text-muted hover:text-primary transition-colors min-w-fit">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
