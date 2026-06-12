import type { ThemeId } from "@/components/theme/Theme";

/**
 * Theme-flavored content for the two pre-showcase phone scenes.
 *
 * IMPORTANT: this file changes ONLY the words. Every timing, sender,
 * reaction slot, message kind (voice/meme), and the scene outcomes live
 * in Act1Problem.tsx / Act2Solution.tsx and are identical across themes.
 * One story, four social energies.
 *
 * Fixed senders per slot (do not vary by theme — preserves the avatar
 * choreography): Act 1 batch1 = Jay, Sam, you, Tara, Dev(voice),
 * Zoe(meme); batch2 = Sam, Jay, you, Tara, Dev, Zoe; revival = Sam,
 * Tara, Blaze(react), Dev, you, Zoe(react).
 */

export type Msg = { text: string; react?: string };

export type Act1Script = {
  group: string;
  b1ts: string;
  b1: {
    jay: string;
    sam: string;
    me: string;
    tara: Msg; // has reaction
    voiceDur: string;
    meme: { emoji: string; label: string; react: string };
  };
  b2: {
    sam: string;
    jay: string;
    me: string;
    tara: string;
    dev: string;
    zoe: Msg; // has reaction
  };
  slow: { t1: string; jay: string; sam: string; t2: string; tara: string };
  dead: { t1: string; jay: string };
  /** [emoji, bubble, bubble, emoji, bubble] — matches fixed positions */
  floating: [string, string, string, string, string];
  notes: [{ title: string; body: string }, { title: string; body: string }];
};

export type Act2Script = {
  group: string;
  /** The personality who revives THIS theme's group. Same story beat,
   *  different friend archetype walks in. */
  reviver: { name: string; color: string };
  deadTs: string;
  deadJay: string;
  opener: string;
  openerReact: string;
  jay: string;
  revival: {
    sam: string;
    tara: string;
    blaze: Msg; // the reviver's line — has reaction
    dev: string;
    me: string;
    zoe: Msg; // has reaction
  };
  floating: [string, string, string, string, string];
  notes: [{ title: string; body: string }, { title: string; body: string }];
};

/* ================================================================== */
/* ACT 1 — alive → slows → dies (outcome identical across themes)      */
/* ================================================================== */

