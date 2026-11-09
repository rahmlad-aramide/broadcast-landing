'use client';

import { use } from "react";
import { io } from "next/cache";
import Link from "next/link";
import Icon from "./Icon";
import ThemeMenu from "./ThemeMenu";

// Not new Date().getFullYear() — see the comment in LandingClient.tsx.
const YEAR = 2026;

export default function TermsOfServiceClient() {
  return (
    <div className="lp">
      <div className="lp-glow-container">
        <div className="lp-glow lp-glow-1"></div>
        <div className="lp-glow lp-glow-2"></div>
      </div>

      <nav className="lp-nav" style={{ position: "sticky", top: "20px" }}>
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
          <div className="lp-eyebrow">Terms of Service</div>
          <h1 className="lp-section-title" style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Terms of Service for Broadcast</h1>
          <p style={{ color: "var(--lp-muted)", fontSize: "0.95rem", marginBottom: "40px" }}>Last Updated: November 2026</p>

          <div className="lp-feat-card" style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "var(--lp-text)" }}>
              Welcome to Broadcast (accessible via <a href="https://broadcast.com.ng" className="lp-csv-link" target="_blank" rel="noopener noreferrer">https://broadcast.com.ng</a>, with the application itself hosted at app.broadcast.com.ng, or your dedicated organization subdomain if part of a custom deployment). By registering an account, integrating your Meta Business Suite, or using our multi-agent shared inbox, you agree to comply with and be bound by the following Terms of Service.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>1. Acceptance of Terms</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                By accessing or using Broadcast, you (referred to as &quot;Client&quot;, &quot;Organization&quot;, or &quot;User&quot;) agree to these Terms. If you are entering into these terms on behalf of an institution (such as a school, enterprise, or agency), you represent that you have the authority to bind that entity.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>2. Description of Service</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                Broadcast is a multi-tenant, cloud-hosted software layer that interfaces with the official Meta WhatsApp Cloud API. We provide an administrative dashboard, student/parent directory hosting, multi-agent shared inbox, and template campaign automation. Broadcast is not a WhatsApp Business Solution Provider (BSP) or Meta itself; we facilitate connection directly to your own Meta Cloud API credentials.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>3. Account Registration & Subdomains</h2>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                <li>
                  <strong style={{ color: "#fff" }}>Self-serve workspaces:</strong> operate on our shared application domain (app.broadcast.com.ng). A dedicated custom subdomain (e.g., yourname.broadcast.com.ng) is available only as part of a negotiated custom deployment, not on self-serve plans.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Credentials:</strong> You are responsible for safeguarding your login credentials. Any activity occurring under your account is your sole responsibility.
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>4. Direct Meta API Billing & Pay-As-You-Go Rates</h2>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                <li>
                  <strong style={{ color: "#fff" }}>Billing Separation:</strong> The subscription fee paid to Broadcast is strictly for software licensing, hosting, and dashboard tools. It does not include Meta&rsquo;s messaging delivery fees.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Meta Account Credentials:</strong> You must link your own payment card to your Meta Business Manager. Meta will bill you directly in accordance with their WhatsApp Business pricing sheets (Utility, Marketing, or Authentication rates).
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Service Interruption:</strong> Broadcast is not liable if your messaging campaigns are halted due to billing failures, card rejections, or account suspensions on Meta&rsquo;s platform.
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>5. Acceptable Use & WhatsApp Compliance</h2>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                <li>
                  <strong style={{ color: "#fff" }}>Opt-in Compliance:</strong> You agree that you have obtained explicit consent (opt-in) from every recipient (e.g., parents, guardians, customers) before sending business-initiated messages.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Prohibited Content:</strong> You may not use Broadcast to send spam, fraudulent invoices, malicious links, or any content violating the Meta WhatsApp Business Messaging Policy.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Account Suspension:</strong> If your account experiences high block rates or spam flags from Meta, we reserve the right to suspend your access to prevent degradation of our shared server infrastructure.
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>6. Service Availability & Limitation of Liability</h2>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                <li>
                  <strong style={{ color: "#fff" }}>Hosting:</strong> Broadcast is hosted on secure cloud infrastructure. While we target a 99.9% uptime, we do not guarantee uninterrupted access during scheduled maintenance windows or global Meta API outages.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Liability Cap:</strong> In no event shall Broadcast, its developers, or partners be liable for any indirect, incidental, or consequential damages (including loss of school data or business profit) exceeding the total amount paid by you to Broadcast in the three (3) months preceding the claim.
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>7. Account Deletion</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                You may request deletion of your account and associated data at any time via our{" "}
                <a href="https://app.broadcast.com.ng/delete-account" className="lp-csv-link" target="_blank" rel="noopener noreferrer">
                  Delete Account
                </a>{" "}
                page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer" style={{ marginTop: "80px" }}>
        <div className="lp-footer-bottom" style={{ border: "none" }}>
          © {YEAR} Broadcast. Built on Official Meta&apos;s Cloud API.
        </div>
      </footer>
    </div>
  );
}
