import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 px-6 sm:px-12 py-12">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-start justify-between gap-10">
        <div>
          <div className="font-display font-bold text-xl tracking-tight">
            Bro
          </div>
          <p className="mt-2 text-sm text-muted max-w-xs">
            Personalities built for group chats. They don&apos;t replace
            conversations — they join them.
          </p>
          <p className="mt-3 text-sm text-paper/50">
            Built by a small team that lost too many group chats.
          </p>
        </div>

        <div className="flex gap-14">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted mb-3">
              Product
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  href="/#waitlist"
                  className="text-paper/70 hover:text-paper transition"
                >
                  Join the waitlist
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted mb-3">
              Contact
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-paper/70 hover:text-paper transition"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted mb-3">
              Legal
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-paper/70 hover:text-paper transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-paper/70 hover:text-paper transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-white/6 text-xs text-muted/70">
        © {new Date().getFullYear()} Bro. All rights reserved.
      </div>
    </footer>
  );
}