export const ACT1: Record<ThemeId, Act1Script> = {
  night: {
    group: "the 2am crew 🌙",
    b1ts: "Tuesday 1:52 AM",
    b1: {
      jay: "anyone else still up or just me",
      sam: "define up",
      me: "work in 6 hrs and i'm wide awake 🙃",
      tara: { text: "this is why our sleep schedules are cooked", react: "😂 3" },
      voiceDur: "0:41",
      meme: { emoji: "🌙", label: "3am_brain.jpg", react: "💀 4" },
    },
    b2: {
      sam: "we used to do this every night in college",
      jay: "best years fr",
      me: "ok we need to actually call more",
      tara: "let's. this weekend? for real this time",
      dev: "i'm down",
      zoe: { text: "miss you idiots 🌙", react: "❤️ 4" },
    },
    slow: {
      t1: "5 days later",
      jay: "still up for that call?",
      sam: "ugh this week ate me alive, raincheck?",
      t2: "3 weeks later",
      tara: "we never did call huh",
    },
    dead: { t1: "2 months later", jay: "you all still awake out there?" },
    floating: ["🌙", "you up?", "remember college 😭", "💤", "we should call more"],
    notes: [
      { title: "2am used to mean something.", body: "The honest talks. The ones you only have when it's late." },
      { title: "Then sleep schedules won.", body: "And “you up?” stopped getting a reply." },
    ],
  },

  chaos: {
    group: "the chaos gc 💀",
    b1ts: "Friday 9:14 PM",
    b1: {
      jay: "WHO unmuted this i have 247 unread",
      sam: "scroll up. it's worth it.",
      me: "i was gone for ONE meeting",
      tara: { text: "we renamed the gc 6 times btw", react: "💀 5" },
      voiceDur: "0:03",
      meme: { emoji: "🤡", label: "cursed.png", react: "😭 8" },
    },
    b2: {
      sam: "WHY is dev sending 3 second voice notes",
      jay: "what did he even say",
      me: "play it 9 times it starts making sense",
      tara: "i'm wheezing 😭",
      dev: "it was important",
      zoe: { text: "this group needs a restraining order", react: "💀 6" },
    },
    slow: {
      t1: "4 days later",
      jay: "it's quiet. i don't like it",
      sam: "is everyone actually WORKING??",
      t2: "2 weeks later",
      tara: "gc really said 🦗",
    },
    dead: { t1: "1 month later", jay: "is this thing on 💀" },
    floating: ["💀💀", "WHO SENT THIS", "i'm wheezing 😭", "🤡", "play it 9 times"],
    notes: [
      { title: "It was never quiet.", body: "247 unread by lunch. Every single day." },
      { title: "Then it just… stopped.", body: "The memes dried up. The crickets moved in." },
    ],
  },

  wholesome: {
    group: "the besties 💛",
    b1ts: "Sunday 6:30 PM",
    b1: {
      jay: "reminder that you're all doing better than you think 💛",
      sam: "needed this today ngl",
      me: "ok who hurt jay, he's being nice",
      tara: { text: "let him be soft 😭", react: "💛 4" },
      voiceDur: "0:28",
      meme: { emoji: "🥹", label: "us_2019.jpg", react: "🥹 6" },
    },
    b2: {
      sam: "genuinely grateful for you guys",
      jay: "we should finally do that goa trip we keep talking about",
      me: "i'm in. been a rough month honestly",
      tara: "wait you good? 💛",
      dev: "we got you. always.",
      zoe: { text: "ok but goa for real this time 🥹", react: "❤️ 5" },
    },
    slow: {
      t1: "1 week later",
      jay: "still thinking about that dinner :)",
      sam: "yes!! just buried in work, soon?",
      t2: "3 weeks later",
      tara: "hope everyone's doing ok 💛",
    },
    dead: { t1: "2 months later", jay: "thinking of you all. still here if anyone needs" },
    floating: ["💛", "proud of you fr", "you ok? 🫶", "🥹", "we got you always"],
    notes: [
      { title: "This was the safe place.", body: "Where “rough day” always got a reply." },
      { title: "Then life got loud.", body: "And checking in quietly slipped away." },
    ],
  },

  roast: {
    group: "the roast pit 🔥",
    b1ts: "Saturday 8:21 PM",
    b1: {
      jay: "happy bday sam, our only friend with zero rizz",
      sam: "on MY birthday jay????",
      me: "he waited all year for this",
      tara: { text: "and he's not even wrong", react: "💀 6" },
      voiceDur: "0:19",
      meme: { emoji: "📸", label: "sam_2019.jpg", react: "😭 7" },
    },
    b2: {
      sam: "WHO kept that photo for 5 years",
      jay: "we have a folder",
      me: "it's backed up in 3 locations",
      tara: "for legal reasons that's a threat 😭",
      dev: "happy bday anyway loser ❤️",
      zoe: { text: "this group has no chill and i love it", react: "💀 5" },
    },
    slow: {
      t1: "5 days later",
      jay: "no one's roasted me in days. i feel safe. i hate it",
      sam: "good. suffer.",
      t2: "2 weeks later",
      tara: "the silence is weird",
    },
    dead: { t1: "1 month later", jay: "even the roasts stopped 💀" },
    floating: ["💀💀", "we have a FOLDER", "no rizz detected", "🔥", "sam_2019.jpg"],
    notes: [
      { title: "Nobody was safe here.", body: "Birthdays meant evidence. Every photo was a weapon." },
      { title: "Then the roasts went cold.", body: "Turns out you miss getting destroyed daily." },
    ],
  },
};

/* ================================================================== */
/* ACT 2 — dead → Blaze joins → revival (Blaze + reveal identical)     */
/* ================================================================== */

