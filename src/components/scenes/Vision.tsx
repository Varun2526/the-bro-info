"use client";

import { MotionValue } from "framer-motion";
import { PinnedScene, Beat, Statement } from "@/components/scroll/Scrub";
import { BROS } from "@/components/chat/cast";

/**
 * A constellation of group chats lighting up across the world.
 * Deterministic positions — no Math.random, so SSR and client agree.
 * Colors cycle through the cast so the palette stays in sync.
 */
const POSITIONS: { x: number; y: number; s: number }[] = [
  { x: 8, y: 18, s: 10 }, { x: 16, y: 64, s: 7 },
  { x: 23, y: 32, s: 12 }, { x: 30, y: 78, s: 8 },
  { x: 36, y: 14, s: 9 }, { x: 42, y: 52, s: 11 },
  { x: 49, y: 84, s: 7 }, { x: 55, y: 26, s: 10 },
  { x: 61, y: 66, s: 8 }, { x: 68, y: 12, s: 12 },
  { x: 74, y: 44, s: 7 }, { x: 81, y: 76, s: 9 },
  { x: 88, y: 30, s: 11 }, { x: 93, y: 58, s: 7 },
  { x: 12, y: 88, s: 9 }, { x: 27, y: 8, s: 7 },
  { x: 58, y: 8, s: 8 }, { x: 86, y: 90, s: 10 },
  { x: 5, y: 44, s: 8 }, { x: 95, y: 12, s: 8 },
  { x: 47, y: 38, s: 9 }, { x: 70, y: 88, s: 10 },
  { x: 34, y: 94, s: 8 }, { x: 64, y: 36, s: 7 },
];

const EMOJIS = ["💀", "😂", "❤️", "🔥", "🍿", "⚡", "😭", "🥹"];
const PILLS = ["movie night 🎬", "the squad 🏀", "goa trip ✈️", "fantasy league 🏈"];

/** Not particles — the world's group chats: glowing dots, stray
 *  reactions, and named chats lighting up. Deterministic by index. */
const ITEMS = POSITIONS.map((d, i) => {
  if (i % 6 === 4) return { ...d, kind: "pill" as const, text: PILLS[Math.floor(i / 6) % PILLS.length] };
  if (i % 3 === 1) return { ...d, kind: "emoji" as const, text: EMOJIS[i % EMOJIS.length] };
  return { ...d, kind: "dot" as const, c: BROS[i % BROS.length].color };
});

function Stage({ p }: { p: MotionValue<number> }) {
  return (
    <div className="h-full relative">
      {/* the world of group chats */}
      <div className="absolute inset-0">
        {ITEMS.map((d, i) => (
          <Beat
            key={i}
            p={p}
            at={0.02 + (i % 12) * 0.035}
            span={0.04}
            y={0}
            className="absolute"
          >
            {d.kind === "dot" ? (
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
            ) : d.kind === "emoji" ? (
              <span
                className="absolute select-none"
                style={{
                  left: `${d.x}vw`,
                  top: `${d.y}vh`,
                  fontSize: d.s + 8,
                  opacity: 0.65,
                }}
              >
                {d.text}
              </span>
            ) : (
              <span
                className="absolute select-none whitespace-nowrap px-2.5 py-1 rounded-full bg-white/6 border border-white/10 text-[11px] text-paper/70"
                style={{ left: `${d.x}vw`, top: `${d.y}vh` }}
              >
                {d.text}
              </span>
            )}
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
        deserves a <span className="text-brand">Bro</span>.
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
