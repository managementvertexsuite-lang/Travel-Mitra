import {
  AlertCircle,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Hotel,
  Image as ImageIcon,
  MapPinned,
  Plus,
  Plane,
  Scissors,
  Star,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PackageDetail({ package: pkg, onBack }) {
  if (!pkg) return null;

  const [activeTab, setActiveTab] = useState("itinerary");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const galleryImages = [...new Set([...(pkg.gallery || []), pkg.image].filter(Boolean))];
  const discount = Math.max(0, Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100));

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 pt-4 pb-4">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm mb-4">
          <ChevronLeft size={16} /> Back to Results
        </button>
        <h1 className="text-3xl font-bold text-black mb-3">{pkg.name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <Badge icon={<Scissors size={14} />}>Customizable</Badge>
          <Badge>{pkg.nights}N/{pkg.duration}D</Badge>
          <span className="font-semibold">{pkg.itinerary || `${pkg.nights}N ${pkg.destination}`}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 mb-8">
        <GalleryGrid
          images={galleryImages}
          onOpen={(index) => {
            setActiveImage(index);
            setGalleryOpen(true);
          }}
        />
      </div>

      {galleryOpen && (
        <GalleryLightbox
          images={galleryImages}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          onClose={() => setGalleryOpen(false)}
          title={pkg.name}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-gray-200">
        <div className="flex gap-12">
          {["itinerary", "policies", "summary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-bold pb-4 capitalize transition-all ${
                activeTab === tab ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            {activeTab === "itinerary" && <ItineraryTab package={pkg} />}
            {activeTab === "policies" && <PoliciesTab />}
            {activeTab === "summary" && <SummaryTab package={pkg} />}
          </main>
          <aside className="lg:col-span-1">
            <PriceSummary package={pkg} discount={discount} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, children }) {
  return (
    <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white shadow-sm font-semibold text-xs text-gray-700">
      {icon}
      {children}
    </div>
  );
}

function GalleryGrid({ images, onOpen }) {
  const shownImages = [0, 1, 2, 3, 4].map((idx) => images[idx] || images[0]);

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px]">
      <button onClick={() => onOpen(0)} className="col-span-2 row-span-2 overflow-hidden rounded-l-xl group">
        <img src={shownImages[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </button>
      <button onClick={() => onOpen(1)} className="overflow-hidden group">
        <img src={shownImages[1]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </button>
      <button onClick={() => onOpen(2)} className="overflow-hidden rounded-tr-xl group">
        <img src={shownImages[2]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </button>
      <button onClick={() => onOpen(3)} className="overflow-hidden group">
        <img src={shownImages[3]} alt="Activities" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </button>
      <button onClick={() => onOpen(4)} className="overflow-hidden rounded-br-xl relative group text-left">
        <img src={shownImages[4]} alt="More" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white">
          <Plus size={44} className="opacity-20" strokeWidth={3} />
          <span className="mt-2 text-sm font-bold tracking-wide">+ See More Images</span>
        </div>
      </button>
    </div>
  );
}

function GalleryLightbox({ images, activeImage, setActiveImage, onClose, title }) {
  const current = images[activeImage] || images[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="h-14 px-5 flex items-center justify-between text-white border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <ImageIcon size={18} />
          <p className="font-semibold truncate">{title}</p>
          <span className="text-sm text-white/60">{activeImage + 1} / {images.length}</span>
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">
          <X size={22} />
        </button>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_260px]">
        <div className="grid min-h-0 grid-cols-[56px_1fr_56px] items-center gap-4 p-6">
          <button
            onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
            className="flex h-11 w-11 items-center justify-center justify-self-center rounded-full bg-white/15 text-white shadow-lg hover:bg-white/25"
          >
            <ChevronLeft size={26} />
          </button>
          <div className="flex min-h-0 h-full items-center justify-center overflow-hidden">
            <img src={current} alt="Gallery preview" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>
          <button
            onClick={() => setActiveImage((activeImage + 1) % images.length)}
            className="flex h-11 w-11 items-center justify-center justify-self-center rounded-full bg-white/15 text-white shadow-lg hover:bg-white/25"
          >
            <ChevronRight size={26} />
          </button>
        </div>
        <div className="bg-black/30 border-l border-white/10 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
          {images.map((image, idx) => (
            <button key={`${image}-${idx}`} onClick={() => setActiveImage(idx)} className={`aspect-[4/3] rounded-lg overflow-hidden border-2 ${idx === activeImage ? "border-white" : "border-transparent"}`}>
              <img src={image} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItineraryTab({ package: pkg }) {
  const days = useMemo(() => generateItinerary(pkg), [pkg]);
  const sectionRefs = useRef([]);
  const [activeDay, setActiveDay] = useState(1);
  const [activeSummary, setActiveSummary] = useState("plan");
  const startDate = useMemo(() => resolveTripStartDate(pkg), [pkg]);
  const datedDays = useMemo(
    () => days.map((day, idx) => ({ ...day, dateLabel: formatTripDate(addDays(startDate, idx)) })),
    [days, startDate],
  );
  const summaryItems = useMemo(() => buildItinerarySummaryItems(pkg), [pkg]);
  const visibleDays = useMemo(
    () => datedDays.filter((day) => dayMatchesSummary(day, activeSummary)),
    [datedDays, activeSummary],
  );
  const itineraryImages = useMemo(() => {
    const usedImages = new Set([pkg.gallery?.[0], pkg.image].filter(Boolean));
    return datedDays.map((day, idx) => selectItineraryImage(day, pkg, usedImages, idx));
  }, [datedDays, pkg]);

  useEffect(() => {
    const updateActiveDay = () => {
      const viewportAnchor = 170;
      let currentDay = datedDays[0]?.day || 1;

      visibleDays.forEach((day) => {
        const node = sectionRefs.current[day.day];
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.top <= viewportAnchor) {
          currentDay = day.day;
        }
      });

      setActiveDay(currentDay);
    };

    updateActiveDay();
    window.addEventListener("scroll", updateActiveDay, { passive: true });
    window.addEventListener("resize", updateActiveDay);
    return () => {
      window.removeEventListener("scroll", updateActiveDay);
      window.removeEventListener("resize", updateActiveDay);
    };
  }, [datedDays, visibleDays]);

  useEffect(() => {
    const firstVisibleDay = visibleDays[0]?.day;
    if (firstVisibleDay && !visibleDays.some((day) => day.day === activeDay)) {
      setActiveDay(firstVisibleDay);
    }
  }, [activeDay, visibleDays]);

  const scrollToDay = (dayNumber) => {
    sectionRefs.current[dayNumber]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectSummary = (summaryId) => {
    const nextVisibleDay = datedDays.find((day) => dayMatchesSummary(day, summaryId))?.day;
    setActiveSummary(summaryId);
    if (nextVisibleDay) {
      setActiveDay(nextVisibleDay);
      window.setTimeout(() => scrollToDay(nextVisibleDay), 0);
    }
  };

  return (
    <div className="overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-3 bg-[#eaf7ff] px-5 py-4 text-sm font-semibold text-gray-800 md:grid-cols-5">
        {summaryItems.map((item) => {
          const isActive = activeSummary === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectSummary(item.id)}
              className={`min-h-[52px] rounded-full px-4 py-2 text-center font-bold transition-all ${
                isActive
                  ? "border border-blue-500 bg-white text-blue-600 shadow-sm"
                  : "border border-transparent text-gray-900 hover:border-blue-200 hover:bg-white/70"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[184px_1fr]">
        <aside className="border-b border-gray-200 bg-[#fafafa] p-5 md:border-b-0 md:border-r">
          <div className="sticky top-24">
            <h3 className="mb-3 text-lg font-bold text-gray-800">Day Plan</h3>
            <div className="relative space-y-1">
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gray-300" />
              {datedDays.map((day) => {
                const isEnabled = dayMatchesSummary(day, activeSummary);
                const isActive = isEnabled && day.day === activeDay;
                const isVisited = isEnabled && day.day <= activeDay;
                return (
                  <button
                    key={day.day}
                    type="button"
                    disabled={!isEnabled}
                    onClick={() => {
                      if (!isEnabled) return;
                      setActiveDay(day.day);
                      scrollToDay(day.day);
                    }}
                    className={`relative z-10 grid w-full grid-cols-[22px_1fr] items-center rounded-r-full py-1.5 pr-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-gray-700 pl-0 text-white"
                        : isVisited
                          ? "font-bold text-gray-900 hover:bg-gray-100"
                          : isEnabled
                            ? "text-gray-600 hover:bg-gray-100"
                            : "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    <span className="flex justify-center">
                      <span className={`h-2 w-2 rounded-full ${isActive ? "bg-white" : isVisited ? "bg-gray-700" : isEnabled ? "bg-gray-400" : "bg-gray-300"}`} />
                    </span>
                    <span className="truncate">{day.dateLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          {visibleDays.map((day) => {
            const idx = datedDays.findIndex((datedDay) => datedDay.day === day.day);
            return (
              <DayPlan
                key={day.day}
                day={day}
                image={itineraryImages[idx]}
                previousImage={itineraryImages[(idx + 1) % itineraryImages.length]}
                detailFilter={activeSummary}
                sectionRef={(node) => {
                  sectionRefs.current[day.day] = node;
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayPlan({ day, image, previousImage, detailFilter, sectionRef }) {
  const details = buildDayDetailRows(day, image, previousImage).filter((detail) => detailMatchesSummary(detail, detailFilter));
  const includedItems = day.includes || [];

  return (
    <section ref={sectionRef} className="scroll-mt-28 border-b border-gray-200 last:border-b-0">
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-5 py-4">
        <span className="rounded-full bg-[#ff6f61] px-4 py-2 text-sm font-bold text-white">Day {day.day}</span>
        <h3 className="font-bold text-gray-900">{day.location}</h3>
        <span className="text-xs font-bold text-gray-700">INCLUDED:</span>
        <span className="text-sm text-gray-700">{includedItems.join("  |  ")}</span>
      </div>

      <div className="divide-y divide-gray-200">
        {details.map((detail) => (
          <div key={detail.title} className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-[190px_1fr]">
            <div className="relative">
              <div className="absolute -left-5 top-0 h-7 w-[3px] bg-black" />
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-600">
                {detail.icon}
                <span>{detail.type}</span>
                <span className="normal-case font-medium">• {detail.meta}</span>
              </div>
              <div className="mt-3 h-px w-10 bg-gray-300" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
              <img src={detail.image} alt={detail.title} className="h-36 w-full rounded-lg object-cover" />
              <div>
                <h4 className="mb-2 text-xl font-bold text-gray-900">{detail.title}</h4>
                <p className="text-sm leading-relaxed text-gray-600">{detail.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                  <span>{detail.duration}</span>
                  <span>{detail.timing}</span>
                  {detail.note && <span>{detail.note}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 pb-5">
        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-5 py-4">
          <div>
            <p className="font-bold text-gray-900">Add Activities to your day</p>
            <p className="text-sm text-gray-600">Spend the day at leisure or add an activity, transfer or meal.</p>
          </div>
          <button className="text-sm font-bold text-blue-600">ADD TO DAY</button>
        </div>
      </div>
    </section>
  );
}

function PoliciesTab() {
  const policies = [
    ["Cancellation Policy", "Free cancellation up to 7 days before the trip. 50% refund for cancellations 4-7 days before. No refund within 3 days."],
    ["Payment Terms", "15% advance payment required at booking. Remaining amount is due 7 days before the trip."],
    ["Travel Insurance", "Travel insurance is optional but recommended for medical emergencies, baggage, and trip interruptions."],
    ["Document Requirements", "Carry valid government ID and destination-specific travel documents where applicable."],
  ];

  return (
    <div className="space-y-5">
      {policies.map(([title, content]) => (
        <div key={title} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} className="text-blue-600" />
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
        </div>
      ))}
    </div>
  );
}

function SummaryTab({ package: pkg }) {
  const days = generateItinerary(pkg);
  const rows = [
    ["Destination", pkg.destination],
    ["Duration", `${pkg.duration} Days / ${pkg.nights} Nights`],
    ["Hotel Category", `${pkg.hotelCategory || 4} Star`],
    ["Rating", `${pkg.rating}/5 (${pkg.reviews} reviews)`],
    ["Transfers", pkg.flightIncluded ? "Flights and airport transfers included" : "Airport transfers included"],
  ];

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-[190px_1fr]">
          <img src={pkg.gallery?.[1] || pkg.image} alt={pkg.destination} className="w-full h-full min-h-[190px] object-cover" />
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Summary</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map(([label, value]) => (
                    <tr key={label} className="border-b border-gray-200 last:border-b-0">
                      <th className="w-44 bg-gray-50 px-4 py-3 text-left font-bold text-gray-700">{label}</th>
                      <td className="px-4 py-3 text-gray-900 font-medium">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-[#f7fbff] border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Day-wise Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Day</th>
                <th className="px-4 py-3 text-left">Place</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Meals</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day.day} className="border-t border-gray-200 align-top">
                  <td className="px-4 py-3 font-bold text-blue-700">Day {day.day}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{day.location}</td>
                  <td className="px-4 py-3 text-gray-600">{day.activities.map((activity) => activity.title).join(", ")}</td>
                  <td className="px-4 py-3 text-gray-600">{day.meal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <IncludedCard title="What's Included" tone="green" items={pkg.inclusions || []} />
        <IncludedCard title="Not Included" tone="red" items={["Airfare / Train / Bus tickets", "Travel Insurance", "Meals not mentioned", "Personal expenses"]} />
      </div>
    </div>
  );
}

function IncludedCard({ title, tone, items }) {
  const positive = tone === "green";
  return (
    <div className={`${positive ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} rounded-xl p-5 border space-y-3`}>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
          {positive ? <Check size={17} className="text-green-600" /> : <span className="text-red-600 font-bold">x</span>}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function PriceSummary({ package: pkg, discount }) {
  const travelers = 1;
  const coupons = [
    { code: "LASTMINUTE", discount: 402 },
    { code: "TRAVELMOOD", discount: 234 },
    { code: "MMTHLD", discount: 180 },
  ];
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const appliedCoupon = coupons.find((coupon) => coupon.code === selectedCoupon);
  const couponDiscount = appliedCoupon?.discount || 0;
  const finalPrice = Math.max(0, pkg.price - couponDiscount);
  const totalPrice = finalPrice * travelers;
  const totalSavings = pkg.originalPrice - finalPrice;

  return (
    <div className="sticky top-32 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Price per person</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-blue-600">Rs {finalPrice.toLocaleString()}</span>
          <span className="text-sm text-gray-500 line-through">Rs {pkg.originalPrice.toLocaleString()}</span>
        </div>
        {couponDiscount > 0 && (
          <p className="text-xs font-semibold text-green-600">
            {appliedCoupon.code} applied: Rs {couponDiscount.toLocaleString()} off per person
          </p>
        )}
        {discount > 0 && (
          <p className="text-sm font-semibold text-red-600">
            Save Rs {totalSavings.toLocaleString()} ({Math.round(((pkg.originalPrice - finalPrice) / pkg.originalPrice) * 100)}% OFF)
          </p>
        )}
      </div>
      <Divider />
      <div>
        <p className="text-sm text-gray-600 mb-2">Total for {travelers} adult</p>
        <p className="text-2xl font-bold text-gray-900">Rs {totalPrice.toLocaleString()}</p>
      </div>
      <Divider />
      <div className="bg-yellow-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <div>
            <p className="font-bold text-gray-900">{pkg.rating}/5.0</p>
            <p className="text-xs text-gray-600">{pkg.reviews} reviews</p>
          </div>
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg">
        Proceed to Payment
      </button>
      <p className="text-xs text-gray-500 text-center">Secure payment | Free cancellation upto 7 days</p>
      <Divider />
      <div className="space-y-3">
        <h4 className="font-bold text-gray-900 text-sm">Coupons & Offers</h4>
        {coupons.map((coupon) => {
          const isSelected = selectedCoupon === coupon.code;
          return (
          <button
            key={coupon.code}
            type="button"
            onClick={() => setSelectedCoupon(isSelected ? null : coupon.code)}
            className={`w-full p-3 rounded-lg border text-left ${isSelected ? "bg-purple-50 border-purple-300" : "bg-white border-gray-200 hover:border-purple-300"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900">{coupon.code}</p>
                <p className="text-xs text-gray-600">Save Rs {coupon.discount}</p>
              </div>
              <span className={`text-xs font-bold ${isSelected ? "text-red-600" : "text-blue-600"}`}>
                {isSelected ? "REMOVE" : "APPLY"}
              </span>
            </div>
          </button>
        )})}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-200" />;
}

function buildItinerarySummaryItems(pkg) {
  return [
    { id: "plan", label: `${pkg.duration} Day Plan` },
    { id: "flightTransfer", label: `${pkg.flightIncluded ? "2 Flights & " : ""}${Math.max(2, pkg.duration - 1)} Transfers` },
    { id: "hotel", label: `${pkg.nights} Hotels` },
    { id: "activity", label: `${pkg.duration + 1} Activities` },
    { id: "meal", label: `${pkg.duration + 2} Meals` },
  ];
}

function dayMatchesSummary(day, summaryId) {
  if (summaryId === "plan") return true;
  if (summaryId === "flightTransfer") return dayHasFlight(day) || dayHasTransfer(day);
  if (summaryId === "hotel") return Boolean(day.hotel);
  if (summaryId === "activity") return Boolean(day.activities?.length);
  if (summaryId === "meal") return Boolean(day.meal);
  return true;
}

function detailMatchesSummary(detail, summaryId) {
  if (summaryId === "plan") return true;
  if (summaryId === "flightTransfer") return ["Flight", "Transfer"].includes(detail.type);
  if (summaryId === "hotel") return detail.type === "Hotel";
  if (summaryId === "activity") return detail.type === "Activity";
  if (summaryId === "meal") return detail.type === "Meal";
  return true;
}

function dayHasFlight(day) {
  return Boolean(day.flightIncluded && (day.isFirst || day.isLast));
}

function dayHasTransfer(day) {
  const primaryActivity = day.activities?.[0] || {};
  return /(arrival|departure|transfer|checkout)/i.test(primaryActivity.title || day.location);
}

function buildDayDetailRows(day, image, secondaryImage) {
  const primaryActivity = day.activities[0] || {};
  const secondaryActivity = day.activities[1] || primaryActivity;
  const primaryActivityImage = selectDetailImage(`${primaryActivity.title || ""} ${primaryActivity.description || ""}`, image);
  const secondaryActivityImage = selectDetailImage(`${secondaryActivity.title || ""} ${secondaryActivity.description || ""}`, secondaryImage || image);
  const rows = [];

  if (dayHasFlight(day)) {
    rows.push({
      type: "Flight",
      icon: <Plane size={18} />,
      meta: day.isLast ? `${day.location.replace(" Departure", "")} to New Delhi` : `New Delhi to ${day.location.replace(" Arrival", "")}`,
      title: day.isLast ? "Return Flight" : "Arrival Flight",
      description: day.isLast
        ? `Board your return flight from ${day.location.replace(" Departure", "")} after checkout and transfer assistance.`
        : `Board your flight and arrive at ${day.location.replace(" Arrival", "")}. Our representative will coordinate the onward journey.`,
      image: ITINERARY_IMAGE_POOLS.flight[0],
      duration: "Duration 1h 30m",
      timing: day.isLast ? "Afternoon to evening" : "Morning to afternoon",
      note: "Cabin baggage included",
    });
  }

  if (dayHasTransfer(day)) {
    rows.push({
      type: "Transfer",
      icon: <Car size={18} />,
      meta: day.day === 1 ? "Airport to hotel" : "Private local transfer",
      title: day.day === 1 ? "Private Transfer to Hotel" : "Private Transfer",
      description: "Enjoy a private vehicle with driver assistance for a comfortable transfer between planned stops.",
      image: ITINERARY_IMAGE_POOLS.transfer[day.day % ITINERARY_IMAGE_POOLS.transfer.length],
      duration: "Duration 45m - 2h",
      timing: "Anytime",
      note: "Private transfer included",
    });
  }

  if (day.hotel) {
    rows.push({
      type: "Hotel",
      icon: <Hotel size={18} />,
      meta: day.location,
      title: day.hotel,
      description: "Check in to your selected hotel and relax before heading out for the scheduled experiences.",
      image: ITINERARY_IMAGE_POOLS.hotel[day.day % ITINERARY_IMAGE_POOLS.hotel.length],
      duration: "Overnight stay",
      timing: "Check-in as per hotel policy",
      note: "Breakfast included",
    });
  }

  rows.push({
    type: "Meal",
    icon: <Utensils size={18} />,
    meta: day.meal,
    title: day.day === 1 ? "Refreshments on Arrival" : `${day.meal.split(",")[0]} Experience`,
    description: "Savour planned meals or refreshments at the hotel or a curated local stop as per your day plan.",
    image: ITINERARY_IMAGE_POOLS.dining[day.day % ITINERARY_IMAGE_POOLS.dining.length],
    duration: "Duration 1 Hour",
    timing: "As per itinerary",
    note: `${day.meal} included`,
  });

  rows.push({
    type: "Activity",
    icon: <MapPinned size={18} />,
    meta: day.location,
    title: primaryActivity.title || secondaryActivity.title || "Local Experience",
    description: primaryActivity.description || secondaryActivity.description || "Explore curated sights and local experiences with travel assistance.",
    image: primaryActivityImage,
    duration: "Duration 2 - 8 Hours",
    timing: "Anytime",
    note: "Activity included",
  });

  if (secondaryActivity.title && secondaryActivity.title !== primaryActivity.title) {
    rows.push({
      type: "Activity",
      icon: <MapPinned size={18} />,
      meta: day.location,
      title: secondaryActivity.title,
      description: secondaryActivity.description,
      image: secondaryActivityImage,
      duration: "Duration 1 - 3 Hours",
      timing: "Evening",
      note: "Optional guidance included",
    });
  }

  return rows;
}

function resolveTripStartDate(pkg) {
  if (pkg.departureDate) {
    const parsed = new Date(pkg.departureDate);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date(2026, 6, 5);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatTripDate(date) {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const weekday = date.toLocaleString("en-US", { weekday: "short" });
  return `${day} ${month}, ${weekday}`;
}

function selectDetailImage(text, fallback) {
  const category = getItineraryImageCategory(String(text || "").toLowerCase());
  if (!category) return fallback;

  const pool = ITINERARY_IMAGE_POOLS[category] || [];
  return pool[0] || fallback;
}

const ITINERARY_IMAGE_POOLS = {
  flight: [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=900&q=80",
  ],
  transfer: [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=900&q=80",
  ],
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80",
  ],
  dining: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  ],
  temple: [
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80",
  ],
  beach: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
  ],
  water: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
  ],
  safari: [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80",
  ],
  shopping: [
    "https://images.unsplash.com/photo-1481437156560-3205f6a55735?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&q=80",
  ],
  spa: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
  ],
  adventure: [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
  ],
  snow: [
    "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=900&q=80",
  ],
  sightseeing: [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
  ],
};

function selectItineraryImage(day, pkg, usedImages, index) {
  const activityText = day.activities
    .flatMap((activity) => [activity.title, activity.description])
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const locationText = String(day.location || "").toLowerCase();
  const mealText = String(day.meal || "").toLowerCase();
  const hotelText = String(day.hotel || "").toLowerCase();
  const primaryText = `${locationText} ${activityText}`;
  const isFirstOrLast = /(arrival|departure|checkout|transfer|airport)/.test(primaryText);
  const category = isFirstOrLast
    ? "transfer"
    : getItineraryImageCategory(primaryText) ||
      (hotelText && index === 1 ? "hotel" : null) ||
      (mealText && index === 2 ? "dining" : null) ||
      "sightseeing";

  const categoryPool = ITINERARY_IMAGE_POOLS[category] || [];
  const galleryPool = category === "sightseeing" ? pkg.gallery || [] : [];
  const fallbackPool = Object.values(ITINERARY_IMAGE_POOLS).flat();
  const candidates = [...categoryPool, ...galleryPool, pkg.image, ...fallbackPool].filter(Boolean);
  const selected = candidates.find((image) => !usedImages.has(image)) || candidates[index % candidates.length];

  if (selected) usedImages.add(selected);
  return selected;
}

function getItineraryImageCategory(text) {
  if (/(arrival|departure|checkout|transfer|airport|drive|car|pickup|drop)/.test(text)) return "transfer";
  if (/(hotel|check-in|stay|resort|room|property)/.test(text)) return "hotel";
  if (/(breakfast|lunch|dinner|meal|food|cafe|restaurant)/.test(text)) return "dining";
  if (/(temple|palace|church|monastery|heritage|culture|cultural)/.test(text)) return "temple";
  if (/(beach|island|sunset|coast|sea)/.test(text)) return "beach";
  if (/(water|snorkel|diving|cruise|boat|shikara|lake|river)/.test(text)) return "water";
  if (/(safari|desert)/.test(text)) return "safari";
  if (/(shop|market|bazaar|souvenir)/.test(text)) return "shopping";
  if (/(spa|wellness|massage|retreat)/.test(text)) return "spa";
  if (/(ski|snow|gondola)/.test(text)) return "snow";
  if (/(trek|hike|adventure|rafting|paragliding|sports)/.test(text)) return "adventure";
  return null;
}

function generateItinerary(pkg) {
  const destination = pkg.destination || "Destination";
  const duration = Math.max(1, pkg.duration || 5);
  const activities = pkg.highlights?.length ? pkg.highlights : ["Sightseeing", "Local Culture", "Leisure Time", "Shopping"];
  const places = buildPlaces(destination, duration);

  return Array.from({ length: duration }, (_, idx) => {
    const day = idx + 1;
    const isFirst = day === 1;
    const isLast = day === duration;
    const location = places[idx] || destination;

    return {
      day,
      isFirst,
      isLast,
      flightIncluded: Boolean(pkg.flightIncluded),
      location: isFirst ? `${destination} Arrival` : isLast ? `${destination} Departure` : location,
      meal: isFirst ? "Dinner" : isLast ? "Breakfast" : "Breakfast, Lunch & Dinner",
      hotel: isLast ? null : `${pkg.hotelCategory || 4}-star stay in ${location}`,
      includes: [
        ...(pkg.flightIncluded && isFirst ? ["1 Flight"] : []),
        ...(pkg.flightIncluded && isLast ? ["1 Flight"] : []),
        ...(isLast ? ["1 Transfer"] : ["1 Hotel", "1 Transfer"]),
        "1 Activity",
        "1 Meal",
      ],
      activities: [
        {
          title: isFirst ? "Arrival and Check-in" : isLast ? "Checkout and Departure" : activities[idx % activities.length],
          description: isFirst
            ? `Arrive at ${destination}, meet your trip representative, and settle into your hotel.`
            : isLast
              ? "Breakfast at hotel followed by checkout and transfer for the return journey."
              : `Enjoy ${activities[idx % activities.length].toLowerCase()} with planned transfers and local assistance.`,
        },
        {
          title: isFirst ? "Evening Leisure" : isLast ? "Last-minute Shopping" : "Local Experience",
          description: isFirst
            ? "Spend the evening at leisure and explore nearby cafes or markets."
            : isLast
              ? "Pick up souvenirs or local snacks before departure."
              : "Visit curated local spots, viewpoints, markets, or cultural highlights.",
        },
      ],
    };
  });
}

function buildPlaces(destination, duration) {
  const known = {
    Bali: ["Denpasar", "Ubud", "Kintamani", "Seminyak", "Tanah Lot", "Nusa Dua", "Denpasar"],
    Goa: ["North Goa", "Calangute", "Old Goa", "South Goa", "Panjim", "Goa"],
    "Jammu & Kashmir": ["Srinagar", "Gulmarg", "Pahalgam", "Sonmarg", "Srinagar"],
    Manali: ["Manali", "Solang Valley", "Kullu", "Naggar", "Manali"],
    Kerala: ["Kochi", "Munnar", "Thekkady", "Alleppey", "Kumarakom", "Kochi"],
    Dubai: ["Dubai", "Marina", "Desert Safari", "Downtown Dubai", "Dubai"],
  };
  const base = known[destination] || [destination, `${destination} Sightseeing`, `${destination} Excursion`, `${destination} Leisure`];

  return Array.from({ length: duration }, (_, idx) => base[idx % base.length]);
}
