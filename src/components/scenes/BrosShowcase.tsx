"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { track } from "@vercel/analytics";
import { PinnedScene, useRamp } from "@/components/scroll/Scrub";
import { BROS, Bro } from "@/components/chat/cast";

function BroCard({ bro }: { bro: Bro }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: -1.2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative shrink-0 w-[min(78vw,320px)] rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col"
    >
      {/* signature glow */}
      <div
        className="absolute inset-x-0 top-0 h-2/3 opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${bro.color}, transparent 70%)`,
        }}
      />
      <div className="relative h-[300px] sm:h-[340px] mt-4">
        <Image
          src={`/bros/${bro.id}.webp`}
          alt={bro.name}
          fill
          sizes="320px"
          className="object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
        />
      </div>
      <div className="relative p-5 pt-4">
        <h3
          className="font-display text-2xl font-semibold tracking-tight"
          style={{ color: bro.color }}
        >
          {bro.name}
        </h3>
        <p className="text-sm text-paper/60 mt-1 min-h-10">{bro.vibe}</p>
        <div className="mt-3 px-3 py-2 rounded-2xl rounded-bl-md bg-white/8 text-[13px] leading-snug">
          {bro.line}
        </div>
      </div>
    </motion.div>
  );
}

function Stage({ p }: { p: MotionValue<number> }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (railRef.current && viewportRef.current) {
        setShift(
          Math.max(
            0,
            railRef.current.scrollWidth - viewportRef.current.clientWidth
          )
        );
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.06) / 0.9));
    return -t * shift;
  });
  const titleOpacity = useRamp(p, [0, 0.04], [0, 1]);

  return (
    <div className="h-full flex flex-col justify-center gap-8 sm:gap-10">
      <motion.div
        style={{ opacity: titleOpacity }}
        className="px-6 sm:px-12 max-w-4xl"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-muted mb-3">
          The cast
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight">
          Six personalities. Zero chill.
        </h2>
      </motion.div>

      <div ref={viewportRef} className="overflow-hidden">
        <motion.div
          ref={railRef}
          style={{ x }}
          className="flex gap-5 px-6 sm:px-12 w-max"
        >
          {BROS.map((bro) => (
            <BroCard key={bro.id} bro={bro} />
          ))}
        </motion.div>
      </div>

      <RailFootnote p={p} />
    </div>
  );
}

/** "Keep scrolling" hint that becomes a CTA once the rail is explored. */
function RailFootnote({ p }: { p: MotionValue<number> }) {
  const hintOpacity = useRamp(p, [0.72, 0.8], [1, 0]);
  const ctaOpacity = useRamp(p, [0.82, 0.88], [0, 1]);
  const ctaPointer = useTransform(p, (v) => (v > 0.82 ? "auto" : "none"));
  return (
    <div className="relative h-11 px-6 sm:px-12">
      <motion.p
        className="absolute inset-x-6 sm:inset-x-12 top-1/2 -translate-y-1/2 text-sm text-muted"
        style={{ opacity: hintOpacity }}
      >
        Keep scrolling to meet them all →
      </motion.p>
      <motion.div
        className="absolute inset-x-6 sm:inset-x-12 top-0"
        style={{ opacity: ctaOpacity, pointerEvents: ctaPointer }}
      >
        <a
          href="#waitlist"
          onClick={() => track("cta_mid_click", { where: "showcase" })}
          className="h-11 px-6 rounded-full text-sm font-semibold border border-white/20 hover:bg-white/10 transition inline-flex items-center"
        >
          Found your group&apos;s Bro? Join the waitlist →
        </a>
      </motion.div>
    </div>
  );
}

export default function BrosShowcase() {
  return (
    <PinnedScene height="450vh" heightDesktop="360vh">
      {(p) => <Stage p={p} />}
    </PinnedScene>
  );
}
