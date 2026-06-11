import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Bro",
  description: "How Bro collects, uses, and protects your information.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. What we collect",
    body: [
      "Waitlist: when you join, we collect your phone number and the time you signed up.",
      "Website: we may collect basic technical information (such as device type and approximate region) to keep the site fast and secure. We do not sell your personal information.",
    ],
  },
  {
    title: "2. How we use it",
    body: [
      "We use your phone number to contact you about early access and launch updates for Bro, and to manage your place on the waitlist.",
      "We will not spam you, and we will not share your number with third parties for their marketing.",
    ],
  },
  {
    title: "3. Where it's stored",
    body: [
      "Waitlist data is stored in our database with access limited to the Bro team. We use industry-standard safeguards to protect it.",
    ],
  },
  {
    title: "4. How long we keep it",
    body: [
      "We keep waitlist information until the waitlist ends or you ask us to remove you, whichever comes first.",
    ],
  },
  {
    title: "5. Your rights",
    body: [
      "You can ask us to delete your number from the waitlist at any time, and we'll do it. Depending on where you live, you may have additional rights (such as access or correction) under local law.",
    ],
  },
  {
    title: "6. Children",
    body: [
      "The Service is not directed at children under 13 (or the minimum age in your country), and we do not knowingly collect their information.",
    ],
  },
  {
    title: "7. Changes to this policy",
    body: [
      "If we change this policy, we'll post the updated version here with a new effective date.",
    ],
  },
  {
    title: "8. Contact",
    body: [
      "Privacy questions or deletion requests? Reach out through the contact details on our website.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-ink min-h-screen px-6 sm:px-12 py-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-muted hover:text-paper transition">
          ← Bro
        </Link>
        <header className="mt-12 mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted">Effective: June 2026</p>
        </header>
        <div className="flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-semibold tracking-tight mb-3">
                {s.title}
              </h2>
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="text-paper/65 leading-relaxed mb-2 text-[15px]"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
