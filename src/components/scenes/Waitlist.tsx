"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">(
    "idle"
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
            You&apos;re in. 🎉 Watch your inbox.
          </motion.div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-13 px-5 rounded-full bg-white/6 border border-white/12 text-paper placeholder:text-muted outline-none focus:border-luna/60 w-full sm:w-80 text-[15px]"
            />
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
            Something went wrong — try again in a moment.
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
