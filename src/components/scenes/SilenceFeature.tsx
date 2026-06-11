"use client";

import { motion, MotionValue } from "framer-motion";
import {
  PinnedScene,
  Beat,
  Layer,
  Statement,
  useRamp,
} from "@/components/scroll/Scrub";

const FORBIDDEN = [
  "Certainly!",
  "I'd be happy to help.",
  "Here are 5 tips.",
  "As an AI…",
  "I apologize.",
];

function ForbiddenLine({
  p,
  at,
  children,
}: {
  p: MotionValue<number>;
  at: number;
  children: string;
}) {
  const strike = useRamp(p, [at + 0.025, at + 0.05], [0, 1]);
  return (
    <Beat p={p} at={at}>
      <div className="relative inline-block">
        <span className="font-display text-2xl sm:text-4xl font-medium text-paper/80">
          &ldquo;{children}&rdquo;
        </span>
        <motion.span
          className="absolute left-0 top-1/2 h-[3px] w-full bg-rocky rounded-full origin-left"
          style={{ scaleX: strike }}
        />
      </div>
    </Beat>
  );
}

function Stage({ p }: { p: MotionValue<number> }) {
  return (
    <div className="h-full">
      <Layer
        p={p}
        enter={-1}
        exit={0.46}
        className="flex flex-col items-center justify-center gap-5 sm:gap-7 px-6 text-center"
      >
        <Beat p={p} at={-1}>
          <p className="text-xs uppercase tracking-[0.25em] text-muted mb-4">
            Things a Bro will never say
          </p>
        </Beat>
        {FORBIDDEN.map((phrase, i) => (
          <ForbiddenLine key={phrase} p={p} at={0.03 + i * 0.06}>
            {phrase}
          </ForbiddenLine>
        ))}
      </Layer>

      <Statement p={p} enter={0.52} exit={0.68}>
        Bros talk like friends.
        <br />
        <span className="text-muted">Not assistants.</span>
      </Statement>
      <Statement p={p} enter={0.74} exit={1}>
        And sometimes, a Bro says
        <br />
        nothing at all.
        <span className="block mt-6 text-base sm:text-lg font-sans font-normal text-paper/50">
          Silence is a feature. A Bro speaks when it has something worth
          saying.
        </span>
      </Statement>
    </div>
  );
}

export default function SilenceFeature() {
  return (
    <PinnedScene height="320vh">{(p) => <Stage p={p} />}</PinnedScene>
  );
}
