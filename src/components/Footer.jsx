import { useEffect, useState } from "react";
import {
  Check,
  Facebook,
  Instagram,
  Twitter,
  X,
  Youtube,
} from "lucide-react";

const WIDGET_SCRIPT_ID = "vertexsuite-travel-widget";

const DEFAULT_WIDGET_SCRIPT = `<script src="https://widget.vertexsuite.io/widget.js" data-widget-id="69ce503c72295e75e449ca3e" data-api-key="pk_de052aad424c4643b8cc9d4f" v="1.0.0+1"></script>`;

function removeTravelWidgetScript() {
  document.getElementById(WIDGET_SCRIPT_ID)?.remove();
  document.querySelector('link[data-travel-widget-preload="true"]')?.remove();
}

function buildScriptFromText(scriptText) {
  const trimmedScript = scriptText.trim();
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(trimmedScript, "text/html");
  const pastedScript = parsedDocument.querySelector("script");
  const script = document.createElement("script");

  script.id = WIDGET_SCRIPT_ID;

  if (pastedScript) {
    Array.from(pastedScript.attributes).forEach((attribute) => {
      if (attribute.name !== "id") {
        script.setAttribute(attribute.name, attribute.value);
      }
    });
    script.text = pastedScript.textContent || "";
    return script;
  }

  script.src = trimmedScript;
  return script;
}

function applyTravelWidgetScript(scriptText) {
  const script = buildScriptFromText(scriptText);

  removeTravelWidgetScript();

  if (script.src) {
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "script";
    preload.href = script.src;
    preload.dataset.travelWidgetPreload = "true";
    document.head.appendChild(preload);
  }

  document.body.appendChild(script);
}

export default function Footer() {
  const [isScriptPanelOpen, setIsScriptPanelOpen] = useState(false);
  const [scriptText, setScriptText] = useState(DEFAULT_WIDGET_SCRIPT);
  const [scriptMessage, setScriptMessage] = useState("VertexSuite widget is active.");

  useEffect(() => {
    applyTravelWidgetScript(DEFAULT_WIDGET_SCRIPT);
  }, []);

  const handleInjectScript = () => {
    if (!scriptText.trim()) {
      setScriptMessage("Paste a script snippet first.");
      return;
    }

    applyTravelWidgetScript(scriptText);
    setScriptMessage("Widget script injected.");
  };

  return (
    <footer className="w-full flex flex-col mt-auto">
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

      <div className="bg-slate-900 text-white py-16 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
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

      <div className="bg-slate-950 text-slate-500 text-xs px-6 py-4 flex items-center justify-center gap-2">
        <span>&copy; {new Date().getFullYear()} Travel Mitra. All rights reserved.</span>
        <button
          type="button"
          onClick={() => {
            setIsScriptPanelOpen(true);
            setScriptMessage("VertexSuite widget is active.");
          }}
          className="text-slate-500 hover:text-slate-400 transition-colors"
        >
          travel
        </button>
      </div>

      {isScriptPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-5 py-8">
          <div
            className="absolute inset-0"
            onClick={() => setIsScriptPanelOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <label htmlFor="travel-widget-script" className="text-sm font-bold text-slate-700">
                Widget Script
              </label>
              <button
                type="button"
                onClick={() => setIsScriptPanelOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close widget script popout"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-md bg-slate-50 p-3">
              <textarea
                id="travel-widget-script"
                value={scriptText}
                onChange={(event) => {
                  setScriptText(event.target.value);
                  setScriptMessage("");
                }}
                className="h-44 w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-300"
                placeholder="Paste widget script"
                maxLength={5000}
                spellCheck="false"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
              <p>Please enter a widget script.</p>
              <span>{scriptText.length}/5000</span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-slate-500">{scriptMessage}</p>
              <button
                type="button"
                onClick={handleInjectScript}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
              >
                <Check size={16} />
                Inject Script
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
