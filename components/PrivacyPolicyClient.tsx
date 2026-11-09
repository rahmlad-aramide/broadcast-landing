'use client';

import Link from "next/link";
import Icon from "./Icon";
import ThemeMenu from "./ThemeMenu";

// Not new Date().getFullYear() — see the comment in LandingClient.tsx.
const YEAR = 2026;

export default function PrivacyPolicyClient() {
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
          <div className="lp-eyebrow">Privacy</div>
          <h1 className="lp-section-title" style={{ marginBottom: "8px" }}>Privacy Policy for Broadcast</h1>
          <p style={{ color: "var(--lp-muted)", fontSize: "0.95rem", marginBottom: "40px" }}>Last Updated: November 2026</p>

          <div className="lp-feat-card" style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "var(--lp-text)" }}>
              At Broadcast (<a href="https://broadcast.com.ng" className="lp-csv-link" target="_blank" rel="noopener noreferrer">https://broadcast.com.ng</a>), we take data privacy seriously. This Privacy Policy explains how we collect, process, and secure personal data when you use our multi-tenant SaaS application, keeping fully in line with the Nigeria Data Protection Act (NDPA) and global privacy standards.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>1. Information We Collect</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                As a software provider, we act primarily as a Data Processor for the information you upload to your workspace.
              </p>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                <li>
                  <strong style={{ color: "#fff" }}>Account Information:</strong> Name of organization/school, administrative email, phone number, and physical billing address.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Recipient Directory (Your Data):</strong> Student names, parent names, class tiers, phone numbers, and transactional records (such as grade points or outstanding invoice balances) uploaded by your staff.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Chat Logs:</strong> Inbound and outbound text messages, PDFs (report cards, receipts), and media sent or received via the connected WhatsApp Cloud API.
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>2. How We Use the Data</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                We use the collected information solely to power the communication delivery tools inside your dashboard:
              </p>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                <li>Operating your workspace and account.</li>
                <li>Formatting and dynamically rendering your PDF report cards and invoices.</li>
                <li>Sending bulk API requests to Meta to deliver messages to parents&apos; devices.</li>
                <li>Providing real-time read, delivery, and click analytics inside your dashboard.</li>
              </ul>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                We do not sell, rent, or use your uploaded directory data or student lists to target ads or for any secondary commercial purposes.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>3. Data Storage & Local Protection (NDPA Compliance)</h2>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                <li>
                  <strong style={{ color: "#fff" }}>Encryption:</strong> All personal data, directory details, and chat logs are encrypted in transit via SSL/TLS and at rest on our secure cloud servers.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Multi-Tenancy Isolation:</strong> Your tenant data is logically isolated from other organizations using Broadcast. Your administrative staff are the only ones with query access to your student/parent database.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Data Retention:</strong> We retain your directory records as long as your subscription is active. Upon cancellation or non-renewal of your plan, your workspace data can be completely purged upon request.
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>4. Third-Party Data Sharing (Meta API)</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                To send messages, selected data components (such as parent phone numbers and text variables) are passed securely to the Meta Cloud API. Meta processes this information in accordance with the Meta Business Data Processing Terms. We do not share your private directory files or student academic grades with any third party other than the designated messaging gateway API.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>5. Your Rights as a Data Controller</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                You, as the organization or school, are the Data Controller. It is your responsibility to:
              </p>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                <li>Ensure parents have consented to have their phone numbers stored in your Broadcast database.</li>
                <li>Assist parents in updating, modifying, or removing their records from your dashboard directory when requested.</li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff" }}>6. Deleting Your Account</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" }}>
                You can request deletion of your account and associated data at any time. See our{" "}
                <a href="https://app.broadcast.com.ng/delete-account" className="lp-csv-link" target="_blank" rel="noopener noreferrer">
                  Delete Account
                </a>{" "}
                page for details on what gets removed and how to request it.
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
