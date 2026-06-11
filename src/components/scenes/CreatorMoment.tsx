"use client";

import { MotionValue } from "framer-motion";
import {
  PinnedScene,
  Beat,
  Layer,
  Statement,
} from "@/components/scroll/Scrub";

const STEPS = [
  { n: "01", color: "#bf8cff", title: "Create a Bro", sub: "Give it a personality, a voice, a vibe." },
  { n: "02", color: "#4d9fff", title: "Publish it", sub: "One tap. It's out in the world." },
  { n: "03", color: "#22d3ee", title: "Groups discover it", sub: "Friends invite it into their chats." },
  { n: "04", color: "#ffd60a", title: "It spreads", sub: "Group to group. Chat to chat." },
  { n: "05", color: "#30d158", title: "You earn", sub: "Your personality, your upside." },
];

function Stage({ p }: { p: MotionValue<number> }) {
  return (
    <div className="h-full">
      <Layer
        p={p}
        enter={-1}
        exit={0.62}
        className="flex flex-col justify-center px-8 sm:px-0 sm:items-center"
      >
        <div className="flex flex-col gap-6 sm:gap-7">
          <Beat p={p} at={-1}>
            <p className="text-xs uppercase tracking-[0.25em] text-muted mb-2">
              For creators
            </p>
          </Beat>
          {STEPS.map((s, i) => (
            <Beat key={s.n} p={p} at={0.05 + i * 0.09} span={0.03}>
              <div className="flex items-baseline gap-4 sm:gap-6">
                <span
                  className="font-display text-sm font-bold tracking-widest"
                  style={{ color: s.color }}
                >
                  {s.n}
                </span>
                <div>
                  <div className="font-display text-2xl sm:text-4xl font-semibold tracking-tight">
                    {s.title}
                  </div>
                  <div className="text-sm sm:text-base text-paper/50 mt-0.5">
                    {s.sub}
                  </div>
                </div>
              </div>
            </Beat>
          ))}
        </div>
      </Layer>

      <Statement p={p} enter={0.64} exit={1} hold>
        Build a personality.
        <br />
        <span className="text-paper/60">Share it with the world.</span>
      </Statement>
    </div>
  );
}

export default function CreatorMoment() {
  return (
    <PinnedScene height="300vh" heightDesktop="240vh">
      {(p) => <Stage p={p} />}
    </PinnedScene>
  );
}
