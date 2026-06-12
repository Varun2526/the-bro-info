"use client";

import { motion } from "framer-motion";

/**
 * One compact beat, not a full scene — visitors are here to join a
 * waitlist, not to hear a creator-economy pitch.
 */
export default function CreatorMoment() {
  return (
    <section className="min-h-[55vh] flex items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.25em] text-muted mb-4">
          And one day, soon
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-balance">
          Build a personality.
          <br />
          <span className="text-paper/60">Share it with the world.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-paper/60 max-w-lg mx-auto">
          The one who never forgets a birthday. The roast king. The fantasy
          league instigator. The travel planner who actually gets everyone to
          reply. Imagine the Bro your group is missing — then build it.
        </p>
      </motion.div>
    </section>
  );
}
