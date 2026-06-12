"use client";

import { MotionValue } from "framer-motion";
import {
  PinnedScene,
  Beat,
  Layer,
  Statement,
} from "@/components/scroll/Scrub";
import { bro } from "@/components/chat/cast";

const BLAZE = bro("trouble");
const KAI = bro("bava");

/** A real micro-conversation — show the rhythm, don't diagram it. */
const FLOW: {
  who: "friend" | "bro";
  color?: string;
  name?: string;
  text: string;
}[] = [
  { who: "friend", text: "so are we doing this trip or not 😭" },
  { who: "friend", text: "every year we say goa. every year, nothing." },
  {
    who: "bro",
    color: BLAZE.color,
    name: BLAZE.name,
    text: "poll's up. vote in 1 hour or I'm choosing ⏳",
  },
  { who: "friend", text: "WHO gave him admin" },
  {
    who: "bro",
    color: KAI.color,
    name: KAI.name,
    text: "I have a meme for this exact moment",
  },
  { who: "friend", text: "ok fine, voting 😂" },
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
                className={`max-w-64 sm:max-w-xs px-4 py-2 text-[13.5px] leading-snug rounded-2xl ${
                  row.who === "friend"
                    ? "bg-white/10 rounded-bl-md"
                    : "rounded-br-md"
                }`}
                style={
                  row.who === "bro"
                    ? { background: `${row.color}26`, border: `1px solid ${row.color}55` }
                    : undefined
                }
              >
                {row.text}
              </div>
              <span
                className="text-[11px] uppercase tracking-widest shrink-0"
                style={{ color: row.who === "bro" ? row.color : "#8e8e93" }}
              >
                {row.who === "bro" ? row.name : "friend"}
              </span>
            </div>
          </Beat>
        ))}
      </Layer>

      <Statement p={p} enter={0.45} exit={0.62}>
        <span className="text-muted">Everything else was built to</span>
        <br />
        replace conversations.
      </Statement>
      <Statement p={p} enter={0.61} exit={0.79}>
        Bro was built
        <br />
        to <span className="text-brand">join</span> them.
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
