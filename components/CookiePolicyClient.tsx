'use client';

import Link from "next/link";
import Icon from "./Icon";
import ThemeMenu from "./ThemeMenu";
import { useConsent } from "../context/ConsentContext";
import { ANALYTICS_CONFIGURED } from "../lib/consent";

// Not new Date().getFullYear() — see the comment in LandingClient.tsx.
const YEAR = 2026;

const h2 = { fontSize: "1.3rem", fontWeight: 700, color: "var(--lp-text)" } as const;
const p = { fontSize: "0.95rem", lineHeight: 1.7, color: "var(--lp-muted)" } as const;
const section = { display: "flex", flexDirection: "column", gap: "12px" } as const;

const ROWS: { name: string; purpose: string; kind: string; duration: string }[] = [
  { name: "theme", purpose: "Remembers your light / dark / system display choice, on this site and in the Broadcast app.", kind: "Essential", duration: "12 months" },
  { name: "cookie_consent", purpose: "Remembers the cookie choice you made, so we don't ask on every visit.", kind: "Essential", duration: "12 months" },
  { name: "broadcast.sharePromptDismissed, broadcast.sharePromptShown", purpose: "Browser storage that remembers you've seen (or asked not to see) the “tell a friend” reminder after downloading from our free tools.", kind: "Essential", duration: "Until cleared (session for the second)" },
  { name: "_ga, _ga_<ID>", purpose: "Google Analytics: tells us which pages are visited and how people find us, using anonymised data.", kind: "Analytics (only if you accept)", duration: "Up to 2 years" },
];

export default function CookiePolicyClient() {
  const { openSettings } = useConsent();

  return (
    <div className="lp">
      <div className="lp-glow-container">
        <div className="lp-glow lp-glow-1"></div>
        <div className="lp-glow lp-glow-2"></div>
      </div>

      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <Link href="/" className="lp-logo">
            <Icon /> Broadcast
          </Link>
          <div className="lp-nav-actions">
            <ThemeMenu />
            <Link href="/" className="lp-btn lp-btn-ghost">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <section className="lp-section">
        <div className="lp-section-inner" style={{ maxWidth: "800px" }}>
          <div className="lp-eyebrow">Cookies</div>
          <h1 className="lp-section-title" style={{ marginBottom: "8px" }}>Cookie Policy</h1>
          <p style={{ ...p, fontSize: "0.95rem", marginBottom: "40px" }}>Last Updated: November 2026</p>

          <div className="lp-feat-card" style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <p style={{ ...p, fontSize: "1rem", color: "var(--lp-text)" }}>
              This policy explains what cookies and similar technologies Broadcast (broadcast.com.ng and app.broadcast.com.ng)
              uses, why, and how you can control them. It sits alongside our{" "}
              <Link href="/privacy-policy" className="lp-csv-link">Privacy Policy</Link>.
            </p>

            <div style={section}>
              <h2 style={h2}>1. What are cookies?</h2>
              <p style={p}>
                Cookies are small text files a website stores in your browser. Similar technologies, such as the browser&apos;s
                local storage, do the same job. They let a site remember things between pages and visits.
              </p>
            </div>

            <div style={section}>
              <h2 style={h2}>2. What we use</h2>
              <div className="lp-cookie-table" role="table" aria-label="Cookies we use">
                <div className="lp-cookie-trow lp-cookie-thead" role="row">
                  <span role="columnheader">Name</span><span role="columnheader">Purpose</span><span role="columnheader">Type</span><span role="columnheader">Lasts</span>
                </div>
                {ROWS.map((r) => (
                  <div className="lp-cookie-trow" role="row" key={r.name}>
                    <code role="cell" data-label="Name">{r.name}</code>
                    <span role="cell" data-label="Purpose">{r.purpose}</span>
                    <span role="cell" data-label="Type">{r.kind}</span>
                    <span role="cell" data-label="Lasts">{r.duration}</span>
                  </div>
                ))}
              </div>
              <p style={p}>
                The <code>theme</code> and <code>cookie_consent</code> cookies are set on the parent domain
                (<code>.broadcast.com.ng</code>) so your choices carry between this site and the Broadcast app. We do not use
                advertising or cross-site tracking cookies.
              </p>
            </div>

            <div style={section}>
              <h2 style={h2}>3. Inside the Broadcast app</h2>
              <p style={p}>
                When you sign in to the app, your session token is kept in your browser&apos;s local storage so you stay signed in.
                This is strictly necessary for the app to work. We also use error monitoring to find and fix crashes; it
                processes technical details (such as the page and browser involved) and is not used for advertising.
              </p>
            </div>

            <div style={section}>
              <h2 style={h2}>4. Third-party services</h2>
              <p style={p}>
                Some features load from other providers, who may set their own cookies under their own policies: Paystack
                (when you pay for a subscription), Meta (when you connect WhatsApp through Meta&apos;s sign-in), and, only if you
                accept analytics, Google Analytics.
              </p>
            </div>

            <div style={section}>
              <h2 style={h2}>5. Your choices</h2>
              <p style={p}>
                Essential cookies can&apos;t be switched off because the site relies on them. Analytics cookies are off unless you
                accept them, and you can change your mind at any time.
                {ANALYTICS_CONFIGURED ? "" : " (We don't currently run analytics on this site, so there is nothing to switch on.)"}
              </p>
              {ANALYTICS_CONFIGURED && (
                <div>
                  <button type="button" className="lp-btn lp-btn-primary" onClick={openSettings}>
                    Manage cookie preferences
                  </button>
                </div>
              )}
              <p style={p}>
                You can also block or delete cookies in your browser settings; note that blocking essential cookies means your
                theme and cookie choice can&apos;t be remembered.
              </p>
            </div>

            <div style={section}>
              <h2 style={h2}>6. Changes and contact</h2>
              <p style={p}>
                If we change what we use, we&apos;ll update this page and, where required, ask for your choice again. Questions? Email{" "}
                <a href="mailto:info@broadcast.com.ng" className="lp-csv-link">info@broadcast.com.ng</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer" style={{ marginTop: "80px", borderTop: "1px solid var(--lp-border)" }}>
        <div className="lp-footer-bottom" style={{ border: "none" }}>
          © {YEAR} Broadcast. Built on Official Meta&apos;s Cloud API.
        </div>
      </footer>
    </div>
  );
}
