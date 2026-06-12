"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import {
  PinnedScene,
  Beat,
  Layer,
  Statement,
  SideNote,
  FloatingNote,
  NoteBubble,
  isDesktopViewport,
  ramp,
  useRamp,
  usePacedProgress,
} from "@/components/scroll/Scrub";

/** Checkpoints that must linger: alive-peak, still-alive plans, the
 *  slowing, and the "Seen by 8" silence. */
const ACT1_HOLDS = [0.13, 0.33, 0.5, 0.645];
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
import { useTheme } from "@/components/theme/Theme";
import { ACT1 } from "./chatScripts";

function Stage({ p: rawP }: { p: MotionValue<number> }) {
  // Pace raw scroll into story progress that dwells on the key beats.
  const p = usePacedProgress(rawP, ACT1_HOLDS);
  // Theme changes only the words — every timing/sender/beat below is fixed.
  const s = ACT1[useTheme()];
  // The chat dims and desaturates as the group goes quiet, then fades out.
  const phoneFilter = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.42) / 0.2));
    return `saturate(${1 - t * 0.7}) brightness(${1 - t * 0.45})`;
  });
  const phoneOpacity = useRamp(p, [0.68, 0.73], [1, 0]);
  // Entrance: the phone starts smaller and lower, stepping forward as the
  // headline recedes — then zooms on the unanswered message, then recedes.
  const phoneScale = useRamp(
    p,
    [0, 0.07, 0.6, 0.66, 0.68, 0.73],
    [0.82, 1, 1, 1.06, 1.06, 0.96]
  );
  const phoneY = useTransform(
    p,
    (v) => `${ramp(v, [0, 0.07], [7, 0])}vh`
  );
  // Desktop choreography: the phone drifts opposite each side caption,
  // with a slight lean — a character on a stage, not a statue.
  const phoneX = useTransform(p, (v) =>
    isDesktopViewport()
      ? `${ramp(v, [0.05, 0.12, 0.26, 0.34, 0.42, 0.48, 0.58, 0.66], [0, 11, 11, 0, 0, -11, -11, 0])}vw`
      : "0vw"
  );
  const phoneRotate = useTransform(p, (v) =>
    isDesktopViewport()
      ? ramp(v, [0.05, 0.12, 0.26, 0.34, 0.42, 0.48, 0.58, 0.66], [0, 1.4, 1.4, 0, 0, -1.4, -1.4, 0])
      : 0
  );
  const hintOpacity = useRamp(p, [0, 0.03], [1, 0]);
  const valueOpacity = useRamp(p, [0.02, 0.06], [1, 0]);

  return (
    <div className="h-full flex items-center justify-center">
      {/* ambient stage light so the phone never floats in a void */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, var(--stage-tint), transparent 70%)",
        }}
      />
      <motion.div
        style={{
          opacity: phoneOpacity,
          scale: phoneScale,
          filter: phoneFilter,
          x: phoneX,
          y: phoneY,
          rotate: phoneRotate,
        }}
      >
        <PhoneFrame groupName={s.group} members={MEMBERS} memberCount={8}>
          {/* Batch 1 — peak energy */}
          <Layer p={p} enter={-1} exit={0.22} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            {/* already on screen when the page loads — the group feels alive instantly */}
            <Beat p={p} at={-1}>
              <Timestamp>{s.b1ts}</Timestamp>
            </Beat>
            <Beat p={p} at={-1}>
              <ChatBubble sender={JAY}>{s.b1.jay}</ChatBubble>
            </Beat>
            <Beat p={p} at={-1}>
              <ChatBubble sender={SAM}>{s.b1.sam}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.03}>
              <ChatBubble me>{s.b1.me}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.07}>
              <ChatBubble sender={TARA} reactions={s.b1.tara.react}>
                {s.b1.tara.text}
              </ChatBubble>
            </Beat>
            <Beat p={p} at={0.115}>
              <ChatBubble sender={DEV}>
                <VoiceNote duration={s.b1.voiceDur} />
              </ChatBubble>
            </Beat>
            <Beat p={p} at={0.16}>
              <ChatBubble sender={ZOE} reactions={s.b1.meme.react}>
                <MemeBubble emoji={s.b1.meme.emoji} label={s.b1.meme.label} />
              </ChatBubble>
            </Beat>
          </Layer>

          {/* Batch 2 — still alive */}
          <Layer p={p} enter={0.24} exit={0.42} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={0.255}>
              <ChatBubble sender={SAM}>{s.b2.sam}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.28}>
              <ChatBubble sender={JAY}>{s.b2.jay}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.305}>
              <ChatBubble me>{s.b2.me}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.33}>
              <ChatBubble sender={TARA}>{s.b2.tara}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.355}>
              <ChatBubble sender={DEV}>{s.b2.dev}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.38}>
              <ChatBubble sender={ZOE} reactions={s.b2.zoe.react}>
                {s.b2.zoe.text}
              </ChatBubble>
            </Beat>
          </Layer>

          {/* Batch 3 — slowing down */}
          <Layer p={p} enter={0.44} exit={0.58} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={0.455}>
              <Timestamp>{s.slow.t1}</Timestamp>
            </Beat>
            <Beat p={p} at={0.475}>
              <ChatBubble sender={JAY}>{s.slow.jay}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.51}>
              <ChatBubble sender={SAM}>{s.slow.sam}</ChatBubble>
            </Beat>
            <Beat p={p} at={0.535}>
              <Timestamp>{s.slow.t2}</Timestamp>
            </Beat>
            <Beat p={p} at={0.555}>
              <ChatBubble sender={TARA}>{s.slow.tara}</ChatBubble>
            </Beat>
          </Layer>

          {/* Batch 4 — dead */}
          <Layer p={p} enter={0.6} exit={0.74} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={0.615}>
              <Timestamp>{s.dead.t1}</Timestamp>
            </Beat>
            <Beat p={p} at={0.635}>
              <ChatBubble sender={JAY}>{s.dead.jay}</ChatBubble>
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
        className="absolute top-[9vh] lg:top-[12vh] inset-x-0 text-center px-6 z-10"
        style={{ opacity: valueOpacity }}
      >
        <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-semibold tracking-tight text-balance">
          Personalities that join your group chat.
        </h1>
        <p className="mt-3 text-sm lg:text-base text-muted">
          This is the story of every group chat. Scroll.
        </p>
      </motion.div>

      {/* desktop side captions — the wide canvas tells the story too */}
      <SideNote p={p} enter={0.05} exit={0.3} side="left" title={s.notes[0].title}>
        {s.notes[0].body}
      </SideNote>
      <SideNote p={p} enter={0.42} exit={0.64} side="right" title={s.notes[1].title}>
        {s.notes[1].body}
      </SideNote>

      {/* the chat's energy leaks out of the phone (desktop, peak phase only) */}
      <FloatingNote p={p} at={0.04} x="17%" y="18%">
        <span className="text-3xl">{s.floating[0]}</span>
      </FloatingNote>
      <FloatingNote p={p} at={0.1} x="70%" y="24%">
        <NoteBubble>{s.floating[1]}</NoteBubble>
      </FloatingNote>
      <FloatingNote p={p} at={0.17} x="14%" y="70%">
        <NoteBubble>{s.floating[2]}</NoteBubble>
      </FloatingNote>
      <FloatingNote p={p} at={0.24} x="74%" y="62%">
        <span className="text-3xl">{s.floating[3]}</span>
      </FloatingNote>
      <FloatingNote p={p} at={0.3} x="68%" y="36%">
        <NoteBubble>{s.floating[4]}</NoteBubble>
      </FloatingNote>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted/80 text-xs tracking-widest uppercase"
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
    <PinnedScene height="560vh" heightDesktop="430vh">
      {(p) => <Stage p={p} />}
    </PinnedScene>
  );
}
