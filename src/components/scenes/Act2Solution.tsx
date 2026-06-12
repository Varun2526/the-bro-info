"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { track } from "@vercel/analytics";
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
} from "@/components/scroll/Scrub";
import PhoneFrame from "@/components/chat/PhoneFrame";
import {
  ChatBubble,
  Timestamp,
  TypingDots,
  SystemNote,
} from "@/components/chat/ChatBubble";
import { JAY, SAM, TARA, DEV, ZOE, MEMBERS, REVIVER } from "@/components/chat/cast";

function Stage({ p }: { p: MotionValue<number> }) {
  // Color floods back into the chat as the reviver brings it back.
  const phoneFilter = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.16) / 0.3));
    return `saturate(${0.3 + t * 0.7}) brightness(${0.55 + t * 0.45})`;
  });
  // Phone is already on screen when the scene arrives — Act 1's held
  // statement scrolls off and the dead chat is right there. No black gap.
  const phoneOpacity = useRamp(p, [0.76, 0.82], [1, 0]);
  const phoneScale = useRamp(p, [0.76, 0.82], [1, 0.97]);
  // Desktop choreography mirrors Act 1, with a lean into Blaze's opener.
  const phoneX = useTransform(p, (v) =>
    isDesktopViewport()
      ? `${ramp(v, [0.05, 0.12, 0.26, 0.34, 0.44, 0.5, 0.64, 0.72], [0, 11, 11, 0, 0, -11, -11, 0])}vw`
      : "0vw"
  );
  const phoneRotate = useTransform(p, (v) =>
    isDesktopViewport()
      ? ramp(
          v,
          [0.05, 0.12, 0.24, 0.27, 0.31, 0.34, 0.44, 0.5, 0.64, 0.72],
          [0, 1.4, 1.4, -1.8, 1.4, 0, 0, -1.4, -1.4, 0]
        )
      : 0
  );

  // The reviver's typing dots swap into his first message in place. Beats are
  // spread across a wide progress band so a quick flick can't blur the
  // revival — the densest, most important moment on the page.
  const dotsOpacity = useRamp(p, [0.12, 0.14, 0.24, 0.26], [0, 1, 1, 0]);
  const openerOpacity = useRamp(p, [0.26, 0.29], [0, 1]);
  const openerY = useRamp(p, [0.26, 0.29], [10, 0]);

  return (
    <div className="h-full flex items-center justify-center">
      {/* warm stage light returns with the revival */}
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
          rotate: phoneRotate,
        }}
      >
        <PhoneFrame groupName="the squad 🏀" members={MEMBERS} memberCount={8}>
          {/* The dead chat, then the reviver arrives */}
          <Layer p={p} enter={-1} exit={0.42} fade={0.012} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={-1}>
              <Timestamp>1 month later</Timestamp>
            </Beat>
            <Beat p={p} at={-1}>
              <ChatBubble sender={JAY}>Anyone alive here?</ChatBubble>
            </Beat>
            <Beat p={p} at={-1}>
              <div className="text-right text-[10.5px] text-muted pr-1 pb-2">
                Seen by 8
              </div>
            </Beat>

            <Beat p={p} at={0.06} y={8}>
              <SystemNote>
                <span className="px-3 py-1 rounded-full bg-brand/15 text-brand font-medium">
                  ⚡ {REVIVER.name} joined the group
                </span>
              </SystemNote>
            </Beat>

            {/* typing dots crossfade into the opener, stacked in one grid cell */}
            <div className="grid">
              <motion.div
                className="col-start-1 row-start-1 self-end"
                style={{ opacity: dotsOpacity }}
              >
                <ChatBubble sender={REVIVER}>
                  <TypingDots />
                </ChatBubble>
              </motion.div>
              <motion.div
                className="col-start-1 row-start-1 self-end"
                style={{ opacity: openerOpacity, y: openerY }}
              >
                <ChatBubble sender={REVIVER}>
                  this group has more members than conversations 💀
                </ChatBubble>
              </motion.div>
            </div>

            <Beat p={p} at={0.33} y={6}>
              <div className="pl-9 -mt-1">
                <span className="px-1.5 py-px rounded-full bg-[#222226] border border-white/10 text-[10px] tracking-tight">
                  💀 4&ensp;😂 3
                </span>
              </div>
            </Beat>

            <Beat p={p} at={0.37}>
              <ChatBubble sender={JAY}>LMAOOO who added this guy</ChatBubble>
            </Beat>
          </Layer>

          {/* The revival — the group is loud again */}
          <Layer p={p} enter={0.42} exit={0.76} fade={0.018} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={0.45}>
              <ChatBubble sender={SAM}>yo what 😭😭</ChatBubble>
            </Beat>
            <Beat p={p} at={0.49}>
              <ChatBubble sender={TARA}>ok I&apos;m awake 😂</ChatBubble>
            </Beat>
            <Beat p={p} at={0.53}>
              <ChatBubble sender={REVIVER} reactions="🔥 6">
                movie night. friday. I&apos;m picking. be scared.
              </ChatBubble>
            </Beat>
            <Beat p={p} at={0.57}>
              <ChatBubble sender={DEV}>INNNN</ChatBubble>
            </Beat>
            <Beat p={p} at={0.61}>
              <ChatBubble me>not the group chat coming back to life 😭</ChatBubble>
            </Beat>
            <Beat p={p} at={0.66}>
              <ChatBubble sender={ZOE} reactions="❤️ 5">
                I missed this 🥹
              </ChatBubble>
            </Beat>
          </Layer>
        </PhoneFrame>
      </motion.div>

      {/* desktop side captions */}
      <SideNote p={p} enter={0.05} exit={0.3} side="left" title="Then someone new joined.">
        Not a person. Not a bot. A personality.
      </SideNote>
      <SideNote p={p} enter={0.44} exit={0.7} side="right" title="And the group woke up.">
        One spark is all a dead chat needs.
      </SideNote>

      {/* the revival spills out of the phone (desktop only) */}
      <FloatingNote p={p} at={0.46} x="16%" y="20%">
        <span className="text-3xl">😭😭</span>
      </FloatingNote>
      <FloatingNote p={p} at={0.52} x="72%" y="16%">
        <NoteBubble>WHO ADDED HIM 💀</NoteBubble>
      </FloatingNote>
      <FloatingNote p={p} at={0.58} x="14%" y="68%">
        <NoteBubble>the chat is BACK</NoteBubble>
      </FloatingNote>
      <FloatingNote p={p} at={0.64} x="75%" y="72%">
        <span className="text-3xl">❤️‍🔥</span>
      </FloatingNote>
      <FloatingNote p={p} at={0.69} x="66%" y="34%">
        <NoteBubble>Blaze for president 😂</NoteBubble>
      </FloatingNote>

      {/* the reveal — the page's money shot gets the dramatic entrance */}
      <Statement p={p} enter={0.8} exit={0.91} dramatic>
        Meet <span className="text-brand">Bro</span>.
      </Statement>
      <Statement p={p} enter={0.91} exit={1} hold>
        Personalities built
        <br />
        for group chats.
      </Statement>
      <MidCta p={p} />
    </div>
  );
}

/** Convinced already? Don't make people scroll 13 more screens. */
function MidCta({ p }: { p: MotionValue<number> }) {
  const opacity = useRamp(p, [0.95, 0.98], [0, 1]);
  const pointerEvents = useTransform(p, (v) => (v > 0.95 ? "auto" : "none"));
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[14vh] flex justify-center"
      style={{ opacity, pointerEvents }}
    >
      <a
        href="#waitlist"
        onClick={() => track("cta_mid_click", { where: "act2" })}
        className="h-11 px-6 rounded-full text-sm font-semibold border border-white/20 hover:bg-white/10 transition inline-flex items-center"
      >
        Join the waitlist →
      </a>
    </motion.div>
  );
}

export default function Act2Solution() {
  return (
    <PinnedScene height="580vh" heightDesktop="440vh">
      {(p) => <Stage p={p} />}
    </PinnedScene>
  );
}
