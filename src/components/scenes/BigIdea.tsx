"use client";

import { MotionValue } from "framer-motion";
import {
  PinnedScene,
  Beat,
  Layer,
  Statement,
} from "@/components/scroll/Scrub";

const FLOW: { who: "friend" | "bro"; color?: string }[] = [
  { who: "friend" },
  { who: "friend" },
  { who: "bro", color: "#bf8cff" },
  { who: "friend" },
  { who: "bro", color: "#ffd60a" },
  { who: "friend" },
];

function Stage({ p }: { p: MotionValue<number> }) {
  return (
    <div className="h-full">
      {/* the conversation rhythm: friends and Bros, interleaved */}
      <Layer
        p={p}
        enter={-1}
        exit={0.42}
        className="flex flex-col items-center justify-center gap-3 px-6"
      >
        <Beat p={p} at={-1}>
          <p className="text-xs uppercase tracking-[0.25em] text-muted mb-6 text-center">
            A Bro never takes over the chat
          </p>
        </Beat>
        {FLOW.map((row, i) => (
          <Beat key={i} p={p} at={0.03 + i * 0.05}>
            <div
              className={`flex items-center gap-3 ${row.who === "bro" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-44 sm:w-60 h-9 rounded-full ${
                  row.who === "friend" ? "bg-white/10" : ""
                }`}
                style={
                  row.who === "bro"
                    ? { background: `${row.color}33`, border: `1px solid ${row.color}66` }
                    : undefined
                }
              />
              <span
                className="text-[11px] uppercase tracking-widest"
                style={{ color: row.who === "bro" ? row.color : "#8e8e93" }}
              >
                {row.who}
              </span>
            </div>
          </Beat>
        ))}
      </Layer>

      <Statement p={p} enter={0.45} exit={0.62}>
        <span className="text-muted">Technology was built to</span>
        <br />
        replace conversations.
      </Statement>
      <Statement p={p} enter={0.61} exit={0.79}>
        Bro was built
        <br />
        to <span className="text-luna">join</span> them.
      </Statement>
      <Statement p={p} enter={0.78} exit={1} hold>
        Because the best conversations
        <br />
        happen <em className="not-italic text-miles">together</em>.
      </Statement>
    </div>
  );
}

export default function BigIdea() {
  return (
    <PinnedScene height="400vh" heightDesktop="300vh">
      {(p) => <Stage p={p} />}
    </PinnedScene>
  );
}
