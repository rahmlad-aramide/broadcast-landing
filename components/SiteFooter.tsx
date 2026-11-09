'use client';

import Link from "next/link";

import Icon from "./Icon";
import { TOOLS } from "../lib/toolsList";
import { useConsent } from "../context/ConsentContext";
import { ANALYTICS_CONFIGURED } from "../lib/consent";

// Not new Date().getFullYear() — see the comment in LandingClient.tsx.
const YEAR = 2026;

// Shared by the landing page and the tool pages. Section links are anchors on the home page,
// so from any other page they must point at "/#section" instead.
export default function SiteFooter({ onHome = false }: { onHome?: boolean }) {
  const { openSettings } = useConsent();
  // A function returning elements (not a component defined in render, which would remount each time).
  const sectionLink = (id: string, label: string) =>
    onHome ? <a href={`#${id}`}>{label}</a> : <Link href={`/#${id}`}>{label}</Link>;

  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          {onHome ? (
            <a href="#top" className="lp-logo"><Icon /> Broadcast</a>
          ) : (
            <Link href="/" className="lp-logo"><Icon /> Broadcast</Link>
          )}
          <p>
            The WhatsApp broadcasting platform built for businesses that need
            to reach their audience at scale — without the middleman markup.
          </p>
        </div>
        <div className="lp-footer-cols">
          <div className="lp-footer-col">
            <strong>Product</strong>
            {sectionLink("features", "Features")}
            {sectionLink("how", "How it works")}
            {sectionLink("pricing", "Pricing")}
            {sectionLink("faq", "FAQ")}
            {sectionLink("setup", "Custom setup")}
            <Link href="/setup-guide">Setup Guide</Link>
            {sectionLink("contact", "Contact")}
          </div>
          <div className="lp-footer-col">
            <strong>Tools</strong>
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href}>{t.footerLabel}</Link>
            ))}
            <Link href="/tools">All free tools</Link>
          </div>
          <div className="lp-footer-col">
            <strong>Legal</strong>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
            {ANALYTICS_CONFIGURED && (
              <button type="button" className="lp-footer-link-btn" onClick={openSettings}>Cookie Settings</button>
            )}
          </div>
        </div>
      </div>
      <div className="lp-footer-bottom">
        © {YEAR} Broadcast. Built on Official Meta&apos;s Cloud API. Powered by &nbsp;
        <a className="lp-csv-link" style={{ opacity: 0.7 }} href="http://rahmlad.com" target="_blank" rel="noopener noreferrer">
          Rahmlad Solutions
        </a>
      </div>
    </footer>
  );
}
