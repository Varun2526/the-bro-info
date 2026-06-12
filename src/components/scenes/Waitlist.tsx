"use client";

import { animate, motion, useInView } from "framer-motion";
import { track } from "@vercel/analytics";
import { FormEvent, useEffect, useRef, useState } from "react";
import { COUNTRIES, flagOf } from "./countries";

/** Below this, show "founding circle" framing instead of a raw count. */
const COUNTER_FLOOR = 25;

/** Animated number — proof should feel alive, not printed. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
}

export default function Waitlist() {
  const [iso, setIso] = useState("IN");
  const [number, setNumber] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">(
    "idle"
  );

  const country = COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];

  // Default the dial code to the visitor's own country.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const region = new Intl.Locale(navigator.language).maximize().region;
        if (region && COUNTRIES.some((c) => c.iso === region)) setIso(region);
      } catch {
        // keep fallback
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d) => typeof d.count === "number" && setCount(d.count))
      .catch(() => {});
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `${country.dial} ${number}` }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (typeof data.position === "number") setPosition(data.position);
      setState("done");
      track("waitlist_submit");
    } catch {
      setState("error");
      track("waitlist_error");
    }
  }

  const shareUrl = () =>
    typeof window !== "undefined" ? window.location.origin : "";
  const shareText = () =>
    `our group chat needs this 💀 personalities that join group chats — ${shareUrl()}`;

  async function share() {
    track("waitlist_share", { method: "native" });
    try {
      await navigator.share({ text: shareText() });
    } catch {
      // user dismissed — no-op
    }
  }

  /** Try the async Clipboard API, fall back to execCommand, then reveal
   *  a selectable field. Clipboard write is denied in many contexts
   *  (iframes, unfocused tabs), so a silent single attempt looks broken. */
  async function copyLink() {
    track("waitlist_share", { method: "copy" });
    const url = shareUrl();
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.top = "0";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setShowManual(false);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Last resort: show the link so the user can copy it by hand.
      setShowManual(true);
    }
  }

  return (
    <section
      id="waitlist"
      className="relative min-h-dvh flex flex-col items-center justify-center px-6 text-center"
    >
      {/* soft glow behind the CTA, tinted by the active theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 55%, var(--stage-strong), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative max-w-3xl"
      >
        <p className="text-sm uppercase tracking-[0.25em] text-brand mb-5">
          The best groups find their way back.
        </p>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-balance">
          Your group chat is about to get a new member.
        </h2>
        <p className="mt-5 text-lg sm:text-xl text-paper/60">
          Be among the first to invite a Bro.
        </p>

        {count !== null && state !== "done" && (
          <div className="mt-6 text-sm">
            <p className="text-brand font-medium">
              Founding member #{(count + 1).toLocaleString()} is open.
            </p>
            {count >= COUNTER_FLOOR ? (
              <p className="mt-1 text-muted">
                <CountUp value={count} /> people are already waiting
              </p>
            ) : count > 0 ? (
              <p className="mt-1 text-muted">
                The founding circle is forming — {count}{" "}
                {count === 1 ? "spot" : "spots"} claimed.
              </p>
            ) : null}
          </div>
        )}

        {state === "done" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10"
          >
            <div className="text-xl sm:text-2xl font-display font-semibold text-coach">
              You&apos;re in{position !== null ? ` — #${position.toLocaleString()} on the list` : ""}. 🎉
            </div>
            <p className="mt-3 text-sm text-paper/60">
              Bros work best with your whole group. Bring them.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText())}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("waitlist_share", { method: "whatsapp" })}
                className="h-11 px-6 rounded-full font-semibold text-ink text-sm bg-coach hover:opacity-90 transition inline-flex items-center justify-center"
              >
                Share on WhatsApp
              </a>
              {typeof navigator !== "undefined" && "share" in navigator ? (
                <button
                  onClick={share}
                  className="h-11 px-6 rounded-full font-semibold text-sm border border-white/20 hover:bg-white/10 transition cursor-pointer"
                >
                  Share…
                </button>
              ) : null}
              <button
                onClick={copyLink}
                className="h-11 px-6 rounded-full font-semibold text-sm border border-white/20 hover:bg-white/10 transition cursor-pointer"
              >
                {copied ? "Copied ✓" : "Copy link"}
              </button>
            </div>

            {showManual && (
              <div className="mt-4 flex flex-col items-center gap-1">
                <p className="text-xs text-muted">Copy this link:</p>
                <input
                  readOnly
                  value={shareUrl()}
                  onFocus={(e) => e.currentTarget.select()}
                  className="w-full max-w-xs text-center text-sm px-4 py-2 rounded-full bg-white/8 border border-white/15 text-paper outline-none"
                />
              </div>
            )}
          </motion.div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch"
          >
            <div className="flex h-13 rounded-full bg-white/6 border border-white/12 focus-within:border-brand/60 overflow-hidden w-full sm:w-96">
              <div className="relative flex items-center border-r border-white/10 shrink-0">
                <span className="pl-4 pr-1 text-[15px] pointer-events-none">
                  {flagOf(country.iso)}
                </span>
                <span className="pr-7 text-[14px] text-paper/80 pointer-events-none">
                  {country.dial}
                </span>
                <span className="absolute right-2.5 text-[9px] text-muted pointer-events-none">
                  ▼
                </span>
                <select
                  aria-label="Country code"
                  value={iso}
                  onChange={(e) => setIso(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.iso} value={c.iso}>
                      {flagOf(c.iso)} {c.name} ({c.dial})
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel-national"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Phone number"
                className="flex-1 min-w-0 px-4 bg-transparent text-paper placeholder:text-muted outline-none text-[15px]"
              />
            </div>
            <button
              type="submit"
              disabled={state === "busy"}
              className="h-13 px-8 rounded-full font-semibold text-ink text-[15px] tracking-wide bg-gradient-to-r from-brand to-brand-accent hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
            >
              {state === "busy" ? "Joining…" : "JOIN THE WAITLIST"}
            </button>
          </form>
        )}

        {state === "error" && (
          <p className="mt-4 text-sm text-rocky">
            That number didn&apos;t work — check it and try again.
          </p>
        )}

        {state !== "done" && (
          <p className="mt-6 text-sm text-muted">
            Founding members get early access. One text when it&apos;s your
            turn — never shared, never spam.
          </p>
        )}
      </motion.div>
    </section>
  );
}
