import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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

const MEGA_MENU_DATA = {
  honeymoon: {
    headline: "Travel Mitra Honeymoon Packages",
    col1: ["Seychelles", "Europe", "Thailand", "Mauritius", "Vietnam"],
    col2: ["North East", "South India", "Andaman", "Goa", "Kerala"],
    featured: ["Bali", "Maldives", "Manali"],
  },
  "visa-free": {
    headline: "Dream Destinations, Zero Paperwork!",
    col1: ["Malaysia", "Hong Kong", "Bhutan", "Mauritius", "Seychelles"],
    col2: ["Kazakhstan", "Qatar", "Nepal"],
    featured: ["Maldives", "Thailand", "Sri Lanka"],
  },
  "group-tour": {
    headline: "Expertly Planned Group Tours",
    col1: ["Europe", "Japan", "New Zealand", "South Africa", "Singapore"],
    col2: ["Char Dham", "Kashmir", "Vietnam", "Ladakh", "Thailand"],
    featured: ["Kashmir", "Bali", "Dubai"],
  },
  "disney-cruise": {
    headline: "Book Your Sailings Now!",
    col1: ["Short Cruise 3N", "Epic Cruise 4N", "Disney Voyage 5N", "Disney Cruise 6N", "Grand Cruise 7N"],
    col2: ["Majestic Cruise 8N"],
    featured: ["Caribbean", "Europe"],
  },
  "last-minute": {
    headline: "Flash Deals — Book Now!",
    col1: ["Goa", "Dubai", "Manali", "Bali", "Shimla"],
    col2: ["Kerala", "Darjeeling", "Ooty"],
    featured: ["Goa", "Dubai", "Manali"],
  },
};

const getDestImage = (name) => {
  const d = destinations.find((d) =>
    d.name.toLowerCase().includes(name.toLowerCase())
  );
  return d?.coverImage || (d?.gallery && d.gallery[0]) || null;
};

