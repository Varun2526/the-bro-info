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
export function ramp(v: number, input: number[], output: number[]): number {
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
  heightDesktop,
  className = "",
  children,
}: {
  height?: string;
  /** Wheel scrolling covers distance slower than thumb flicks, so
   *  desktop scenes should be shorter than mobile ones. */
  heightDesktop?: string;
  className?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      className={`relative h-[var(--scene-h)] lg:h-[var(--scene-h-lg)] ${className}`}
      style={
        {
          "--scene-h": height,
          "--scene-h-lg": heightDesktop ?? height,
        } as React.CSSProperties
      }
    >
      {/* dvh: 100vh lies on iOS Safari when the URL bar collapses */}
      <div className="sticky top-0 h-dvh overflow-hidden">
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

/**
 * A full-screen layer visible only during [enter, exit] on the timeline.
 * `enter < 0` means "visible from the very start" (no fade-in).
 */
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
    enter < 0
      ? [exit - fade, exit]
      : [enter, enter + fade, exit - fade, exit],
    enter < 0 ? [1, 0] : [0, 1, 1, 0]
  );
  return (
    <motion.div className={`absolute inset-0 ${className}`} style={{ opacity }}>
      {children}
    </motion.div>
  );
}

/** True on lg+ viewports, read live so scroll transforms can gate
 *  desktop-only choreography without re-render plumbing. */
export function isDesktopViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth >= 1024;
}

/**
 * A reaction/quote that drifts up through the desktop side space while
 * the chat plays — the conversation's energy leaking out of the phone.
 */
export function FloatingNote({
  p,
  at,
  span = 0.14,
  x,
  y,
  children,
}: {
  p: MotionValue<number>;
  at: number;
  span?: number;
  /** percentage strings, e.g. "16%" */
  x: string;
  y: string;
  children: ReactNode;
}) {
  const opacity = useRamp(
    p,
    [at, at + 0.025, at + span - 0.035, at + span],
    [0, 1, 1, 0]
  );
  const ty = useRamp(p, [at, at + span], [28, -56]);
  return (
    <motion.div
      className="hidden lg:block absolute pointer-events-none select-none"
      style={{ left: x, top: y, opacity, y: ty }}
    >
      {children}
    </motion.div>
  );
}

/** Mini chat bubble for FloatingNote contents. */
export function NoteBubble({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-3.5 py-2 rounded-2xl rounded-bl-md bg-white/8 border border-white/10 text-sm text-paper/85 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
      {children}
    </span>
  );
}

/**
 * Desktop-only caption beside the centered phone — the wide canvas
 * should participate in the story instead of being a void.
 */
export function SideNote({
  p,
  enter,
  exit,
  side,
  title,
  children,
}: {
  p: MotionValue<number>;
  enter: number;
  exit: number;
  side: "left" | "right";
  title: string;
  children: ReactNode;
}) {
  const opacity = useRamp(
    p,
    [enter, enter + 0.05, exit - 0.05, exit],
    [0, 1, 1, 0]
  );
  const y = useRamp(p, [enter, enter + 0.05], [24, 0]);
  return (
    <motion.div
      className={`hidden lg:block absolute top-[40vh] max-w-60 ${
        side === "left" ? "left-[7vw]" : "right-[7vw] text-right"
      }`}
      style={{ opacity, y }}
    >
      <div className="font-display text-2xl font-semibold tracking-tight text-paper/85">
        {title}
      </div>
      <p className="mt-2 text-sm text-muted leading-relaxed">{children}</p>
    </motion.div>
  );
}

/** Large display statement, scrubbed in and out.
 *  `dramatic` adds a blur-to-sharp + slight scale entrance — reserve it
 *  for the page's money shots. */
export function Statement({
  p,
  enter,
  exit,
  hold = false,
  dramatic = false,
  children,
}: {
  p: MotionValue<number>;
  enter: number;
  exit: number;
  hold?: boolean;
  dramatic?: boolean;
  children: ReactNode;
}) {
  const fade = 0.035;
  const opacity = useRamp(
    p,
    hold ? [enter, enter + fade] : [enter, enter + fade, exit - fade, exit],
    hold ? [0, 1] : [0, 1, 1, 0]
  );
  const y = useRamp(p, [enter, enter + fade], [30, 0]);
  const filter = useTransform(p, (v) =>
    dramatic ? `blur(${ramp(v, [enter, enter + fade * 1.6], [14, 0])}px)` : "none"
  );
  const scale = useTransform(p, (v) =>
    dramatic ? ramp(v, [enter, enter + fade * 1.6], [1.08, 1]) : 1
  );
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity, y, filter, scale }}
    >
      <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-center leading-tight tracking-tight max-w-4xl text-balance">
        {children}
      </h2>
    </motion.div>
  );
}
