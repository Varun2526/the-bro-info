# The Bro — Session Handoff

Last updated: 2026-06-13. Branch `main`, clean, pushed to
https://github.com/Varun2526/the-bro-info (latest commit `12d9b97`).

This is a cinematic, scroll-driven landing page for **Bro** — a social product
where personalities ("Bros") join your group chat. The whole site is one
scroll-told story: a group chat dies, a Bro revives it, then the product is
revealed. Primary goal = **waitlist conversions**; secondary = shareability.

---

## 1. Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build (run before declaring done)
npm run lint           # eslint
npx tsc --noEmit       # typecheck
```

- **Next.js 16.2.9** (App Router, `src/`), **React 19**, **TypeScript**,
  **Tailwind v4**, **Framer Motion 12**, **Lenis** (smooth scroll), **pg**
  (Postgres), **@vercel/analytics**. Node v25 locally.
- ⚠️ This is a newer Next.js than training data — read
  `node_modules/next/dist/docs/` before using unfamiliar APIs (per AGENTS.md).
- The project folder name has a space (`bro-info website`); the npm package is
  `bros-site`.

### Waitlist DB (Postgres)
- Local DB `bro_waitlist` on `:5432`; connection string in `.env.local`
  (`DATABASE_URL`). Table `waitlist (id, phone, created_at)` auto-creates on
  first write (see `src/lib/db.ts`). ~6 test rows currently.
- API: `src/app/api/waitlist/route.ts` — `POST` (insert phone, returns
  position), `GET` (returns count, optional `WAITLIST_BASE` offset).

---

## 2. Verification — READ THIS

**The preview tab is frequently backgrounded, which throttles
requestAnimationFrame (~2 ticks/sec).** When that happens, scroll-driven
Framer MotionValues freeze and screenshots show stale/empty frames, and
`getComputedStyle(...).opacity` reads are unreliable. This bit us repeatedly.

How to verify reliably:
- **Content/structure:** read `document.body.textContent` / query the DOM via
  `preview_eval` — this is authoritative.
- **Scroll math:** reason about / compute the `ramp`/pacing functions directly
  (they're pure). Don't trust frozen opacity reads.
- **Drive scroll** with `window.__lenis.scrollTo(px, { immediate: true })`
  (dev exposes Lenis on `window.__lenis`).
- Check `document.visibilityState` — if `hidden`, screenshots are stale; fall
  back to DOM/math checks and tell the user to feel-test in a real browser.
- Turbopack sometimes serves **stale `globals.css`** after edits — if CSS
  changes don't show, kill the dev server and `rm -rf .next/dev`.

Always run `npm run build` + `npx tsc --noEmit` + `npm run lint` before
claiming done.

---

## 3. Story structure (LOCKED — do not reorder/add/remove sections)

Assembled in `src/app/page.tsx`:

1. **Act 1** `scenes/Act1Problem.tsx` — group chat alive → slows → dies
   ("Seen by 8"). Pinned scrub scene.
2. **Act 2** `scenes/Act2Solution.tsx` — a Bro joins, group revives,
   **"Meet Bro."** reveal. Pinned scrub scene.
3. **Bros Showcase** `scenes/BrosShowcase.tsx` — horizontal card rail, 6
   characters, hover/tap → the Bro replies. Pinned.
4. **The Big Idea** `scenes/BigIdea.tsx` — friend/Bro micro-convo + 3
   statements. Pinned.
5. **Imagine your group** `scenes/Act3Scenarios.tsx` — 3 scenario vignettes
   (in-view reveals, not pinned).
6. **Creator moment** `scenes/CreatorMoment.tsx` — one aspirational beat.
7. **Vision** `scenes/Vision.tsx` — constellation of group chats + closing
   statements. Pinned.
8. **Waitlist** `scenes/Waitlist.tsx` — phone-number capture + share moment.
9. **Footer** `components/Footer.tsx`.

Fixed UI: wordmark (top-left), "Join waitlist" chip (top-right),
`ScrollProgress` bar, `StickyCta` (mobile), theme switcher (right edge,
desktop), `Atmosphere` (background).

---

## 4. How the scroll engine works (`components/scroll/Scrub.tsx`)

- `PinnedScene` — a tall track (`height` mobile / `heightDesktop`) with a
  `sticky h-dvh` stage; passes scroll progress `p` (0→1) to a render-prop child.
- `ramp(v, inputKnots, outputKnots)` — clamped piecewise-linear interp. **All**
  scroll bindings go through this (function transforms), NOT array-form
  `useTransform` — array form compiles to a WAAPI ViewTimeline whose range
  doesn't match our offsets and reads wrong progress. Don't "simplify" it back.
- `useRamp(p, input, output)` — the hook form.
- `Beat` — fades/slides a child in at story position `at` (`at < 0` = visible
  from the start). `Layer` — shows a group during `[enter, exit]`. `Statement`
  — big display text; `dramatic` adds blur-to-sharp. `SideNote` — desktop-only
  caption beside the phone. `FloatingNote`/`NoteBubble` — desktop reactions
  drifting in the side space.
- **Scroll pacing** (`usePacedProgress` / `buildPaceKnots`): remaps scroll
  POSITION → story progress with flat "dwell bands" at narrative checkpoints so
  key beats can't blur past on a fast flick. **Must stay a pure function of
  position — never spring/time-lag story progress on pinned scenes** (native
  scroll drives pin/unpin, so a lagging story lets a fling scroll the scene
  off-screen before its ending plays = "I missed something"). Act 1 holds
  `[0.13, 0.33, 0.5, 0.645]`, Act 2 `[0.08, 0.27, 0.55, 0.85]`. Verified
  monotonic and reaches exactly 1.0 at scroll end.
- `isDesktopViewport()` — live `innerWidth >= 1024` check used to gate
  desktop-only choreography (phone drift/lean, floating notes).

Act 1 / Act 2 phone choreography (drift, zoom, lean, entrance) is in their
Stage components, driven by the paced `p`. Mobile keeps `x:0` (untouched).

---

## 5. The cast & the theme system

### Friend group (`components/chat/cast.ts`)
`JAY, SAM, TARA, DEV, ZOE` (+ "me"). `TARA` was renamed from "Maya" so the
drama Bro could be "Maya" without colliding — **do not reintroduce a friend
named Maya.**

### Showcase Bros (`BROS` in `cast.ts`) — SINGLE SOURCE OF TRUTH for names
6 image characters: **Blaze** (trouble), **Maya** (drama), **Kai** (bava),
**Rex** (finance), **Echo** (observer), **Zayn** (spidy). Each has
`id, name, color, vibe, line, reply`. Images at `public/bros/<id>.webp`.
Act 2's reviver and Act 3's scenario names read from here — never hardcode Bro
names in scenes. `bro(id)` looks one up.

### Themes (`components/theme/Theme.tsx` + `globals.css`)
4 atmospheres as CSS vars on `html[data-theme]`: 🌙 `night` (default), 😂
`chaos`, ✨ `wholesome`, 🔥 `roast`. `ThemeProvider` wraps the page;
`Atmosphere` renders the background (drifting glows + per-theme particles,
650ms crossfade); `ThemeSwitcher` is the right-edge glass pill (desktop,
localStorage key `bro-theme`). `useTheme()` exposes the active theme.
Scene stage-lights use `var(--stage-tint)` / `var(--stage-strong)` — don't
hardcode rgba glows.

### Per-theme chat content (`components/scenes/chatScripts.ts`)
`ACT1[theme]` and `ACT2[theme]` hold **only the words** (messages, reactions,
group name, transition labels, floating notes, side captions, and — for Act 2
— the `reviver`). Every timing, sender, message kind (voice/meme), reaction
slot, and scene outcome lives in the Act components and is **identical across
themes**. One story, four social energies. Theme also picks **who revives the
group**: 🔥 Blaze, 😂 Rocky, 🌙 Luna, ✨ Sunny (name + color in
`ACT2[theme].reviver`).

`BroBadge` (`components/chat/ChatBubble.tsx`) is the `[BRO]` category pill —
shown on showcase cards, the reviver's bubbles, and scenario Bro lines. Never
use "AI/bot/assistant/agent" in user-facing copy.

---

## 6. Generated assets (don't hand-edit; re-run the script)
- `node scripts/process-bros.mjs` — turns the raw art in `art-src/`
  (gitignored) into `public/bros/*.webp` (background keyed out, waist-up crops).
- `node scripts/make-og.mjs` — regenerates `public/og.png` (social card) and
  `src/app/icon.png` / `apple-icon.png` (favicons) from cast art + brand tokens.
  Re-run after art/brand changes.

---

## 7. Open items / next steps

**Known tension to resolve (flagged, left as-is):** the 4 theme-revivers
(Blaze/Rocky/Luna/Sunny) are NOT the same as the 6 locked showcase cards
(only Blaze overlaps). On non-roast themes the reviver isn't in "Meet the
Bros." User locked both, so it's unreconciled. Options if revisited: (a) make
the showcase lead card reflect the active theme's reviver, or (b) add
Rocky/Luna/Sunny to the showcase roster. Needs a product call.

**Before going live:**
- Set `NEXT_PUBLIC_SITE_URL` to the real domain (makes `og:image` absolute).
- Swap `DATABASE_URL` for a hosted Postgres (Neon/Supabase) — the local DB
  won't exist in prod; `.data/` JSON store is gone.
- Replace contact email `bhanu@extendime.com` in `src/lib/site.ts` with a real
  brand inbox (used in footer + legal pages).
- Optionally seed `WAITLIST_BASE` for the founding-member counter.
- Legal pages (`/terms`, `/privacy`) are plain-language placeholders — get a
  real review.
- Deploy target is Vercel (analytics auto-activates there).

**Possible future polish (not started):** tablet layout (768–1023px is still
mostly the mobile config), referral position-jumping (ref codes in Postgres),
per-theme phone wallpapers, share-card preview in the waitlist success state.

**Feel-test the things math can't confirm:** scroll pacing dwell timing on a
real trackpad + mouse wheel; the four themes' atmospheres and reviver moments;
the desktop phone choreography. Dwell is one number (`dwell` in
`usePacedProgress`, default 0.06) or any checkpoint in the `ACT1_HOLDS`/
`ACT2_HOLDS` arrays.

---

## 8. Conventions
- Match surrounding code style. Comments explain *why*, not *what*.
- Two lint rules bit us: `react-hooks/set-state-in-effect` (wrap deferred
  `setState` in a `setTimeout(…, 0)` inside the effect) and
  `react-hooks/immutability` (don't write to refs/globals during render).
- BSD `sed` (macOS) has no `\b` word boundaries — use plain patterns.
- Commit messages end with the Co-Authored-By trailer; commit/push only the
  finished, verified work.
