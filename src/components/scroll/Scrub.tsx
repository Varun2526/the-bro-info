"use client";

import { ReactNode, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";

/**
 * Piecewise-linear interpolation, clamped at the ends.
 *
 * All scroll bindings in this file go through this function-based transform
 * on purpose: array-form useTransform gets compiled to a WAAPI ViewTimeline
 * animation whose range does NOT match our useScroll offsets, so accelerated
 * elements read the wrong progress. Function transforms can't be accelerated,
 * which keeps every element on the same JS-driven timeline.
 */
function ramp(v: number, input: number[], output: number[]): number {
  if (v <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (v <= input[i]) {
      const t = (v - input[i - 1]) / (input[i] - input[i - 1]);
      return output[i - 1] + t * (output[i] - output[i - 1]);
    }
  }
  return output[output.length - 1];
}

export function useRamp(
  p: MotionValue<number>,
  input: number[],
  output: number[]
) {
  return useTransform(p, (v) => ramp(v, input, output));
}

/**
 * Pinned scroll scene: a tall track whose inner stage sticks to the
 * viewport while scroll progress (0..1) scrubs the scene's timeline.
 */
export function PinnedScene({
  height = "400vh",
  className = "",
  children,
}: {
  height?: string;
  className?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={ref} className={`relative ${className}`} style={{ height }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </section>
  );
}

/**
 * Fades/slides a child in at a point on the scene timeline.
 * `at < 0` means "visible from the start".
 */
export function Beat({
  p,
  at,
  span = 0.015,
  y = 14,
  className = "",
  children,
}: {
  p: MotionValue<number>;
  at: number;
  span?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const always = at < 0;
  const opacity = useRamp(p, [at, at + span], always ? [1, 1] : [0, 1]);
  const ty = useRamp(p, [at, at + span], always ? [0, 0] : [y, 0]);
  return (
    <motion.div className={className} style={{ opacity, y: ty }}>
      {children}
    </motion.div>
  );
}

/** A full-screen layer visible only during [enter, exit] on the timeline. */
export function Layer({
  p,
  enter,
  exit,
  fade = 0.03,
  className = "",
  children,
}: {
  p: MotionValue<number>;
  enter: number;
  exit: number;
  fade?: number;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useRamp(
    p,
    [enter, enter + fade, exit - fade, exit],
    [0, 1, 1, 0]
  );
  return (
    <motion.div className={`absolute inset-0 ${className}`} style={{ opacity }}>
      {children}
    </motion.div>
  );
}

/** Large display statement, scrubbed in and out. */
export function Statement({
  p,
  enter,
  exit,
  hold = false,
  children,
}: {
  p: MotionValue<number>;
  enter: number;
  exit: number;
  hold?: boolean;
  children: ReactNode;
}) {
  const fade = 0.035;
  const opacity = useRamp(
    p,
    hold ? [enter, enter + fade] : [enter, enter + fade, exit - fade, exit],
    hold ? [0, 1] : [0, 1, 1, 0]
  );
  const y = useRamp(p, [enter, enter + fade], [30, 0]);
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity, y }}
    >
      <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-center leading-tight tracking-tight max-w-4xl text-balance">
        {children}
      </h2>
    </motion.div>
  );
}
