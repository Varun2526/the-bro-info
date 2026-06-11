import { ReactNode } from "react";

type Member = { name: string; color: string };

export default function PhoneFrame({
  groupName,
  members,
  memberCount,
  children,
}: {
  groupName: string;
  members: Member[];
  memberCount?: number;
  children: ReactNode;
}) {
  return (
    <div className="relative w-[min(92vw,390px)] h-[min(80svh,760px)] rounded-[2.8rem] border border-white/12 bg-[#111113] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
      {/* status bar + notch */}
      <div className="relative flex items-center justify-between px-7 pt-3 pb-1 text-[11px] font-medium text-paper/80">
        <span>9:41</span>
        <div className="absolute left-1/2 top-2 -translate-x-1/2 w-24 h-6 rounded-full bg-black" />
        <span className="tracking-tight">●●●</span>
      </div>

      {/* chat header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/8">
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((m) => (
            <div
              key={m.name}
              className="w-7 h-7 rounded-full ring-2 ring-[#111113] flex items-center justify-center text-[10px] font-bold text-ink"
              style={{ background: m.color }}
            >
              {m.name[0]}
            </div>
          ))}
        </div>
        <div className="leading-tight">
          <div className="text-[14px] font-semibold">{groupName}</div>
          <div className="text-[11px] text-muted">
            {memberCount ?? members.length} members
          </div>
        </div>
      </div>

      {/* messages area */}
      <div className="relative flex-1 overflow-hidden px-3">{children}</div>

      {/* input bar */}
      <div className="px-3 pb-4 pt-2">
        <div className="h-9 rounded-full bg-white/6 border border-white/8 flex items-center px-4 text-[13px] text-muted">
          Message…
        </div>
      </div>
    </div>
  );
}
