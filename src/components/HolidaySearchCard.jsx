import { useState, useRef, useEffect } from "react";
import {
  ArrowRightLeft,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LocationSelector from "./LocationSelector";
import CalendarDropdown from "./CalendarDropdown";
import { formatDate, formatDateISO, getToday } from "../utils/dateUtils";
import { destinations } from "../data/destinations";
import { CATEGORY_TABS } from "../utils/categoryPackages";

import banner1 from "../banners/banner1.png";
import banner2 from "../banners/banner2.png";
import banner3 from "../banners/banner3.png";
import banner4 from "../banners/banner4.png";

const BANNER_IMAGES = [banner1, banner2, banner3, banner4];

export default function HolidaySearchCard({
  onSearch,
  onCategorySearch,
  onDestinationClick,
  onPackageClick,
}) {
  const mockFromLocation = { id: 1, city: "Delhi" };
  const searchCardRef = useRef(null);
  const [activeTab, setActiveTab] = useState("search");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchCardRef.current && !searchCardRef.current.contains(event.target)) {
        setFromOpen(false);
        setToOpen(false);
        setDepartureCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Location states
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [departureCalendarOpen, setDepartureCalendarOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState(null);
  const [travelers, setTravelers] = useState(2);
  const [errors, setErrors] = useState({});

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 3000);
    return () => clearInterval(bannerInterval);
  }, []);

  // Duration state
  const [duration, setDuration] = useState("5");

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const validateSearch = () => {
    const newErrors = {};

    if (!fromLocation) newErrors.from = "Please select departure city";
    if (!toLocation) newErrors.to = "Please select destination";
    if (fromLocation && toLocation && fromLocation.id === toLocation.id) {
      newErrors.location = "Departure and destination cannot be the same";
    }
    if (!departureDate) newErrors.departure = "Please select departure date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!validateSearch()) return;

    const payload = {
      from: fromLocation,
      to: toLocation,
      departureDate: formatDateISO(departureDate),
      duration: parseInt(duration),
      travelers: parseInt(travelers),
    };

    onSearch(payload);
  };

  const handleCategoryTabClick = (tab) => {
    if (tab.isSearch) {
      setActiveTab("search");
      return;
    }

    setActiveTab(tab.id);
    const today = new Date();
    const departureDate = new Date(today);
    departureDate.setDate(departureDate.getDate() + 5);

    onCategorySearch?.({
      from: mockFromLocation,
      category: tab.id,
      categoryLabel: tab.label,
      duration: 5,
      travelers: 2,
      departureDate: departureDate.toISOString().split("T")[0],
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative h-[550px] sm:h-[650px] bg-cover bg-center flex flex-col"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1259&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-10 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md shadow-lg border-b border-white/10 transition-all">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img
              src="https://miro.medium.com/v2/resize:fit:1025/1%2AgCdn4NaRqwe-jqzyPToPXg.jpeg"
              alt="Logo"
              className="w-8 h-8 rounded-lg shadow-sm"
            />
            <span className="text-white text-xl drop-shadow-md font-bold font-serif leading-none tracking-wide">
              Travel Mitra
            </span>
          </button>
          <div className="hidden sm:flex items-center gap-8">
            <a
              href="#"
              className="text-white font-medium hover:text-gray-200 drop-shadow-md transition-colors"
            >
              Packages
            </a>
            <a
              href="#"
              className="text-white font-medium hover:text-gray-200 drop-shadow-md transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-white font-medium hover:text-gray-200 drop-shadow-md transition-colors"
            >
              Contact
            </a>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-medium transition-colors shadow-lg">
              Get Started
            </button>
          </div>
        </header>

        {/* Search Card in the Middle */}
        <div className="relative z-40 flex-grow flex items-center justify-center px-4 w-full max-w-7xl mx-auto pb-16 mb-8">
          <div className="bg-white rounded-xl shadow-2xl relative flex flex-col w-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-[#f8fbff] rounded-t-xl px-2 pt-2 overflow-x-auto">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategoryTabClick(tab)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 text-blue-500 font-bold bg-white rounded-t-lg"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
                >
                  {tab.isSearch ? (
                    <Search className="w-4 h-4" />
                  ) : (
                    <span className="text-lg">{tab.emoji}</span>
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Error Messages */}
            {Object.values(errors).length > 0 && (
              <div className="p-3 bg-red-50 border-b border-red-100 text-sm text-red-600 font-medium flex flex-wrap gap-4">
                {errors.location && <span>{errors.location}</span>}
                {errors.from && <span>{errors.from}</span>}
                {errors.to && <span>{errors.to}</span>}
                {errors.departure && <span>{errors.departure}</span>}
              </div>
            )}

            {/* Form Fields Wrapper */}
            <div className="px-5 pt-5 pb-3" ref={searchCardRef}>
              <div className="border border-gray-300 rounded-xl grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                {/* From */}
                <div
                  className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group rounded-l-xl"
                  onClick={() => {
                    if (!fromOpen) {
                      setFromOpen(true);
                      setToOpen(false);
                      setDepartureCalendarOpen(false);
                    } else {
                      setFromOpen(false);
                    }
                  }}
                >
                  <div className="text-[13px] text-gray-500 font-semibold mb-1">
                    From City
                  </div>
                  <div className="text-3xl font-black text-black">
                    {fromLocation?.city || "New Delhi"}
                  </div>
                  <div className="text-[13px] text-gray-500 mt-1 truncate">
                    India
                  </div>

                  <LocationSelector
                    isOpen={fromOpen}
                    onClose={() => setFromOpen(false)}
                    onSelect={setFromLocation}
                    title="Select Departure City"
                    selectedLocation={fromLocation}
                  />
                </div>

                {/* To */}
                <div
                  className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group"
                  onClick={() => {
                    if (!toOpen) {
                      setToOpen(true);
                      setFromOpen(false);
                      setDepartureCalendarOpen(false);
                    } else {
                      setToOpen(false);
                    }
                  }}
                >
                  <div className="text-[13px] text-gray-500 font-semibold mb-1 truncate">
                    To City/Country/Category
                  </div>
                  <div className="text-3xl font-black text-black">
                    {toLocation?.city || "Goa"}
                  </div>

                  <LocationSelector
                    isOpen={toOpen}
                    onClose={() => setToOpen(false)}
                    onSelect={setToLocation}
                    title="Select Destination"
                    selectedLocation={toLocation}
                  />
                </div>

                {/* Departure */}
                <div
                  className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group"
                  onClick={() => {
                    if (!departureCalendarOpen) {
                      setDepartureCalendarOpen(true);
                      setFromOpen(false);
                      setToOpen(false);
                    } else {
                      setDepartureCalendarOpen(false);
                    }
                  }}
                >
                  <div className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                    Departure Date{" "}
                    <span className="text-blue-500 text-[10px]">▼</span>
                  </div>
                  <div className="text-[28px] font-black text-black leading-none mt-2">
                    {departureDate
                      ? formatDate(departureDate).split(" ")[0]
                      : "13"}{" "}
                    <span className="text-lg font-bold">
                      {departureDate
                        ? formatDate(departureDate).split(" ")[1]
                        : "Aug, 2026"}
                    </span>
                  </div>
                  <div className="text-[13px] text-gray-500 mt-1">Thursday</div>

                  <CalendarDropdown
                    isOpen={departureCalendarOpen}
                    onClose={() => setDepartureCalendarOpen(false)}
                    onSelect={setDepartureDate}
                    selectedDate={departureDate}
                    minDate={getToday()}
                  />
                </div>

                {/* Rooms */}
                <div className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group">
                  <div className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                    Rooms & Guests{" "}
                    <span className="text-blue-500 text-[10px]">▼</span>
                  </div>
                  <div className="text-[28px] font-black text-black leading-none mt-2">
                    {travelers || "2"}{" "}
                    <span className="text-lg font-bold">Adults</span>
                  </div>
                  <div className="text-[13px] text-gray-500 mt-1">1 Room</div>
                </div>

                {/* Filters */}
                <div className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group rounded-r-xl">
                  <div className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                    Filters <span className="text-blue-500 text-[10px]">▼</span>
                  </div>
                  <div className="text-sm font-bold text-black mt-2 leading-tight">
                    Select Filters <br />{" "}
                    <span className="text-gray-500 font-medium">
                      (Optional)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-6 pb-10 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">
                  Recent Searches:
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs flex items-center gap-1 font-medium">
                  {fromLocation?.city || "New Delhi"}{" "}
                  <span className="text-blue-400">→</span>{" "}
                  {toLocation?.city || "Goa"}
                </span>
              </div>
              <span className="text-[13px] font-bold text-gray-600 hidden sm:block">
                Holiday Packages
              </span>
            </div>

            {/* Overlapping Search Button */}
            <div className="absolute -bottom-6 w-full flex justify-center items-center">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white font-bold text-xl px-16 py-3.5 rounded-full shadow-xl"
              >
                SEARCH
              </button>
            </div>
          </div>
        </div>

        {/* Banner Carousel */}
        <div className="absolute -bottom-56 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20 flex flex-col items-center">
          <div className="w-full relative overflow-hidden group">
            {/* Sliding Images Container */}
            <div 
              className="flex w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {BANNER_IMAGES.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-auto flex-shrink-0 object-contain"
                />
              ))}
            </div>
          </div>

          {/* Banner Dots Outside */}
          <div className="flex gap-2 mt-4">
            {BANNER_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentBanner ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-72 space-y-16">
        <CarouselSection
          title="All Moods of Travel SALE!"
          subtitle="Up to 40% OFF* • Use Code: TRAVELMOOD"
          packages={ALL_MOODS_PACKAGES}
          onSearch={onSearch}
          mockFromLocation={mockFromLocation}
        />
        <CarouselSection
          title="Last-Minute Escape Sale!"
          subtitle="Book your spontaneous getaway. Use code: LASTMINUTE"
          packages={LAST_MINUTE_PACKAGES}
          onSearch={onSearch}
          mockFromLocation={mockFromLocation}
        />
        <CarouselSection
          title="Spiritual Escapes at Lowest prices!"
          subtitle="Explore Pilgrimage packages"
          packages={SPIRITUAL_PACKAGES}
          onSearch={onSearch}
          mockFromLocation={mockFromLocation}
        />
        <CarouselSection
          title="Adventure Awaits!"
          subtitle="Adrenaline rush and outdoor activities"
          packages={ADVENTURE_PACKAGES}
          onSearch={onSearch}
          mockFromLocation={mockFromLocation}
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-dark mb-2">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}

const mapDestinationToPackage = (dest) => ({
  id: dest._id || dest.destinationId,
  destinationId: dest.destinationId,
  name: dest.name,
  image: dest.coverImage || (dest.gallery && dest.gallery[0]) || "",
});

const ALL_MOODS_PACKAGES = destinations
  .slice(0, 10)
  .map(mapDestinationToPackage);

const LAST_MINUTE_PACKAGES = destinations
  .filter(
    (d) =>
      d.destinationType?.includes("beach") ||
      d.destinationType?.includes("family"),
  )
  .map(mapDestinationToPackage);

const SPIRITUAL_PACKAGES = destinations
  .filter(
    (d) =>
      d.destinationType?.includes("religious") ||
      d.destinationType?.includes("cultural"),
  )
  .map(mapDestinationToPackage);

const ADVENTURE_PACKAGES = destinations
  .filter((d) => d.destinationType?.includes("adventure"))
  .map(mapDestinationToPackage);

function CarouselSection({
  title,
  subtitle,
  packages,
  onSearch,
  mockFromLocation,
}) {
  const scroll = (direction) => {
    const container = document.getElementById(`carousel-${title}`);
    const scrollAmount = 400;
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const handleCardClick = (pkg) => {
    // Simulate search form submission with carousel package destination
    const today = new Date();
    const departureDate = new Date(today);
    departureDate.setDate(departureDate.getDate() + 5);

    const payload = {
      from: mockFromLocation,
      to: {
        city: pkg.name,
        id: pkg.id,
        destinationId: pkg.destinationId,
      },
      departureDate: departureDate.toISOString().split("T")[0],
      duration: 5,
      travelers: 2,
    };
    onSearch && onSearch(payload);
  };

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl sm:text-[32px] font-black text-black mb-1">
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
        </div>
        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-full px-1 py-1 bg-white shadow-sm">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-blue-500" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Carousel Container */}
        <div
          id={`carousel-${title}`}
          className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {packages.map((pkg) => {
            const isUrl = pkg.image && pkg.image.startsWith("http");
            return (
              <div
                key={pkg.id}
                onClick={() => handleCardClick(pkg)}
                className="flex-shrink-0 w-32 h-48 sm:w-[150px] sm:h-[220px] rounded-[14px] overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group relative bg-cover bg-center flex flex-col justify-end p-4"
                style={{
                  backgroundImage: isUrl ? `url(${pkg.image})` : undefined,
                  backgroundColor: !isUrl ? "#e7edf8" : undefined, // fallback background for emoji
                }}
              >
                {isUrl && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                )}

                <div className="relative z-10">
                  {!isUrl && (
                    <div className="text-5xl mb-2 group-hover:scale-110 transition-transform origin-bottom text-center">
                      {pkg.image}
                    </div>
                  )}
                  <h3
                    className={`text-sm sm:text-[15px] font-bold tracking-wide ${isUrl ? "text-white" : "text-dark"}`}
                  >
                    {pkg.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
