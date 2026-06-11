"use client";

import { motion, useScroll } from "framer-motion";

/**
 * Thin top progress bar. On a 20+ screen story page, this is the only
 * persistent signal that scrolling is moving the story forward.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left bg-gradient-to-r from-luna to-[#ff7ab6]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