export const ACT2: Record<ThemeId, Act2Script> = {
  night: {
    group: "the 2am crew 🌙",
    reviver: { name: "Luna", color: "#8ea2ff" },
    deadTs: "2 months later",
    deadJay: "you all still awake out there?",
    opener:
      "okay but are we really pretending we don't know why those two stopped texting 👀 who's still up",
    openerReact: "👀 5   😭 3",
    jay: "ok i'm awake. explain. immediately.",
    revival: {
      sam: "luna you can NOT just drop that and go quiet",
      tara: "i need the full lore. now.",
      blaze: { text: "2am. everyone's a little too honest. drop the lore, i'll start 🌙", react: "🌙 6" },
      dev: "i'm in. spilling everything",
      me: "not the gc waking up at 1am for gossip 😭",
      zoe: { text: "missed this. missed you guys 🌙", react: "❤️ 5" },
    },
    floating: ["👀", "drop the lore", "wait WHAT", "🌙", "missed this fr"],
    notes: [
      { title: "Then someone showed up.", body: "At the exact hour the group used to be alive." },
      { title: "And it felt like 2am again.", body: "The good kind." },
    ],
  },

  chaos: {
    group: "the chaos gc 💀",
    reviver: { name: "Rocky", color: "#ff5c8a" },
    deadTs: "1 month later",
    deadJay: "is this thing on 💀",
    opener:
      "found this gc in the graveyard. unacceptable. starting a challenge — no one asked",
    openerReact: "💀 7   😂 4",
    jay: "LMAOOO who added this menace",
    revival: {
      sam: "oh it's OVER for our notifications",
      tara: "he already renamed the gc 😭",
      blaze: { text: "247 unread? rookie numbers. last to react buys coffee. GO", react: "🔥 9" },
      dev: "INNN",
      me: "i can feel the notifications already 💀",
      zoe: { text: "the chaos is BACK", react: "😂 7" },
    },
    floating: ["💀", "WHO ADDED HIM", "247? rookie numbers", "🔥🔥", "it's OVER for us"],
    notes: [
      { title: "Then chaos walked back in.", body: "Uninvited. Unhinged. Perfect." },
      { title: "And the notifications never stopped.", body: "The way it should be." },
    ],
  },

  wholesome: {
    group: "the besties 💛",
    reviver: { name: "Sunny", color: "#ffc24d" },
    deadTs: "2 months later",
    deadJay: "thinking of you all. still here if anyone needs",
    opener:
      "hey. group's been quiet, and quiet usually means someone's going through it. did everyone eat today? 💛",
    openerReact: "🥹 5   💛 4",
    jay: "ok i'm not crying you're crying",
    revival: {
      sam: "honestly? not a great week. but better seeing this",
      tara: "ok we are ACTUALLY doing the goa trip",
      // memory callback — Sunny remembers the Goa plan from earlier
      blaze: { text: "dinner saturday first. i'll text everyone the day-of so it doesn't become goa 2.0 💛", react: "💛 7" },
      dev: "i'll be there",
      me: "wait it remembered goa 🥹",
      zoe: { text: "the group's back. the real one", react: "❤️ 6" },
    },
    floating: ["🥹", "did you eat??", "goa for REAL this time", "💛", "missed this"],
    notes: [
      { title: "Then someone made space again.", body: "For the question nobody else was asking." },
      { title: "And the safe place came back.", body: "One “how are you really” at a time." },
    ],
  },

  roast: {
    group: "the roast pit 🔥",
    reviver: { name: "Blaze", color: "#bf8cff" },
    deadTs: "1 month later",
    deadJay: "even the roasts stopped 💀",
    opener:
      "scrolled the history. weak roasts, worse comebacks, and whatever sam's 2019 haircut was. this gc got soft while i was gone",
    openerReact: "💀 8   😂 5",
    jay: "LMAOOO not him opening with the 2019 haircut",
    revival: {
      sam: "i got added to my OWN roast group???",
      tara: "he did his research 😭 i'm scared",
      blaze: { text: "new rule: weakest comeback of the week buys lunch. sam, you're already losing", react: "🔥 9" },
      dev: "INNN this is the content i signed up for",
      me: "not the gc going feral again 😭",
      zoe: { text: "we're SO back", react: "💀 6" },
    },
    floating: ["💀", "WHO ADDED HIM", "not the 2019 haircut", "🔥🔥", "we're so back"],
    notes: [
      { title: "Then the heat came back.", body: "With receipts nobody asked for." },
      { title: "And no one was safe again.", body: "Exactly how they liked it." },
    ],
  },
};
