import Act1Problem from "@/components/scenes/Act1Problem";

export default function Home() {
  return (
    <main className="bg-ink">
      {/* fixed wordmark */}
      <div className="fixed top-5 left-6 z-50 font-display font-bold text-lg tracking-tight">
        Bros
      </div>

      <Act1Problem />

      {/* Act 2 and beyond land here next */}
      <section className="h-screen" />
    </main>
  );
}
