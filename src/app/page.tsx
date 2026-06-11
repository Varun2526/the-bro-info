import Act1Problem from "@/components/scenes/Act1Problem";
import Act2Solution from "@/components/scenes/Act2Solution";

export default function Home() {
  return (
    <main className="bg-ink">
      {/* fixed wordmark */}
      <div className="fixed top-5 left-6 z-50 font-display font-bold text-lg tracking-tight">
        Bros
      </div>

      <Act1Problem />
      <Act2Solution />

      {/* Bros showcase and beyond land here next */}
      <section className="h-screen" />
    </main>
  );
}
