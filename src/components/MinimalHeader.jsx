import { Plane, User } from "lucide-react";

export default function MinimalHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <img
              src="https://miro.medium.com/v2/resize:fit:1025/1%2AgCdn4NaRqwe-jqzyPToPXg.jpeg"
              alt="Logo"
              className="w-6 h-6 rounded-lg"
            />
            <span className="text-gray-900 text-xl font-bold font-serif leading-none tracking-wide">
              Travel Mitra
            </span>
          </div>
          
          <div className="hidden sm:flex items-center gap-8">
            <a
              href="#"
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
            >
              Packages
            </a>
            <a
              href="#"
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-medium transition-colors shadow-md">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
