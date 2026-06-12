import dynamic from "next/dynamic";
import Act1Problem from "@/components/scenes/Act1Problem";
import Act2Solution from "@/components/scenes/Act2Solution";
import ScrollProgress from "@/components/ScrollProgress";
import StickyCta from "@/components/StickyCta";
import { Atmosphere, ThemeProvider, ThemeSwitcher } from "@/components/theme/Theme";

/* Below-the-fold scenes are code-split: they keep SSR (the HTML is in
   the initial response for SEO) but their JS loads in separate chunks,
   shrinking what must parse before the first scroll responds. */
const BrosShowcase = dynamic(() => import("@/components/scenes/BrosShowcase"));
const BigIdea = dynamic(() => import("@/components/scenes/BigIdea"));
const Act3Scenarios = dynamic(() => import("@/components/scenes/Act3Scenarios"));
const CreatorMoment = dynamic(() => import("@/components/scenes/CreatorMoment"));
const Vision = dynamic(() => import("@/components/scenes/Vision"));
const Waitlist = dynamic(() => import("@/components/scenes/Waitlist"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <ThemeProvider>
      <main>
        {/* living background + theme system (decorative only) */}
        <Atmosphere />
        <ThemeSwitcher />
        {/* keyboard users can skip the 20-screen story */}
        <a
          href="#waitlist"
          className="sr-only focus:not-sr-only focus:fixed focus:top-16 focus:left-6 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-brand focus:text-ink focus:text-sm focus:font-semibold"
        >
          Skip to waitlist
        </a>
        <ScrollProgress />
        <StickyCta />
        {/* fixed wordmark */}
        <div className="fixed top-5 left-6 z-50 font-display font-bold text-lg tracking-tight">
          Bro<span className="text-brand">.</span>
        </div>
        <a
          href="#waitlist"
          className="fixed top-3 right-4 z-50 h-11 px-5 inline-flex items-center text-[13px] font-semibold rounded-full border border-white/15 bg-ink/60 backdrop-blur hover:bg-white/10 transition"
        >
          Join waitlist
        </a>

        {/* Act 1 — the problem (theme-flavored chat content) */}
        <Act1Problem />

        {/* Act 2 — the revival (theme-flavored chat content) */}
        <Act2Solution />

        {/* ── everything below is theme-agnostic and unchanged ── */}

        {/* The cast */}
        <BrosShowcase />

        {/* The big idea */}
        <BigIdea />

        {/* Act 3 — imagine your group */}
        <Act3Scenarios />

        {/* For creators */}
        <CreatorMoment />

        {/* The vision */}
        <Vision />

        {/* Conversion */}
        <Waitlist />

        <Footer />
      </main>
    </ThemeProvider>
  );
}
