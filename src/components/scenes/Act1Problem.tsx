"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import {
  PinnedScene,
  Beat,
  Layer,
  Statement,
  useRamp,
} from "@/components/scroll/Scrub";
import PhoneFrame from "@/components/chat/PhoneFrame";
import {
  ChatBubble,
  VoiceNote,
  MemeBubble,
  Timestamp,
} from "@/components/chat/ChatBubble";

import {
  JAY,
  SAM,
  TARA,
  DEV,
  ZOE,
  MEMBERS,
} from "@/components/chat/cast";

function Stage({ p }: { p: MotionValue<number> }) {
  // The chat dims and desaturates as the group goes quiet, then fades out.
  const phoneFilter = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.42) / 0.2));
    return `saturate(${1 - t * 0.7}) brightness(${1 - t * 0.45})`;
  });
  const phoneOpacity = useRamp(p, [0.68, 0.73], [1, 0]);
  const phoneScale = useRamp(p, [0.68, 0.73], [1, 0.96]);
  const hintOpacity = useRamp(p, [0, 0.03], [1, 0]);
  const valueOpacity = useRamp(p, [0.02, 0.06], [1, 0]);

  return (
    <div className="h-full flex items-center justify-center">
      {/* ambient stage light so the phone never floats in a void */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,255,255,0.045), transparent 70%)",
        }}
      />
      <motion.div
        style={{ opacity: phoneOpacity, scale: phoneScale, filter: phoneFilter }}
      >
        <PhoneFrame groupName="the squad 🏀" members={MEMBERS} memberCount={8}>
          {/* Batch 1 — peak energy */}
          <Layer p={p} enter={-1} exit={0.22} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            {/* already on screen when the page loads — the group feels alive instantly */}
            <Beat p={p} at={-1}>
              <Timestamp>Friday 7:42 PM</Timestamp>
            </Beat>
            <Beat p={p} at={-1}>
              <ChatBubble sender={JAY}>WHO&apos;S COMING TONIGHT 🔥🔥</ChatBubble>
            </Beat>
            <Beat p={p} at={-1}>
              <ChatBubble sender={SAM}>broooo I&apos;m in</ChatBubble>
            </Beat>
            <Beat p={p} at={0.03}>
              <ChatBubble me>say less. 9pm?</ChatBubble>
            </Beat>
            <Beat p={p} at={0.07}>
              <ChatBubble sender={TARA} reactions="😂 3">
                someone bring snacks 🍿
              </ChatBubble>
            </Beat>
            <Beat p={p} at={0.115}>
              <ChatBubble sender={DEV}>
                <VoiceNote duration="0:14" />
              </ChatBubble>
            </Beat>
            <Beat p={p} at={0.16}>
              <ChatBubble sender={ZOE} reactions="💀 5">
                <MemeBubble emoji="🤣" label="meme.jpg" />
              </ChatBubble>
            </Beat>
          </Layer>

          {/* Batch 2 — still alive */}
          <Layer p={p} enter={0.24} exit={0.42} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={0.255}>
              <ChatBubble sender={SAM}>NO WAY 😭😭</ChatBubble>
            </Beat>
            <Beat p={p} at={0.28}>
              <ChatBubble sender={JAY}>LETS GOOOO</ChatBubble>
            </Beat>
            <Beat p={p} at={0.305}>
              <ChatBubble me>I&apos;m crying 💀💀</ChatBubble>
            </Beat>
            <Beat p={p} at={0.33}>
              <ChatBubble sender={TARA}>
                ok actual plan: beach saturday?
              </ChatBubble>
            </Beat>
            <Beat p={p} at={0.355}>
              <ChatBubble sender={DEV}>INNNN</ChatBubble>
            </Beat>
            <Beat p={p} at={0.38}>
              <ChatBubble sender={ZOE} reactions="❤️ 4">
                🔥🔥🔥
              </ChatBubble>
            </Beat>
          </Layer>

          {/* Batch 3 — slowing down */}
          <Layer p={p} enter={0.44} exit={0.58} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={0.455}>
              <Timestamp>3 days later</Timestamp>
            </Beat>
            <Beat p={p} at={0.475}>
              <ChatBubble sender={JAY}>anyone up?</ChatBubble>
            </Beat>
            <Beat p={p} at={0.51}>
              <ChatBubble sender={SAM}>busy rn… next week?</ChatBubble>
            </Beat>
            <Beat p={p} at={0.535}>
              <Timestamp>2 weeks later</Timestamp>
            </Beat>
            <Beat p={p} at={0.555}>
              <ChatBubble sender={TARA}>we should hang soon</ChatBubble>
            </Beat>
          </Layer>

          {/* Batch 4 — dead */}
          <Layer p={p} enter={0.6} exit={0.74} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={0.615}>
              <Timestamp>1 month later</Timestamp>
            </Beat>
            <Beat p={p} at={0.635}>
              <ChatBubble sender={JAY}>Anyone alive here?</ChatBubble>
            </Beat>
            <Beat p={p} at={0.66}>
              <div className="text-right text-[10.5px] text-muted pr-1">
                Seen by 8
              </div>
            </Beat>
          </Layer>
        </PhoneFrame>
      </motion.div>

      {/* first-screen value proposition — fades as the story takes over */}
      <motion.div
        className="absolute top-16 sm:top-[7vh] inset-x-0 text-center px-6 z-10"
        style={{ opacity: valueOpacity }}
      >
        <h1 className="font-display text-lg sm:text-2xl lg:text-3xl font-semibold tracking-tight text-balance">
          Personalities that join your group chat.
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted">
          This is the story of every group chat. Scroll.
        </p>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted text-xs tracking-widest uppercase"
        style={{ opacity: hintOpacity }}
      >
        scroll
        <span className="animate-bounce">↓</span>
      </motion.div>

      {/* closing statements */}
      <Statement p={p} enter={0.74} exit={0.89}>
        Somewhere along the way,
        <br />
        the group got quieter.
      </Statement>
      <Statement p={p} enter={0.88} exit={1} hold>
        Group chats don&apos;t die because friendships end.
        <br />
        <span className="text-muted">
          They die because nobody has the energy to keep them alive.
        </span>
      </Statement>
    </div>
  );
}

export default function Act1Problem() {
  return (
    <PinnedScene height="520vh" heightDesktop="380vh">
      {(p) => <Stage p={p} />}
    </PinnedScene>
  );
}
