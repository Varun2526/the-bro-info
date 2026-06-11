"use client";

import { MotionValue } from "framer-motion";
import { PinnedScene, Beat, Statement } from "@/components/scroll/Scrub";

/**
 * A constellation of group chats lighting up across the world.
 * Deterministic positions — no Math.random, so SSR and client agree.
 */
const DOTS: { x: number; y: number; c: string; s: number }[] = [
  { x: 8, y: 18, c: "#bf8cff", s: 10 }, { x: 16, y: 64, c: "#4d9fff", s: 7 },
  { x: 23, y: 32, c: "#ffd60a", s: 12 }, { x: 30, y: 78, c: "#ff7ab6", s: 8 },
  { x: 36, y: 14, c: "#30d158", s: 9 }, { x: 42, y: 52, c: "#22d3ee", s: 11 },
  { x: 49, y: 84, c: "#bf8cff", s: 7 }, { x: 55, y: 26, c: "#ff7ab6", s: 10 },
  { x: 61, y: 66, c: "#ffd60a", s: 8 }, { x: 68, y: 12, c: "#4d9fff", s: 12 },
  { x: 74, y: 44, c: "#30d158", s: 7 }, { x: 81, y: 76, c: "#22d3ee", s: 9 },
  { x: 88, y: 30, c: "#bf8cff", s: 11 }, { x: 93, y: 58, c: "#ff7ab6", s: 7 },
  { x: 12, y: 88, c: "#22d3ee", s: 9 }, { x: 27, y: 8, c: "#ff7ab6", s: 7 },
  { x: 58, y: 8, c: "#30d158", s: 8 }, { x: 86, y: 90, c: "#ffd60a", s: 10 },
  { x: 5, y: 44, c: "#30d158", s: 8 }, { x: 95, y: 12, c: "#22d3ee", s: 8 },
  { x: 47, y: 38, c: "#ff5c38", s: 9 }, { x: 70, y: 88, c: "#4d9fff", s: 10 },
  { x: 34, y: 94, c: "#bf8cff", s: 8 }, { x: 64, y: 36, c: "#ffd60a", s: 7 },
];

function Stage({ p }: { p: MotionValue<number> }) {
  return (
    <div className="h-full relative">
      {/* the world of group chats */}
      <div className="absolute inset-0">
        {DOTS.map((d, i) => (
          <Beat
            key={i}
            p={p}
            at={0.02 + (i % 12) * 0.035}
            span={0.04}
            y={0}
            className="absolute"
          >
            <div
              className="rounded-full"
              style={{
                position: "absolute",
                left: `${d.x}vw`,
                top: `${d.y}vh`,
                width: d.s,
                height: d.s,
                background: d.c,
                opacity: 0.55,
                boxShadow: `0 0 ${d.s * 2.2}px ${d.c}`,
              }}
            />
          </Beat>
        ))}
      </div>

      <Statement p={p} enter={0.14} exit={0.4}>
        Technology changes.
        <br />
        <span className="text-paper/60">Friendships don&apos;t.</span>
      </Statement>
      <Statement p={p} enter={0.39} exit={0.66}>
        The future isn&apos;t about replacing people.
        <br />
        <span className="text-coach">
          It&apos;s about helping people connect.
        </span>
      </Statement>
      <Statement p={p} enter={0.65} exit={1} hold>
        Every group chat
        <br />
        deserves a <span className="text-luna">Bro</span>.
      </Statement>
    </div>
  );
}

export default function Vision() {
  return (
    <PinnedScene height="360vh" heightDesktop="280vh">
      {(p) => <Stage p={p} />}
    </PinnedScene>
  );
}
