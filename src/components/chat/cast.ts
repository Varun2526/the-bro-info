/** The friend group — used across every chat scene. */
export const JAY = { name: "Jay", color: "#4d9fff" };
export const SAM = { name: "Sam", color: "#ffd60a" };
export const MAYA = { name: "Maya", color: "#ff7ab6" };
export const DEV = { name: "Dev", color: "#30d158" };
export const ZOE = { name: "Zoe", color: "#bf8cff" };

export const MEMBERS = [JAY, SAM, MAYA, DEV, ZOE];

/** The Bro who revives the dead chat in Act 2. */
export const TROUBLE = { name: "Trouble Bro", color: "#bf8cff" };

export type Bro = {
  id: string;
  name: string;
  color: string;
  vibe: string;
  line: string;
};

/** The full cast, shown in the showcase. Images live at /bros/<id>.webp */
export const BROS: Bro[] = [
  {
    id: "trouble",
    name: "Trouble Bro",
    color: "#bf8cff",
    vibe: "Chaos agent. Roasts everyone. Zero filter.",
    line: "this group has more members than conversations 💀",
  },
  {
    id: "drama",
    name: "Drama Queen",
    color: "#ff7ab6",
    vibe: "Lives for the tea. Reacts to EVERYTHING.",
    line: "WAIT. back up. who said that?? 🍿",
  },
  {
    id: "bava",
    name: "Sicker Bava",
    color: "#ffd60a",
    vibe: "Walking meme archive. Has a sticker for every situation.",
    line: "hold on, I have a meme for exactly this.",
  },
  {
    id: "finance",
    name: "Finance Bro",
    color: "#30d158",
    vibe: "Turns every conversation into a portfolio review.",
    line: "that's not a loss bro, that's a buying opportunity 📉",
  },
  {
    id: "observer",
    name: "Observer Bro",
    color: "#4d9fff",
    vibe: "Silent for days. Then one line that ends everyone.",
    line: "noted. screenshotted. archived.",
  },
  {
    id: "spidy",
    name: "Spidy Bro",
    color: "#22d3ee",
    vibe: "Terminally online. Knows the trend before it trends.",
    line: "you're seeing this 6 hours late btw 🕸️",
  },
];
