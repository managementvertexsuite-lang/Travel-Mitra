import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const WIDGET_SCRIPT_ID = "vertexsuite-travel-widget";

function openTravelWidget() {
  if (document.getElementById(WIDGET_SCRIPT_ID)) return;

  const preload = document.createElement("link");
  preload.rel = "preload";
  preload.as = "script";
  preload.href = "https://widget.vertexsuite.io/widget.js";
  document.head.appendChild(preload);

  const script = document.createElement("script");
  script.id = WIDGET_SCRIPT_ID;
  script.src = "https://widget.vertexsuite.io/widget.js";
  script.dataset.widgetId = "69ce503c72295e75e449ca3e";
  script.dataset.apiKey = "pk_de052aad424c4643b8cc9d4f";
  script.setAttribute("v", "1.0.0+1");
  document.body.appendChild(script);
}

export default function Footer() {
  return (
    <footer className="w-full flex flex-col mt-auto">
      {/* Newsletter Section */}
      <div className="bg-[#f8fbff] py-20 px-6 flex flex-col items-center justify-center text-center border-t border-blue-100">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Join our newsletter</h2>
        <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
          You will never miss our latest packages, travel deals, and news. Our newsletter is sent once a week, every Thursday.
        </p>
        <div className="flex w-full max-w-md bg-white rounded-full p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-grow px-5 py-3 outline-none text-gray-700 bg-transparent rounded-l-full placeholder:text-gray-400"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg">
            Join
          </button>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-slate-900 text-white py-16 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column - Brand & Socials */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-2">
              <img
                src="https://miro.medium.com/v2/resize:fit:1025/1%2AgCdn4NaRqwe-jqzyPToPXg.jpeg"
                alt="Logo"
                className="w-8 h-8 rounded-lg shadow-sm"
              />
              <span className="text-white text-2xl drop-shadow-md font-bold font-serif leading-none tracking-wide">
                Travel Mitra
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              You will never miss our latest packages, travel deals, and news. Our updates are sent once a week, every Thursday.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="flex gap-16 md:justify-end md:pt-4">
            <div className="flex flex-col space-y-4 text-sm font-medium">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">About Us</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Blog</a>
            </div>
            <div className="flex flex-col space-y-4 text-sm font-medium">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Community</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Packages</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Destinations</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 text-slate-500 text-xs px-6 py-4 flex items-center justify-center gap-2">
        <span>&copy; {new Date().getFullYear()} Travel Mitra. All rights reserved.</span>
        <button
          type="button"
          onClick={openTravelWidget}
          className="text-slate-500 hover:text-slate-400 transition-colors"
        >
          travel
        </button>
      </div>
    </footer>
  );
}
