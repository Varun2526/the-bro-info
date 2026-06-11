import { ReactNode } from "react";

export type Sender = { name: string; color: string };

export function Avatar({ sender }: { sender: Sender }) {
  return (
    <div
      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold text-ink"
      style={{ background: sender.color }}
    >
      {sender.name[0]}
    </div>
  );
}

export function ChatBubble({
  sender,
  me = false,
  reactions,
  children,
}: {
  sender?: Sender;
  me?: boolean;
  reactions?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex items-end gap-1.5 ${me ? "justify-end" : "justify-start"} ${reactions ? "mb-4" : ""}`}
    >
      {!me && sender && <Avatar sender={sender} />}
      <div className="max-w-[75%]">
        {!me && sender && (
          <div
            className="text-[10px] font-semibold mb-0.5 ml-1"
            style={{ color: sender.color }}
          >
            {sender.name}
          </div>
        )}
        <div
          className={`relative px-3 py-1.5 text-[13.5px] leading-snug rounded-2xl ${
            me
              ? "bg-nova text-white rounded-br-md"
              : "bg-white/9 text-paper rounded-bl-md"
          }`}
        >
          {children}
          {reactions && (
            <div className="absolute -bottom-3.5 right-1 px-1.5 py-px rounded-full bg-[#222226] border border-white/10 text-[10px] tracking-tight">
              {reactions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VoiceNote({ duration = "0:12" }: { duration?: string }) {
  const bars = [5, 9, 13, 8, 14, 6, 11, 15, 7, 12, 5, 9, 13, 6];
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[8px]">
        ▶
      </div>
      <div className="flex items-center gap-[2px] h-4">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[2.5px] rounded-full bg-white/60"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
      <span className="text-[10px] text-white/50">{duration}</span>
    </div>
  );
}

export function MemeBubble({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="w-36 h-24 -mx-1 -my-0.5 rounded-xl bg-gradient-to-br from-white/12 to-white/4 flex flex-col items-center justify-center gap-1">
      <span className="text-3xl">{emoji}</span>
      <span className="text-[10px] text-white/40">{label}</span>
    </div>
  );
}

export function Timestamp({ children }: { children: ReactNode }) {
  return (
    <div className="text-center text-[10.5px] text-muted/80 font-medium py-1.5">
      {children}
    </div>
  );
}

export function SystemNote({ children }: { children: ReactNode }) {
  return (
    <div className="text-center text-[11px] text-paper/60 py-1.5">
      {children}
    </div>
  );
}
