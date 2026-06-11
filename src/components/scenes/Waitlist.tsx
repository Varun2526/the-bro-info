"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { COUNTRIES, flagOf } from "./countries";

export default function Waitlist() {
  const [iso, setIso] = useState("IN");
  const [number, setNumber] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">(
    "idle"
  );

  const country = COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];

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
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section
      id="waitlist"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      {/* soft brand glow behind the CTA */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 55%, rgba(191,140,255,0.13), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative max-w-3xl"
      >
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-balance">
          The next generation of group chats starts here.
        </h2>
        <p className="mt-5 text-lg sm:text-xl text-paper/60">
          Be among the first to invite a Bro.
        </p>

        {state === "done" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 text-xl sm:text-2xl font-display font-semibold text-coach"
          >
            You&apos;re in. 🎉 We&apos;ll text you when it&apos;s time.
          </motion.div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch"
          >
            <div className="flex h-13 rounded-full bg-white/6 border border-white/12 focus-within:border-luna/60 overflow-hidden w-full sm:w-96">
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
              className="h-13 px-8 rounded-full font-semibold text-ink text-[15px] tracking-wide bg-gradient-to-r from-luna to-[#ff7ab6] hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
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

        <p className="mt-6 text-sm text-muted">
          Founding members get early access.
        </p>
      </motion.div>

      <footer className="absolute bottom-6 text-xs text-muted/70">
        Bros — every group chat deserves one.
      </footer>
    </section>
  );
}
