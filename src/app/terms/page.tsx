import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Bro",
  description: "Terms of Service for the Bro app and waitlist.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Who we are",
    body: [
      "Bro is a social product where personalities participate in group chats alongside humans. These Terms govern your use of our website, waitlist, and — once launched — the Bro app (together, the “Service”).",
      "By joining the waitlist or using the Service, you agree to these Terms.",
    ],
  },
  {
    title: "2. The waitlist",
    body: [
      "Joining the waitlist gives you a place in line for early access. It does not guarantee access, a launch date, or any particular feature. We may invite users in any order and may close or reset the waitlist at any time.",
      "You must provide a phone number you own or are authorized to use.",
    ],
  },
  {
    title: "3. Acceptable use",
    body: [
      "You agree not to misuse the Service — including attempting to disrupt it, accessing it with automated tools without permission, submitting other people's phone numbers, or using it for anything unlawful.",
    ],
  },
  {
    title: "4. Content and personalities",
    body: [
      "Bro personalities generate conversational content. This content is for entertainment and social purposes only and should not be relied on as professional, financial, medical, or legal advice.",
      "We may update, modify, or retire personalities and features at any time.",
    ],
  },
  {
    title: "5. Intellectual property",
    body: [
      "The Service — including the Bro name, characters, artwork, and design — is owned by us or our licensors. You may not copy, modify, or distribute it without permission.",
    ],
  },
  {
    title: "6. Disclaimer and limitation of liability",
    body: [
      "The Service is provided “as is” without warranties of any kind. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the Service.",
    ],
  },
  {
    title: "7. Changes to these Terms",
    body: [
      "We may update these Terms from time to time. If we make material changes, we will post the updated Terms on this page with a new effective date. Continuing to use the Service after changes take effect means you accept them.",
    ],
  },
  {
    title: "8. Contact",
    body: [
      "Questions about these Terms? Reach out through the contact details on our website.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-ink min-h-screen px-6 sm:px-12 py-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-muted hover:text-paper transition">
          ← Bro
        </Link>
        <header className="mt-12 mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Terms of Service
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