export default function HolidaySearchCard({
  onSearch,
  onCategorySearch,
  onDestinationClick,
  onPackageClick,
}) {
  const mockFromLocation = { id: 1, city: "Delhi" };
  const mainCardRef = useRef(null);

  const [activeTab, setActiveTab] = useState("search");

  // Location states
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [departureCalendarOpen, setDepartureCalendarOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [duration, setDuration] = useState("5");

  // Rooms & Guests
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [rooms, setRooms] = useState([{ adults: 2, children: 0 }]);

  // Filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterDuration, setFilterDuration] = useState(15);
  const [filterFlights, setFilterFlights] = useState("all");
  const [filterBudget, setFilterBudget] = useState([]);

  const [currentBanner, setCurrentBanner] = useState(0);

  const totalTravelers = rooms.reduce((s, r) => s + r.adults + r.children, 0);
  const totalRooms = rooms.length;

  const closeAll = () => {
    setFromOpen(false);
    setToOpen(false);
    setDepartureCalendarOpen(false);
    setRoomsOpen(false);
    setFiltersOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainCardRef.current && !mainCardRef.current.contains(event.target)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 3000);
    return () => clearInterval(bannerInterval);
  }, []);

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
    onSearch({
      from: fromLocation,
      to: toLocation,
      departureDate: formatDateISO(departureDate),
      duration: parseInt(duration),
      travelers: totalTravelers || 2,
    });
    closeAll();
  };

  const handleCategoryTabClick = (tab) => {
    if (tab.isSearch) {
      setActiveTab("search");
      return;
    }
    setActiveTab(tab.id);
    closeAll();
  };

  const makeDepartureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split("T")[0];
  };

  const handleMegaDestinationClick = (categoryId, destName) => {
    onCategorySearch?.({
      from: mockFromLocation,
      to: { city: destName, id: destName.toLowerCase().replace(/\s+/g, "-") },
      category: categoryId,
      categoryLabel: destName,
      duration: 5,
      travelers: totalTravelers || 2,
      departureDate: makeDepartureDate(),
    });
    setActiveTab("search");
  };

  const handleMegaViewAll = (categoryId) => {
    const tab = CATEGORY_TABS.find((t) => t.id === categoryId);
    onCategorySearch?.({
      from: mockFromLocation,
      category: categoryId,
      categoryLabel: tab?.label || categoryId,
      duration: 5,
      travelers: totalTravelers || 2,
      departureDate: makeDepartureDate(),
    });
    setActiveTab("search");
  };

  const updateRoom = (idx, field, delta) => {
    setRooms((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, [field]: Math.max(0, r[field] + delta) } : r
      )
    );
  };

  const addRoom = () => {
    if (rooms.length < 5) setRooms((prev) => [...prev, { adults: 1, children: 0 }]);
  };

  const removeRoom = (idx) => {
    if (rooms.length > 1) setRooms((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleBudgetBucket = (bucket) => {
    setFilterBudget((prev) =>
      prev.includes(bucket) ? prev.filter((b) => b !== bucket) : [...prev, bucket]
    );
  };

  const hasFilters = filterFlights !== "all" || filterBudget.length > 0 || filterDuration < 15;

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
            <a href="#" className="text-white font-medium hover:text-gray-200 drop-shadow-md transition-colors">Packages</a>
            <a href="#" className="text-white font-medium hover:text-gray-200 drop-shadow-md transition-colors">About</a>
            <a href="#" className="text-white font-medium hover:text-gray-200 drop-shadow-md transition-colors">Contact</a>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-medium transition-colors shadow-lg">
              Get Started
            </button>
          </div>
        </header>

        {/* Search Card */}
        <div className="relative z-40 flex-grow flex items-center justify-center px-4 w-full max-w-7xl mx-auto pb-16 mb-8">
          <div ref={mainCardRef} className="bg-white rounded-xl shadow-2xl relative flex flex-col w-full">

            {/* ── CATEGORY TABS ── */}
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
                  {!tab.isSearch && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${activeTab === tab.id ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ── MEGA MENU (replaces form when category tab active) ── */}
            {activeTab !== "search" && MEGA_MENU_DATA[activeTab] ? (
              <div className="px-8 py-8">
                <div className="flex gap-10 flex-wrap">
                  {/* Left: headline + col1 */}
                  <div className="min-w-[160px]">
                    <button
                      onClick={() => handleMegaViewAll(activeTab)}
                      className="text-blue-600 font-bold text-[15px] mb-5 hover:underline text-left flex items-center gap-1"
                    >
                      {MEGA_MENU_DATA[activeTab].headline}
                      <span className="text-blue-400 text-lg">›</span>
                    </button>
                    <div className="space-y-3">
                      {MEGA_MENU_DATA[activeTab].col1.map((dest) => (
                        <button
                          key={dest}
                          onClick={() => handleMegaDestinationClick(activeTab, dest)}
                          className="block text-[14px] text-gray-700 hover:text-blue-600 hover:underline text-left w-full"
                        >
                          {dest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Col2 */}
                  {MEGA_MENU_DATA[activeTab].col2.length > 0 && (
                    <div className="min-w-[140px] pt-11">
                      <div className="space-y-3">
                        {MEGA_MENU_DATA[activeTab].col2.map((dest) => (
                          <button
                            key={dest}
                            onClick={() => handleMegaDestinationClick(activeTab, dest)}
                            className="block text-[14px] text-gray-700 hover:text-blue-600 hover:underline text-left w-full"
                          >
                            {dest}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured image thumbnails */}
                  <div className="flex gap-4 ml-auto flex-wrap items-start">
                    {MEGA_MENU_DATA[activeTab].featured.map((dest) => {
                      const img = getDestImage(dest);
                      return (
                        <div
                          key={dest}
                          onClick={() => handleMegaDestinationClick(activeTab, dest)}
                          className="cursor-pointer text-center group w-[110px]"
                        >
                          <div className="w-[110px] h-[80px] rounded-xl overflow-hidden bg-gray-100">
                            {img ? (
                              <img
                                src={img}
                                alt={dest}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-400 text-[11px] font-medium">
                                {dest}
                              </div>
                            )}
                          </div>
                          <p className="text-[12px] font-semibold text-gray-700 mt-1.5">{dest}</p>
                        </div>
                      );
                    })}
                    {/* View All tile */}
                    <div
                      onClick={() => handleMegaViewAll(activeTab)}
                      className="cursor-pointer text-center group w-[110px]"
                    >
                      <div className="w-[110px] h-[80px] rounded-xl overflow-hidden bg-blue-50 border border-blue-200 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <span className="text-blue-600 font-bold text-[13px]">View All</span>
                      </div>
                      <p className="text-[12px] font-semibold text-gray-700 mt-1.5">View All</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* ── ERROR MESSAGES ── */}
                {Object.values(errors).length > 0 && (
                  <div className="p-3 bg-red-50 border-b border-red-100 text-sm text-red-600 font-medium flex flex-wrap gap-4">
                    {errors.location && <span>{errors.location}</span>}
                    {errors.from && <span>{errors.from}</span>}
                    {errors.to && <span>{errors.to}</span>}
                    {errors.departure && <span>{errors.departure}</span>}
                  </div>
                )}

                {/* ── FORM FIELDS ── */}
                <div className="px-5 pt-5 pb-3">
                  <div className="border border-gray-300 rounded-xl grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">

                    {/* From */}
                    <div
                      className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group rounded-l-xl"
                      onClick={() => {
                        setFromOpen((o) => !o);
                        setToOpen(false);
                        setDepartureCalendarOpen(false);
                        setRoomsOpen(false);
                        setFiltersOpen(false);
                      }}
                    >
                      <div className="text-[13px] text-gray-500 font-semibold mb-1">From City</div>
                      <div className="text-3xl font-black text-black">{fromLocation?.city || "New Delhi"}</div>
                      <div className="text-[13px] text-gray-500 mt-1 truncate">India</div>
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
                        setToOpen((o) => !o);
                        setFromOpen(false);
                        setDepartureCalendarOpen(false);
                        setRoomsOpen(false);
                        setFiltersOpen(false);
                      }}
                    >
                      <div className="text-[13px] text-gray-500 font-semibold mb-1 truncate">To City/Country/Category</div>
                      <div className="text-3xl font-black text-black">{toLocation?.city || "Goa"}</div>
                      <LocationSelector
                        isOpen={toOpen}
                        onClose={() => setToOpen(false)}
                        onSelect={setToLocation}
                        title="Select Destination"
                        selectedLocation={toLocation}
                      />
                    </div>

                    {/* Departure Date */}
                    <div
                      className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group"
                      onClick={() => {
                        setDepartureCalendarOpen((o) => !o);
                        setFromOpen(false);
                        setToOpen(false);
                        setRoomsOpen(false);
                        setFiltersOpen(false);
                      }}
                    >
                      <div className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        Departure Date <ChevronDown size={10} className="text-blue-500" />
                      </div>
                      <div className="text-[28px] font-black text-black leading-none mt-2">
                        {departureDate ? formatDate(departureDate).split(" ")[0] : "13"}{" "}
                        <span className="text-lg font-bold">
                          {departureDate ? formatDate(departureDate).split(" ").slice(1).join(" ") : "Aug, 2026"}
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

                    {/* ── ROOMS & GUESTS ── */}
                    <div
                      className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group"
                      onClick={() => {
                        setRoomsOpen((o) => !o);
                        setFiltersOpen(false);
                        setFromOpen(false);
                        setToOpen(false);
                        setDepartureCalendarOpen(false);
                      }}
                    >
                      <div className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        Rooms & Guests <ChevronDown size={10} className={`text-blue-500 transition-transform ${roomsOpen ? "rotate-180" : ""}`} />
                      </div>
                      <div className="text-[28px] font-black text-black leading-none mt-2">
                        {totalTravelers} <span className="text-lg font-bold">Guests</span>
                      </div>
                      <div className="text-[13px] text-gray-500 mt-1">
                        {totalRooms} Room{totalRooms > 1 ? "s" : ""}
                      </div>

                      {roomsOpen && (
                        <div
                          className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl z-50 w-[320px] border border-gray-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {rooms.some((r) => r.adults > 3) && (
                            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 rounded-t-xl">
                              <p className="text-[12px] text-amber-700 font-medium">
                                Total {totalTravelers} guests (Max. 3 adults) allowed in a room
                              </p>
                            </div>
                          )}

                          <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
                            {rooms.map((room, idx) => (
                              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                    ROOM {idx + 1}
                                  </p>
                                  {rooms.length > 1 && (
                                    <button
                                      onClick={() => removeRoom(idx)}
                                      className="text-[11px] text-red-500 hover:text-red-700 font-semibold"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-[12px] font-semibold text-gray-700">Adults</p>
                                    <p className="text-[10px] text-gray-400 mb-2">Above 12 Years</p>
                                    <div className="flex items-center gap-2">
                                      <button onClick={() => updateRoom(idx, "adults", -1)} className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg leading-none">−</button>
                                      <span className="text-[18px] font-black text-black w-7 text-center">{String(room.adults).padStart(2, "0")}</span>
                                      <button onClick={() => updateRoom(idx, "adults", 1)} className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg leading-none">+</button>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[12px] font-semibold text-gray-700">Children</p>
                                    <p className="text-[10px] text-gray-400 mb-2">Below 12 Years</p>
                                    <div className="flex items-center gap-2">
                                      <button onClick={() => updateRoom(idx, "children", -1)} className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg leading-none">−</button>
                                      <span className="text-[18px] font-black text-black w-7 text-center">{String(room.children).padStart(2, "0")}</span>
                                      <button onClick={() => updateRoom(idx, "children", 1)} className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg leading-none">+</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex gap-3">
                            <button onClick={addRoom} className="flex-1 py-2.5 border-2 border-blue-500 text-blue-500 rounded-lg font-bold text-[12px] hover:bg-blue-50 transition-colors">
                              ADD ANOTHER ROOM +
                            </button>
                            <button onClick={() => setRoomsOpen(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-[12px] hover:bg-blue-700 transition-colors">
                              APPLY
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── FILTERS ── */}
                    <div
                      className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group rounded-r-xl"
                      onClick={() => {
                        setFiltersOpen((o) => !o);
                        setRoomsOpen(false);
                        setFromOpen(false);
                        setToOpen(false);
                        setDepartureCalendarOpen(false);
                      }}
                    >
                      <div className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        Filters <ChevronDown size={10} className={`text-blue-500 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
                      </div>
                      <div className="text-sm font-bold text-black mt-2 leading-tight">
                        {hasFilters ? (
                          <span className="text-blue-600">Filters Applied</span>
                        ) : (
                          <>Select Filters <span className="text-gray-500 font-medium">(Optional)</span></>
                        )}
                      </div>

                      {filtersOpen && (
                        <div
                          className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl z-50 w-[340px] border border-gray-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-5 space-y-5">
                            <div>
                              <p className="text-[13px] font-bold text-gray-800 mb-2">
                                Duration (in Nights){" "}
                                <span className="text-gray-400 font-normal text-[12px]">(1N – {filterDuration}N)</span>
                              </p>
                              <input type="range" min={1} max={15} value={filterDuration}
                                onChange={(e) => setFilterDuration(Number(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer" />
                              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                                <span>1N</span><span>15N</span>
                              </div>
                            </div>

                            <div className="h-px bg-gray-100" />

                            <div>
                              <p className="text-[13px] font-bold text-gray-800 mb-2">Flights</p>
                              <div className="flex gap-2">
                                <button onClick={() => setFilterFlights((f) => (f === "with" ? "all" : "with"))}
                                  className={`flex-1 py-2 border rounded-lg text-[13px] font-medium transition-colors ${filterFlights === "with" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                                  With Flights
                                </button>
                                <button onClick={() => setFilterFlights((f) => (f === "without" ? "all" : "without"))}
                                  className={`flex-1 py-2 border rounded-lg text-[13px] font-medium transition-colors ${filterFlights === "without" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                                  Without Flights
                                </button>
                              </div>
                            </div>

                            <div className="h-px bg-gray-100" />

                            <div>
                              <p className="text-[13px] font-bold text-gray-800 mb-3">Budget (per person)</p>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { label: "< ₹10,000", value: "lt10k" },
                                  { label: "₹10,000 – ₹20,000", value: "10k-20k" },
                                  { label: "₹20,000 – ₹25,000", value: "20k-25k" },
                                  { label: "> ₹25,000", value: "gt25k" },
                                ].map((b) => (
                                  <button key={b.value} onClick={() => toggleBudgetBucket(b.value)}
                                    className={`py-2 px-2 border rounded-lg text-[12px] font-medium text-left transition-colors ${filterBudget.includes(b.value) ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                                    {b.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="px-5 pb-4 pt-3 border-t border-gray-100 flex gap-3">
                            <button onClick={() => { setFilterDuration(15); setFilterFlights("all"); setFilterBudget([]); }}
                              className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-bold text-[12px] hover:bg-gray-50 transition-colors">
                              CLEAR
                            </button>
                            <button onClick={() => setFiltersOpen(false)}
                              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-[12px] hover:bg-blue-700 transition-colors">
                              APPLY
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex justify-between items-center px-6 pb-10 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">Recent Searches:</span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs flex items-center gap-1 font-medium">
                      {fromLocation?.city || "New Delhi"} <span className="text-blue-400">→</span> {toLocation?.city || "Goa"}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-600 hidden sm:block">Holiday Packages</span>
                </div>

                {/* Overlapping Search Button */}
                <div className="absolute -bottom-6 w-full flex justify-center items-center">
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white font-bold text-xl px-16 py-3.5 rounded-full shadow-xl hover:bg-blue-700 transition-colors"
                  >
                    SEARCH
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Banner Carousel */}
        <div className="absolute -bottom-56 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-20 flex flex-col items-center">
          <div className="w-full relative overflow-hidden group">
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

      {/* ── CAROUSEL SECTIONS ── */}
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

const mapDestinationToPackage = (dest) => ({
  id: dest._id || dest.destinationId,
  destinationId: dest.destinationId,
  name: dest.name,
  image: dest.coverImage || (dest.gallery && dest.gallery[0]) || "",
});

const ALL_MOODS_PACKAGES = destinations.slice(0, 10).map(mapDestinationToPackage);

const LAST_MINUTE_PACKAGES = destinations
  .filter((d) => d.destinationType?.includes("beach") || d.destinationType?.includes("family"))
  .map(mapDestinationToPackage);

const SPIRITUAL_PACKAGES = destinations
  .filter((d) => d.destinationType?.includes("religious") || d.destinationType?.includes("cultural"))
  .map(mapDestinationToPackage);

const ADVENTURE_PACKAGES = destinations
  .filter((d) => d.destinationType?.includes("adventure"))
  .map(mapDestinationToPackage);

function CarouselSection({ title, subtitle, packages, onSearch, mockFromLocation }) {
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
    const today = new Date();
    const departureDate = new Date(today);
    departureDate.setDate(departureDate.getDate() + 5);
    onSearch &&
      onSearch({
        from: mockFromLocation,
        to: { city: pkg.name, id: pkg.id, destinationId: pkg.destinationId },
        departureDate: departureDate.toISOString().split("T")[0],
        duration: 5,
        travelers: 2,
      });
  };

  return (
    <div className="px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl sm:text-[32px] font-black text-black mb-1">{title}</h2>
          <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
        </div>
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
                  backgroundColor: !isUrl ? "#e7edf8" : undefined,
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
                  <h3 className={`text-sm sm:text-[15px] font-bold tracking-wide ${isUrl ? "text-white" : "text-dark"}`}>
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
