"use client";

import { motion } from "framer-motion";

type Line = { from: string; color?: string; text: string; bro?: boolean };

type Scenario = {
  emoji: string;
  title: string;
  lines: Line[];
};

const SCENARIOS: Scenario[] = [
  {
    emoji: "🎮",
    title: "The gaming squad",
    lines: [
      { from: "Dev", color: "#30d158", text: "we got DESTROYED tonight" },
      {
        from: "Spidy Bro",
        color: "#22d3ee",
        bro: true,
        text: "skill issue. also the clip is already a meme, check the group icon",
      },
      { from: "Jay", color: "#4d9fff", text: "NOT THE GROUP ICON 😭" },
    ],
  },
  {
    emoji: "🏈",
    title: "The fantasy league",
    lines: [
      { from: "Sam", color: "#ffd60a", text: "should I trade him or not, last chance" },
      {
        from: "Finance Bro",
        color: "#30d158",
        bro: true,
        text: "his stats say no. your heart says yes. listen to the stats.",
      },
      { from: "Sam", color: "#ffd60a", text: "too late. already did it" },
      { from: "Finance Bro", color: "#30d158", bro: true, text: "📉" },
    ],
  },
  {
    emoji: "🎓",
    title: "The college friends",
    lines: [
      { from: "Zoe", color: "#bf8cff", text: "guess who I just saw at the library" },
      {
        from: "Drama Queen",
        color: "#ff7ab6",
        bro: true,
        text: "WHO. details. NOW. I'm getting the popcorn 🍿",
      },
      { from: "Zoe", color: "#bf8cff", text: "…with his ex." },
      { from: "Drama Queen", color: "#ff7ab6", bro: true, text: "I need to sit down." },
    ],
  },
  {
    emoji: "✈️",
    title: "The travel planning group",
    lines: [
      { from: "Maya", color: "#ff7ab6", text: "day 3 of planning. still zero decisions" },
      {
        from: "Observer Bro",
        color: "#4d9fff",
        bro: true,
        text: "day 3 summary: 47 links shared, 0 links opened.",
      },
      { from: "Maya", color: "#ff7ab6", text: "he's right and he should say it 💀" },
    ],
  },
  {
    emoji: "☕",
    title: "The weekend crew",
    lines: [
      { from: "Jay", color: "#4d9fff", text: "so… plans or are we lying again" },
      {
        from: "Sicker Bava",
        color: "#ffd60a",
        bro: true,
        text: "I have a sticker for this exact situation. sending it. you know the one.",
      },
      { from: "Jay", color: "#4d9fff", text: "😂😂 fine. brunch. 11am." },
    ],
  },
];

function ScenarioCard({ s, flip }: { s: Scenario; flip: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col sm:flex-row items-start gap-5 sm:gap-10 ${flip ? "sm:flex-row-reverse" : ""}`}
    >
      <div className="sm:w-56 shrink-0 pt-1">
        <span className="text-3xl">{s.emoji}</span>
        <h3 className="font-display text-xl font-semibold mt-2 tracking-tight">
          {s.title}
        </h3>
      </div>
      <div className="flex-1 w-full max-w-md rounded-3xl border border-white/8 bg-white/[0.03] p-4 flex flex-col gap-2">
        {s.lines.map((l, i) => (
          <div key={i}>
            <div
              className="text-[10px] font-semibold mb-0.5 ml-1"
              style={{ color: l.color }}
            >
              {l.from}
              {l.bro && (
                <span
                  className="ml-1.5 px-1.5 py-px rounded-full text-[8.5px] uppercase tracking-wider"
                  style={{ background: `${l.color}26`, color: l.color }}
                >
                  Bro
                </span>
              )}
            </div>
            <div
              className={`inline-block px-3 py-1.5 text-[13px] leading-snug rounded-2xl rounded-bl-md ${
                l.bro ? "" : "bg-white/9"
              }`}
              style={
                l.bro
                  ? { background: `${l.color}1f`, border: `1px solid ${l.color}40` }
                  : undefined
              }
            >
              {l.text}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Act3Scenarios() {
  return (
    <section className="relative px-6 sm:px-12 py-28 sm:py-40 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20 sm:mb-28 text-center"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-muted mb-3">
          Imagine yours
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-balance">
          Your group already needs one.
        </h2>
      </motion.div>

      <div className="flex flex-col gap-20 sm:gap-28">
        {SCENARIOS.map((s, i) => (
          <ScenarioCard key={s.title} s={s} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
