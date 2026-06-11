"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { track } from "@vercel/analytics";
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
  Timestamp,
  TypingDots,
  SystemNote,
} from "@/components/chat/ChatBubble";
import { JAY, SAM, MAYA, DEV, ZOE, MEMBERS, TROUBLE } from "@/components/chat/cast";

function Stage({ p }: { p: MotionValue<number> }) {
  // Color floods back into the chat as Trouble Bro revives it.
  const phoneFilter = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.16) / 0.3));
    return `saturate(${0.3 + t * 0.7}) brightness(${0.55 + t * 0.45})`;
  });
  // Phone is already on screen when the scene arrives — Act 1's held
  // statement scrolls off and the dead chat is right there. No black gap.
  const phoneOpacity = useRamp(p, [0.64, 0.7], [1, 0]);
  const phoneScale = useRamp(p, [0.64, 0.7], [1, 0.97]);

  // Trouble Bro's typing dots swap into his first message in place.
  const dotsOpacity = useRamp(p, [0.12, 0.135, 0.17, 0.185], [0, 1, 1, 0]);
  const openerOpacity = useRamp(p, [0.185, 0.2], [0, 1]);
  const openerY = useRamp(p, [0.185, 0.2], [10, 0]);

  return (
    <div className="h-full flex items-center justify-center">
      {/* warm stage light returns with the revival */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(191,140,255,0.05), transparent 70%)",
        }}
      />
      <motion.div
        style={{ opacity: phoneOpacity, scale: phoneScale, filter: phoneFilter }}
      >
        <PhoneFrame groupName="the squad 🏀" members={MEMBERS} memberCount={8}>
          {/* The dead chat, then Trouble Bro arrives */}
          <Layer p={p} enter={-1} exit={0.34} fade={0.01} className="flex flex-col justify-end gap-1.5 pb-3">
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

            <Beat p={p} at={0.07} y={8}>
              <SystemNote>
                <span className="px-3 py-1 rounded-full bg-luna/15 text-luna font-medium">
                  ⚡ Trouble Bro joined the group
                </span>
              </SystemNote>
            </Beat>

            {/* typing dots crossfade into the opener, stacked in one grid cell */}
            <div className="grid">
              <motion.div
                className="col-start-1 row-start-1 self-end"
                style={{ opacity: dotsOpacity }}
              >
                <ChatBubble sender={TROUBLE}>
                  <TypingDots />
                </ChatBubble>
              </motion.div>
              <motion.div
                className="col-start-1 row-start-1 self-end"
                style={{ opacity: openerOpacity, y: openerY }}
              >
                <ChatBubble sender={TROUBLE}>
                  this group has more members than conversations 💀
                </ChatBubble>
              </motion.div>
            </div>

            <Beat p={p} at={0.25} y={6}>
              <div className="pl-9 -mt-1">
                <span className="px-1.5 py-px rounded-full bg-[#222226] border border-white/10 text-[10px] tracking-tight">
                  💀 4&ensp;😂 3
                </span>
              </div>
            </Beat>

            <Beat p={p} at={0.29}>
              <ChatBubble sender={JAY}>LMAOOO who added this guy</ChatBubble>
            </Beat>
          </Layer>

          {/* The revival — the group is loud again */}
          <Layer p={p} enter={0.36} exit={0.66} fade={0.015} className="flex flex-col justify-end gap-1.5 pb-3">
            <Beat p={p} at={0.375}>
              <ChatBubble sender={SAM}>yo what 😭😭</ChatBubble>
            </Beat>
            <Beat p={p} at={0.4}>
              <ChatBubble sender={MAYA}>ok I&apos;m awake 😂</ChatBubble>
            </Beat>
            <Beat p={p} at={0.425}>
              <ChatBubble sender={TROUBLE} reactions="🔥 6">
                movie night. friday. I&apos;m picking. be scared.
              </ChatBubble>
            </Beat>
            <Beat p={p} at={0.46}>
              <ChatBubble sender={DEV}>INNNN</ChatBubble>
            </Beat>
            <Beat p={p} at={0.485}>
              <ChatBubble me>not the group chat coming back to life 😭</ChatBubble>
            </Beat>
            <Beat p={p} at={0.51}>
              <ChatBubble sender={ZOE} reactions="❤️ 5">
                I missed this 🥹
              </ChatBubble>
            </Beat>
          </Layer>
        </PhoneFrame>
      </motion.div>

      {/* the reveal */}
      <Statement p={p} enter={0.71} exit={0.86}>
        Meet <span className="text-luna">Bro</span>.
      </Statement>
      <Statement p={p} enter={0.85} exit={1} hold>
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
  const opacity = useRamp(p, [0.92, 0.96], [0, 1]);
  const pointerEvents = useTransform(p, (v) => (v > 0.92 ? "auto" : "none"));
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
    <PinnedScene height="440vh" heightDesktop="320vh">
      {(p) => <Stage p={p} />}
    </PinnedScene>
  );
}
