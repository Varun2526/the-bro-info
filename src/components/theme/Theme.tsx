"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { track } from "@vercel/analytics";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/* Theme state                                                         */
/* ------------------------------------------------------------------ */

export type ThemeId = "night" | "chaos" | "wholesome" | "roast";

const THEMES: { id: ThemeId; emoji: string; label: string }[] = [
  { id: "night", emoji: "🌙", label: "Late Night Squad" },
  { id: "chaos", emoji: "😂", label: "Chaos Mode" },
  { id: "wholesome", emoji: "✨", label: "Wholesome Mode" },
  { id: "roast", emoji: "🔥", label: "Roast Mode" },
];

const STORAGE_KEY = "bro-theme";

const ThemeContext = createContext<{
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}>({ theme: "night", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("night");

  // Restore the saved theme after mount (decorative — a frame of default
  // is fine and avoids any hydration mismatch).
  useEffect(() => {
    const t = setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (saved && THEMES.some((th) => th.id === saved)) setThemeState(saved);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // The themes live as CSS variables keyed off html[data-theme], so the
  // scenes' stage lights re-tint without re-rendering anything.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function setTheme(t: ThemeId) {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    track("theme_switch", { theme: t });
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Atmosphere — the living background                                  */
/* ------------------------------------------------------------------ */

/** Deterministic pseudo-random helper (no Math.random — SSR-safe). */
function spread(i: number, seed: number, max: number) {
  return ((i * 37 + seed * 53) % 97) / 97 * max;
}

function Particles({ theme }: { theme: ThemeId }) {
  if (theme === "night") {
    // faint stars
    return (
      <>
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white atmo-pulse"
            style={{
              left: `${spread(i, 3, 100)}%`,
              top: `${spread(i, 11, 100)}%`,
              width: i % 3 === 0 ? 2.5 : 1.5,
              height: i % 3 === 0 ? 2.5 : 1.5,
              opacity: 0.25,
              animationDelay: `${spread(i, 7, 5)}s`,
            }}
          />
        ))}
      </>
    );
  }
  if (theme === "chaos") {
    const glyphs = ["😂", "💀", "🔥", "❤️", "😭"];
    return (
      <>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="absolute select-none atmo-rise"
            style={{
              left: `${spread(i, 5, 100)}%`,
              top: `${10 + spread(i, 13, 80)}%`,
              fontSize: 14 + spread(i, 3, 10),
              opacity: 0.16,
              animationDelay: `${spread(i, 9, 12)}s`,
            }}
          >
            {glyphs[i % glyphs.length]}
          </span>
        ))}
      </>
    );
  }
  if (theme === "wholesome") {
    // soft drifting orbs
    return (
      <>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-full atmo-drift"
            style={{
              left: `${spread(i, 2, 100)}%`,
              top: `${spread(i, 17, 100)}%`,
              width: 10 + spread(i, 5, 10),
              height: 10 + spread(i, 5, 10),
              background:
                i % 2 === 0 ? "rgba(170,150,230,0.10)" : "rgba(80,200,180,0.08)",
              filter: "blur(5px)",
              animationDelay: `${spread(i, 7, 20)}s`,
            }}
          />
        ))}
      </>
    );
  }
  // roast — rising embers
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full atmo-rise"
          style={{
            left: `${spread(i, 4, 100)}%`,
            top: `${30 + spread(i, 19, 65)}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            background: "rgba(255,140,60,0.5)",
            boxShadow: "0 0 6px rgba(255,120,40,0.6)",
            opacity: 0.35,
            animationDelay: `${spread(i, 8, 14)}s`,
          }}
        />
      ))}
    </>
  );
}

export function Atmosphere() {
  const { theme } = useContext(ThemeContext);
  const reduced = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={theme}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.65, ease: "easeInOut" }}
        >
          {/* large drifting glows, colored by the theme's CSS vars */}
          <div
            className="absolute atmo-drift"
            style={{
              left: "8%",
              top: "12%",
              width: "55vw",
              height: "55vw",
              background:
                "radial-gradient(circle, var(--atmo-glow-1), transparent 65%)",
            }}
          />
          <div
            className="absolute atmo-drift"
            style={{
              right: "2%",
              bottom: "8%",
              width: "48vw",
              height: "48vw",
              animationDelay: "8s",
              background:
                "radial-gradient(circle, var(--atmo-glow-2), transparent 65%)",
            }}
          />
          <Particles theme={theme} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Switcher — right edge, desktop only                                 */
/* ------------------------------------------------------------------ */

export function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { scrollYProgress } = useScroll();
  const [pulse, setPulse] = useState(false);
  const [pulsed, setPulsed] = useState(false);

  // One soft pulse when the user first reaches the showcase — an
  // invitation to discover the switcher, never an interruption.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pulsed && v > 0.4) {
      setPulsed(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 1400);
    }
  });

  return (
    <motion.div
      role="group"
      aria-label="Atmosphere"
      animate={
        pulse
          ? { boxShadow: "0 0 24px 4px rgba(191,140,255,0.45)", scale: 1.05 }
          : { boxShadow: "0 0 0px 0px rgba(191,140,255,0)", scale: 1 }
      }
      transition={{ duration: 0.6 }}
      className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-1 p-1.5 rounded-full bg-ink/50 backdrop-blur border border-white/10"
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          aria-label={t.label}
          aria-pressed={theme === t.id}
          className={`group relative w-9 h-9 rounded-full text-base transition cursor-pointer ${
            theme === t.id
              ? "bg-white/12 ring-1 ring-brand opacity-100"
              : "opacity-55 hover:opacity-100 hover:bg-white/8"
          }`}
        >
          {t.emoji}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-ink/90 border border-white/10 text-xs text-paper/85 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition pointer-events-none">
            {t.label}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
