import { ChevronLeft, Clock, MapPin, Star, Users, Check, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function PackageDetail({ package: pkg, onBack }) {
  if (!pkg) return null

  const [activeTab, setActiveTab] = useState("itinerary")
  const discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
        <div className="text-9xl opacity-20">{pkg.image}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">{pkg.name}</h1>
          <p className="text-lg text-blue-100">{pkg.destination}</p>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 bg-white text-blue-600 px-4 py-3 rounded-full hover:bg-gray-100 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-gray-200">
        <div className="flex gap-12">
          {["ITINERARY", "POLICIES", "SUMMARY"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`text-lg font-bold pb-4 transition-all ${
                activeTab === tab.toLowerCase()
                  ? "text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-2">
            {activeTab === "itinerary" && <ItineraryTab package={pkg} />}
            {activeTab === "policies" && <PoliciesTab />}
            {activeTab === "summary" && <SummaryTab package={pkg} />}
          </main>

          {/* Right Sidebar - Price Summary */}
          <aside className="lg:col-span-1">
            <PriceSummary package={pkg} discount={discount} />
          </aside>
        </div>
      </div>
    </div>
  )
}

function ItineraryTab({ package: pkg }) {
  const days = generateItinerary(pkg.destination, pkg.duration)

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm">
            {pkg.duration}D / {pkg.nights}N
          </div>
          <span className="text-gray-700 font-semibold">Trip Duration</span>
        </div>
        <p className="text-gray-600 text-sm">
          {pkg.nights} nights stay with multiple activities and guided tours included
        </p>
      </div>

      {days.map((day) => (
        <DayPlan key={day.day} day={day} />
      ))}
    </div>
  )
}

function DayPlan({ day }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 flex items-center gap-3">
        <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm min-w-fit">
          Day {day.day}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">{day.location}</h3>
          <p className="text-sm text-gray-600">{day.meal}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {day.activities.map((activity, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5"></div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
          </div>
        ))}

        {day.hotel && (
          <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-200">
            <p className="text-sm font-semibold text-gray-900">🏨 {day.hotel}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PoliciesTab() {
  const policies = [
    {
      title: "Cancellation Policy",
      content:
        "Free cancellation up to 7 days before the trip. 50% refund for cancellations 4-7 days before. No refund for cancellations within 3 days of the trip.",
    },
    {
      title: "Payment Terms",
      content:
        "15% advance payment required at booking. Remaining 85% due 7 days before the trip. We accept all major credit cards, debit cards, and digital payment methods.",
    },
    {
      title: "Travel Insurance",
      content:
        "Travel insurance is not included but highly recommended. You can purchase it at checkout for additional protection against medical emergencies and trip cancellations.",
    },
    {
      title: "Visa Requirements",
      content:
        "Please check visa requirements for your destination based on your nationality. Our team can provide guidance on visa documentation needed.",
    },
    {
      title: "Document Requirements",
      content:
        "Valid passport with at least 6 months validity is required. Bring vaccination certificates if applicable for your destination.",
    },
    {
      title: "Inclusions & Exclusions",
      items: ["✓ Accommodation as per itinerary", "✓ All activities mentioned", "✓ Daily breakfast", "✗ Airfare", "✗ Meals not specified", "✗ Travel insurance"],
    },
  ]

  return (
    <div className="space-y-6">
      {policies.map((policy, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} className="text-blue-600" />
            {policy.title}
          </h3>
          {policy.content && <p className="text-gray-600 text-sm leading-relaxed">{policy.content}</p>}
          {policy.items && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {policy.items.map((item, i) => (
                <p key={i} className="text-sm text-gray-600">
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SummaryTab({ package: pkg }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Trip Summary</h3>

        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Destination</span>
            <span className="font-semibold text-gray-900">{pkg.destination}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Duration</span>
            <span className="font-semibold text-gray-900">
              {pkg.duration} Days / {pkg.nights} Nights
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Rating</span>
            <span className="font-semibold text-gray-900">
              ⭐ {pkg.rating} ({pkg.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">What's Included</h3>
        <ul className="space-y-2">
          {[
            "✓ Accommodation as per itinerary",
            "✓ Daily breakfast",
            "✓ All activities and sightseeing tours",
            "✓ Guided tour assistance",
            "✓ Airport transfers",
            "✓ Hotel taxes and service charges",
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-700">
              <Check size={18} className="text-green-600" />
              {item.substring(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-red-50 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Not Included</h3>
        <ul className="space-y-2">
          {["✗ Airfare / Train / Bus tickets", "✗ Travel Insurance", "✗ Meals not mentioned", "✗ Personal expenses", "✗ Tips and gratuities"].map(
            (item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="text-red-600 font-bold">✗</span>
                {item.substring(2)}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  )
}

function PriceSummary({ package: pkg, discount }) {
  const travelers = 1 // Default, can be passed as prop
  const totalPrice = pkg.price * travelers

  return (
    <div className="sticky top-32 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg space-y-4">
      {/* Price */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Price per person</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-blue-600">₹{pkg.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <p className="text-sm font-semibold text-red-600">Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()} ({discount}% OFF)</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Total Price */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Total for {travelers} adult</p>
        <p className="text-2xl font-bold text-gray-900">₹{totalPrice.toLocaleString()}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Rating */}
      <div className="bg-yellow-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <div>
            <p className="font-bold text-gray-900">{pkg.rating}/5.0</p>
            <p className="text-xs text-gray-600">{pkg.reviews} reviews</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg">
        Proceed to Payment
      </button>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">Secure payment | Free cancellation upto 7 days</p>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Coupons Section */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-900 text-sm">Coupons & Offers</h4>
        <div className="space-y-2">
          {[
            { code: "LASTMINUTE", discount: "₹402", applied: true },
            { code: "TRAVELMOOD", discount: "₹234", applied: false },
            { code: "MMTHLD", discount: "₹180", applied: false },
          ].map((coupon) => (
            <div
              key={coupon.code}
              className={`p-3 rounded-lg border ${
                coupon.applied
                  ? "bg-purple-50 border-purple-300"
                  : "bg-white border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-gray-900">{coupon.code}</p>
                  <p className="text-xs text-gray-600">Save {coupon.discount}</p>
                </div>
                <button
                  className={`text-xs font-bold ${
                    coupon.applied
                      ? "text-red-600 hover:text-red-700"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  {coupon.applied ? "REMOVE" : "APPLY"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function generateItinerary(destination, duration) {
  const dayPlans = {
    "Amazing Kashmir Vacay with Gulmarg": [
      {
        day: 1,
        location: "Srinagar Arrival",
        meal: "Dinner",
        hotel: "4-star Hotel in Srinagar",
        activities: [
          { title: "Arrival at Srinagar Airport", description: "Welcome to Kashmir! Airport transfer to hotel and check-in" },
          { title: "Shikara Ride on Dal Lake", description: "Evening boat ride on the famous floating gardens" },
        ],
      },
      {
        day: 2,
        location: "Gulmarg Adventure",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Resort in Gulmarg",
        activities: [
          { title: "Scenic Drive to Gulmarg", description: "2-hour scenic mountain drive through pine forests" },
          { title: "Gondola Ride", description: "Experience the Asia's highest gondola with panoramic views" },
          { title: "Alpine Meadows Walk", description: "Trek through beautiful meadows with Himalayan backdrop" },
        ],
      },
      {
        day: 3,
        location: "Gulmarg Skiing",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Resort in Gulmarg",
        activities: [
          { title: "Skiing Lessons", description: "Professional skiing training with certified instructors" },
          { title: "Snow Sports", description: "Snowboarding and other winter activities" },
        ],
      },
      {
        day: 4,
        location: "Pahalgam",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Hotel in Pahalgam",
        activities: [
          { title: "Betaab Valley Visit", description: "Explore the picturesque valley surrounded by willow trees" },
          { title: "Aru Valley Trek", description: "Guided trek through scenic valleys and streams" },
        ],
      },
      {
        day: 5,
        location: "Srinagar Departure",
        meal: "Breakfast",
        activities: [
          { title: "Final Shopping", description: "Last-minute souvenirs and local crafts" },
          { title: "Departure", description: "Transfer to airport with memorable moments" },
        ],
      },
    ],
    Kashmir: [
      {
        day: 1,
        location: "Srinagar Arrival",
        meal: "Dinner",
        hotel: "4-star Hotel in Srinagar",
        activities: [
          { title: "Arrival at Srinagar Airport", description: "Welcome to Kashmir! Airport transfer to hotel and check-in" },
          { title: "Shikara Ride on Dal Lake", description: "Evening boat ride on the famous floating gardens" },
        ],
      },
      {
        day: 2,
        location: "Srinagar Sightseeing",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "4-star Hotel in Srinagar",
        activities: [
          { title: "Mughal Gardens", description: "Visit the beautiful Nishat Bagh and Shalimar Bagh gardens" },
          { title: "Traditional Market", description: "Explore local spice markets and handicraft shops" },
          { title: "Sunset at Jhelum River", description: "Enjoy riverside walk and local cuisine" },
        ],
      },
      {
        day: 3,
        location: "Gulmarg Adventure",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Resort in Gulmarg",
        activities: [
          { title: "Scenic Drive to Gulmarg", description: "2-hour scenic mountain drive through pine forests" },
          { title: "Gondola Ride", description: "Experience the Asia's highest gondola with panoramic views" },
          { title: "Alpine Meadows Walk", description: "Trek through beautiful meadows with Himalayan backdrop" },
        ],
      },
      {
        day: 4,
        location: "Pahalgam",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Hotel in Pahalgam",
        activities: [
          { title: "Betaab Valley Visit", description: "Explore the picturesque valley surrounded by willow trees" },
          { title: "Aru Valley Trek", description: "Guided trek through scenic valleys and streams" },
          { title: "Local Village Tour", description: "Experience Kashmiri culture and hospitality" },
        ],
      },
      {
        day: 5,
        location: "Srinagar Departure",
        meal: "Breakfast",
        activities: [
          { title: "Final Shopping", description: "Last-minute souvenirs and local crafts" },
          { title: "Departure", description: "Transfer to airport with memorable moments of Kashmir" },
        ],
      },
    ],
    Delhi: [
      {
        day: 1,
        location: "Delhi Arrival",
        meal: "Dinner",
        hotel: "4-star Hotel in Central Delhi",
        activities: [
          { title: "Airport Reception", description: "Meet and greet at Delhi airport with hotel transfer" },
          { title: "Welcome Dinner", description: "Authentic Indian cuisine at hotel restaurant" },
        ],
      },
      {
        day: 2,
        location: "Old Delhi Heritage Tour",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "4-star Hotel in Central Delhi",
        activities: [
          { title: "Red Fort Visit", description: "Guided tour of the historic Red Fort" },
          { title: "Chandni Chowk Market", description: "Walking tour through the bustling old market" },
          { title: "Jama Masjid", description: "Visit one of India's largest mosques" },
          { title: "Food Walk", description: "Taste authentic street food of Old Delhi" },
        ],
      },
      {
        day: 3,
        location: "New Delhi & Modern Landmarks",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "4-star Hotel in Central Delhi",
        activities: [
          { title: "India Gate & Rashtrapati Bhavan", description: "Visit iconic monuments of independent India" },
          { title: "Humayun's Tomb", description: "Marvel at Mughal architecture" },
          { title: "Lotus Temple", description: "Peaceful baháí temple with modern architecture" },
          { title: "Evening at Connaught Place", description: "Shopping and dining at premier destination" },
        ],
      },
    ],
    Kerala: [
      {
        day: 1,
        location: "Kochi Arrival",
        meal: "Dinner",
        hotel: "Heritage Hotel in Kochi",
        activities: [
          { title: "Kochi Airport Reception", description: "Warm welcome and transfer to heritage hotel" },
          { title: "Chinese Fishing Nets Tour", description: "Evening visit to iconic fishing nets" },
        ],
      },
      {
        day: 2,
        location: "Kochi & Backwaters",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Heritage Hotel in Kochi",
        activities: [
          { title: "Fort Kochi Heritage Walk", description: "Explore colonial architecture and old bazaars" },
          { title: "Spice Market Tour", description: "Learn about Kerala's spice trade history" },
          { title: "Houseboat Cruise", description: "Sunset cruise on the magical backwaters" },
        ],
      },
    ],
    Himachal: [
      {
        day: 1,
        location: "Shimla Arrival",
        meal: "Dinner",
        hotel: "Hotel in Shimla",
        activities: [
          { title: "Arrive in Shimla", description: "Scenic drive through pine forests and Himalayan foothills" },
          { title: "The Mall Walk", description: "Evening stroll on the famous shopping street" },
        ],
      },
      {
        day: 2,
        location: "Shimla Sightseeing",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Hotel in Shimla",
        activities: [
          { title: "Christ Church Visit", description: "Iconic neo-Gothic church with colonial architecture" },
          { title: "Viceroy Lodge Tour", description: "Historic building with panoramic views of valleys" },
          { title: "Kali Bari Temple", description: "Local temple with spiritual significance" },
        ],
      },
      {
        day: 3,
        location: "Manali Adventure",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Resort in Manali",
        activities: [
          { title: "Drive to Manali", description: "Scenic drive through beautiful mountain terrain" },
          { title: "Adventure Activities", description: "Paragliding, river rafting, or mountain biking" },
        ],
      },
    ],
    Goa: [
      {
        day: 1,
        location: "Goa Arrival",
        meal: "Dinner",
        hotel: "Beachfront Resort",
        activities: [
          { title: "Airport Transfer", description: "Comfortable transfer to beachfront resort" },
          { title: "Beach Sunset", description: "Relax on pristine beaches and enjoy sunset" },
        ],
      },
      {
        day: 2,
        location: "Beach & Water Sports",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Beachfront Resort",
        activities: [
          { title: "Water Sports", description: "Jet skiing, parasailing, banana boat rides" },
          { title: "Beach Club", description: "Evening at beachside shacks and clubs" },
        ],
      },
      {
        day: 3,
        location: "Heritage & Spice Plantations",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Beachfront Resort",
        activities: [
          { title: "Old Goa Churches", description: "Visit historic Portuguese-era churches and monuments" },
          { title: "Spice Plantation Tour", description: "Experience local spice gardens and farming" },
        ],
      },
    ],
    Ladakh: [
      {
        day: 1,
        location: "Leh Arrival",
        meal: "Dinner",
        hotel: "Hotel in Leh",
        activities: [
          { title: "Arrive at Leh", description: "Acclimatization day after high-altitude arrival" },
          { title: "Leh Town Walk", description: "Explore local markets and monasteries" },
        ],
      },
      {
        day: 2,
        location: "Leh Sightseeing",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Hotel in Leh",
        activities: [
          { title: "Shey Palace", description: "Ancient royal palace with Buddhist architecture" },
          { title: "Thiksey Monastery", description: "11-story monastery with panoramic views" },
          { title: "Hemis Monastery", description: "Largest monastery with ancient artifacts" },
        ],
      },
      {
        day: 3,
        location: "Pangong Lake",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Lakeside Camp",
        activities: [
          { title: "Drive to Pangong", description: "Scenic drive through high mountain passes" },
          { title: "Pangong Lake Exploration", description: "Stunning high-altitude lake exploration" },
        ],
      },
    ],
    Maldives: [
      {
        day: 1,
        location: "Malé Arrival",
        meal: "Dinner",
        hotel: "Luxury Water Bungalow",
        activities: [
          { title: "Airport Reception", description: "Speedboat transfer to luxury resort" },
          { title: "Beach Relaxation", description: "Sunset on pristine white-sand beaches" },
        ],
      },
      {
        day: 2,
        location: "Island Hopping",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Luxury Water Bungalow",
        activities: [
          { title: "Snorkeling Adventure", description: "Explore colorful coral reefs and marine life" },
          { title: "Island Excursion", description: "Visit local islands and fishing villages" },
        ],
      },
      {
        day: 3,
        location: "Water Sports & Diving",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Luxury Water Bungalow",
        activities: [
          { title: "Scuba Diving", description: "Professional diving with certified instructors" },
          { title: "Spa & Wellness", description: "Luxury spa treatments with ocean views" },
        ],
      },
    ],
    Thailand: [
      {
        day: 1,
        location: "Bangkok Arrival",
        meal: "Dinner",
        hotel: "Hotel in Bangkok",
        activities: [
          { title: "Bangkok Airport Reception", description: "Hotel transfer and check-in" },
          { title: "Night Bazaar", description: "Shopping at famous night markets" },
        ],
      },
      {
        day: 2,
        location: "Bangkok Temple Tour",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Hotel in Bangkok",
        activities: [
          { title: "Grand Palace", description: "Iconic royal palace with elaborate architecture" },
          { title: "Wat Phra Kaew", description: "Temple of the Emerald Buddha" },
          { title: "Floating Markets", description: "Traditional boat markets with exotic products" },
        ],
      },
      {
        day: 3,
        location: "Phuket Beach",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Beachfront Resort",
        activities: [
          { title: "Flight to Phuket", description: "Short flight to beautiful beach destination" },
          { title: "Beach Activities", description: "Swimming, water sports, and beach clubs" },
        ],
      },
    ],
    Bali: [
      {
        day: 1,
        location: "Denpasar Arrival",
        meal: "Dinner",
        hotel: "Resort in Seminyak",
        activities: [
          { title: "Airport Transfer", description: "Comfortable transfer to beachfront resort" },
          { title: "Beach Walk", description: "Evening stroll on Seminyak Beach" },
        ],
      },
      {
        day: 2,
        location: "Temple & Culture",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Resort in Seminyak",
        activities: [
          { title: "Tanah Lot Temple", description: "Iconic seaside temple on rock formations" },
          { title: "Rice Terraces", description: "Trek through scenic green rice paddies" },
        ],
      },
      {
        day: 3,
        location: "Adventure & Relaxation",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Resort in Seminyak",
        activities: [
          { title: "Surfing Lessons", description: "Professional surfer training on famous beaches" },
          { title: "Traditional Massage", description: "Relaxing Balinese massage and spa treatments" },
        ],
      },
    ],
    Rajasthan: [
      {
        day: 1,
        location: "Jaipur Arrival",
        meal: "Dinner",
        hotel: "Palace Hotel",
        activities: [
          { title: "Jaipur Airport Reception", description: "Transfer to heritage palace hotel" },
          { title: "City Palace View", description: "Evening visit to illuminated city palace" },
        ],
      },
      {
        day: 2,
        location: "Jaipur Sightseeing",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Palace Hotel",
        activities: [
          { title: "Hawa Mahal", description: "The iconic Pink City's signature structure" },
          { title: "Jantar Mantar", description: "Ancient astronomical observation site" },
          { title: "Bazaar Walking Tour", description: "Explore vibrant markets and local crafts" },
        ],
      },
      {
        day: 3,
        location: "Amber Fort",
        meal: "Breakfast, Lunch & Dinner",
        hotel: "Palace Hotel",
        activities: [
          { title: "Amber Fort Tour", description: "Grand fort complex with royal apartments" },
          { title: "Elephant Ride", description: "Traditional elephant ride up the fort" },
        ],
      },
    ],
  }

  // Try to find exact match first, then partial match
  let selectedDest = dayPlans[destination]

  if (!selectedDest) {
    // Try partial matching
    const destinations = Object.keys(dayPlans)
    for (const dest of destinations) {
      if (destination.includes(dest) || dest.includes(destination)) {
        selectedDest = dayPlans[dest]
        break
      }
    }
  }

  const plans = selectedDest || dayPlans["Kashmir"] || Object.values(dayPlans)[0]

  return plans.slice(0, Math.min(duration, plans.length))
}
