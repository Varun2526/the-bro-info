import Act1Problem from "@/components/scenes/Act1Problem";
import Act2Solution from "@/components/scenes/Act2Solution";
import BrosShowcase from "@/components/scenes/BrosShowcase";
import BigIdea from "@/components/scenes/BigIdea";
import Act3Scenarios from "@/components/scenes/Act3Scenarios";
import CreatorMoment from "@/components/scenes/CreatorMoment";
import Vision from "@/components/scenes/Vision";
import Waitlist from "@/components/scenes/Waitlist";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main className="bg-ink">
      <ScrollProgress />
      {/* fixed wordmark */}
      <div className="fixed top-5 left-6 z-50 font-display font-bold text-lg tracking-tight">
        Bro
      </div>
      <a
        href="#waitlist"
        className="fixed top-3 right-4 z-50 h-11 px-5 inline-flex items-center text-[13px] font-semibold rounded-full border border-white/15 bg-ink/60 backdrop-blur hover:bg-white/10 transition"
      >
        Join waitlist
      </a>

      {/* Act 1 — the problem */}
      <Act1Problem />

      {/* Act 2 — the revival */}
      <Act2Solution />

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
  );
}
