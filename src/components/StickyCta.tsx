"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { track } from "@vercel/analytics";
import { useState } from "react";

/**
 * Mobile-only bottom CTA that appears once conviction has peaked
 * (after the "Meet Bro." reveal) and gets out of the way near the form.
 */
export default function StickyCta() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setVisible(v > 0.35 && v < 0.88);
  });

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed bottom-4 inset-x-4 z-50 lg:hidden flex gap-2"
        >
          <a
            href="#waitlist"
            onClick={() => track("cta_sticky_click")}
            className="flex-1 h-12 rounded-full bg-gradient-to-r from-brand to-brand-accent text-ink font-semibold text-[15px] inline-flex items-center justify-center shadow-[0_8px_30px_rgba(191,140,255,0.35)]"
          >
            Join the waitlist →
          </a>
          <button
            aria-label="Dismiss"
            onClick={() => setDismissed(true)}
            className="h-12 w-12 shrink-0 rounded-full bg-ink/80 border border-white/15 backdrop-blur text-paper/70"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
