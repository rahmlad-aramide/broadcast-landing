'use client';

import {
  Megaphone,
  FileText,
  FileEdit,
  BarChart2,
  Users,
  Clock,
  Receipt,
  Package,
  Rocket,
  GraduationCap,
  CalendarDays,
  Gift,
  Send,
  Check,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Sun,
  Moon,
  ArrowDown,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";

import Icon from "./Icon";
import { useTheme } from "../context/ThemeContext";
import { APP_URL, signupCustomer } from "../lib/api";

interface PhonePreview {
  headerType: "document" | "image" | "none";
  headerName?: string;
  body: ReactNode;
  footer?: string;
  buttons?: string[];
}

const FEATURES = [
  {
    icon: <Megaphone size={22} />,
    title: "Bulk Broadcasting",
    desc: "Reach thousands of opted-in contacts in a single campaign. Messages are queued and dispatched with intelligent rate control.",
  },
  {
    icon: <FileText size={22} />,
    title: "Per-Contact Documents",
    desc: "Send a unique PDF, invoice, or image to each recipient. Add a document_url column to your CSV — we handle the rest automatically.",
  },
  {
    icon: <FileEdit size={22} />,
    title: "Template Manager",
    desc: "Create and manage Meta-approved message templates complete with text headers, media, footer text, and quick-reply buttons.",
  },
  {
    icon: <BarChart2 size={22} />,
    title: "Real-Time Analytics",
    desc: "Track sent, delivered, and read counts per campaign. Drill into per-contact message logs for full visibility and debugging.",
  },
  {
    icon: <Users size={22} />,
    title: "Contact Management",
    desc: "Import contacts via CSV, segment with tags, and manage opt-in/opt-out status — all from one organised contact list.",
  },
  {
    icon: <Clock size={22} />,
    title: "Scheduled Campaigns",
    desc: "Set your campaign to fire at exactly the right moment. Schedule days or weeks in advance and let it run on autopilot.",
  },
];

const USE_CASES: { id: string; icon: ReactNode; label: string; phonePreview: PhonePreview }[] = [
  {
    id: "invoice",
    icon: <Receipt size={18} />,
    label: "Invoice Delivery",
    phonePreview: {
      headerType: "document",
      headerName: "Invoice_INV-2026-089.pdf",
      body: (
        <>
          Hello <strong>Rahmlad</strong>,<br />
          <br />
          Your invoice for July 2026 services is ready. Please find the attached
          PDF.
          <br />
          <br />
          <strong>Amount Due:</strong> $150.00
          <br />
          <strong>Due Date:</strong> 25th July
        </>
      ),
      footer: "Reply STOP to unsubscribe",
      buttons: ["View Invoice", "Pay Now"],
    },
  },
  {
    id: "order",
    icon: <Package size={18} />,
    label: "Order Confirmations",
    phonePreview: {
      headerType: "image",
      headerName: "📦 Delivery Details",
      body: (
        <>
          Hi <strong>Sarah</strong>!<br />
          <br />
          Your order <strong>#WA-88092</strong> has been dispatched. 🚚
          <br />
          <br />
          You can track your shipment in real time using the button below.
        </>
      ),
      footer: "Thank you for shopping with us!",
      buttons: ["Track Package", "Support"],
    },
  },
  {
    id: "launch",
    icon: <Rocket size={18} />,
    label: "Product Launches",
    phonePreview: {
      headerType: "image",
      headerName: "✨ Broadcast 2.0",
      body: (
        <>
          Hey team!
          <br />
          <br />
          We just launched <strong>Broadcast 2.0</strong> with Bento layouts and
          interactive WhatsApp previews. 🎉
          <br />
          <br />
          Be the first to check it out!
        </>
      ),
      footer: "Power up your outreach",
      buttons: ["Open Dashboard", "Read Blog"],
    },
  },
  {
    id: "onboard",
    icon: <GraduationCap size={18} />,
    label: "Customer Onboarding",
    phonePreview: {
      headerType: "none",
      body: (
        <>
          Welcome to Broadcast, <strong>David</strong>!<br />
          <br />
          Let&apos;s get your business connected. Here are 3 quick steps to send your
          first message broadcast.
          <br />
          <br />
          We&apos;re excited to have you on board!
        </>
      ),
      footer: "Need help? Reply HELP",
      buttons: ["Watch Tutorial", "Skip"],
    },
  },
  {
    id: "reminder",
    icon: <CalendarDays size={18} />,
    label: "Appointment Reminders",
    phonePreview: {
      headerType: "none",
      body: (
        <>
          Hi <strong>Dr. Lisa</strong>,<br />
          <br />
          This is a reminder for your upcoming dentist appointment tomorrow at{" "}
          <strong>10:00 AM</strong>.<br />
          <br />
          Please confirm if you&apos;ll be attending.
        </>
      ),
      footer: "Reply to reschedule",
      buttons: ["Confirm", "Reschedule"],
    },
  },
  {
    id: "promo",
    icon: <Gift size={18} />,
    label: "Promotional Campaigns",
    phonePreview: {
      headerType: "image",
      headerName: "🔥 Weekend Sale",
      body: (
        <>
          🔥 <strong>WEEKEND FLASH SALE</strong> 🔥
          <br />
          <br />
          Get <strong>30% OFF</strong> all plans this weekend only. Use code{" "}
          <strong>FLASH30</strong> at checkout.
        </>
      ),
      footer: "Offer expires in 48 hours",
      buttons: ["Claim Discount"],
    },
  },
];

const FAQS = [
  {
    q: "Do I need a Meta Business account?",
    a: "Yes. You'll need a Meta Business Manager account with the WhatsApp Business API (Cloud API) enabled. We connect directly to Meta's official API — no third-party intermediaries, no markup fees.",
  },
  {
    q: "Can each contact receive a different document?",
    a: 'Absolutely. Add any column (e.g. document_url) to your CSV when importing contacts. When creating a campaign with a media template, enter that column name in the "Per-contact document field" and each recipient automatically gets their own file.',
  },
  {
    q: "What file types can I send?",
    a: "PDFs, DOCX files, images (JPEG / PNG / WebP), and videos — either uploaded directly to Meta's media servers during template creation, or served from a publicly accessible URL stored in a contact field.",
  },
  {
    q: "Is there a limit on how many messages I can send?",
    a: "Message tier limits are set by Meta based on your account's sending history (starting at 1,000/day for new accounts). Our queue processes messages with smart delays to stay within your allowed rate and automatically retries on transient failures.",
  },
  {
    q: "How do I import my contact list?",
    a: 'Go to the Contacts page and click "Import CSV". Your file needs at minimum a phone column with the full country code (e.g. 2348012345678). Any extra columns are saved as custom fields and available for campaign personalisation.',
  },
];

export default function LandingClient() {
  // Not new Date().getFullYear() — Cache Components treats any Date read during
  // render as "impure" and either errors or forces the whole route dynamic
  // (via io()), which defeats the point of this being a static marketing page.
  // A copyright year doesn't need per-request freshness; bump it annually.
  const year = 2026;
  const { theme, toggleTheme } = useTheme();
  const [activeUseCaseIdx, setActiveUseCaseIdx] = useState(0);
  const activePreview = USE_CASES[activeUseCaseIdx].phonePreview;

  // Custom setup lead-capture modal state
  const [showSignup, setShowSignup] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupMessage, setSignupMessage] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail) return;
    setSignupLoading(true);
    try {
      const res = await signupCustomer({
        name: signupName,
        email: signupEmail,
        companyName: signupCompany,
      });
      setSignupMessage(res.message);
      setSignupSuccess(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup request failed. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
    setSignupName("");
    setSignupEmail("");
    setSignupCompany("");
    setSignupSuccess(false);
    setSignupMessage("");
  };

  return (
    <div className="lp">
      <div className="lp-glow-container">
        <div className="lp-glow lp-glow-1"></div>
        <div className="lp-glow lp-glow-2"></div>
      </div>

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <a href="#top" className="lp-logo">
            <Icon height={30} /> Broadcast
          </a>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="lp-nav-actions">
            <a href="#setup" className="lp-nav-link-text">
              Request Setup
            </a>
            <button
              onClick={toggleTheme}
              className="lp-theme-toggle"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href={`${APP_URL}/signup`} className="lp-btn lp-btn-primary">
              Get Started <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero" id="top">
        <div className="lp-hero-inner">
          <div className="lp-pill">✦ Built on Meta&apos;s Official API</div>
          <h1>
            WhatsApp Broadcasting,{" "}
            <span className="lp-accent">Simplified.</span>
          </h1>
          <p className="lp-hero-sub">
            Send personalised messages, invoices, and documents to thousands of
            contacts — all from one clean dashboard. No markup fees.
          </p>
          <div className="lp-hero-ctas">
            <a
              href={`${APP_URL}/signup`}
              className="lp-btn lp-btn-primary lp-btn-lg"
            >
              Get Started <ArrowRight size={18} />
            </a>
            <a href="#how" className="lp-btn lp-btn-ghost lp-btn-lg">
              See how it works <ArrowDown size={18} />
            </a>
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="lp-mockup-wrapper">
          <div className="lp-mockup">
            <div className="lp-mockup-bar">
              <span className="lp-mockup-dot" />
              <span className="lp-mockup-dot" />
              <span className="lp-mockup-dot" />
              <span className="lp-mockup-title">Campaigns</span>
            </div>

            <div className="lp-mockup-card">
              <div className="lp-mockup-card-top">
                <span className="lp-mockup-card-name">July Promo Blast</span>
                <span className="lp-mkbadge lp-mkbadge-green">RUNNING</span>
              </div>
              <div className="lp-mockup-stats">
                <div>
                  <div className="lp-mk-val">4,821</div>
                  <div className="lp-mk-lbl">Sent</div>
                </div>
                <div>
                  <div className="lp-mk-val">4,709</div>
                  <div className="lp-mk-lbl">Delivered</div>
                </div>
                <div>
                  <div className="lp-mk-val">3,204</div>
                  <div className="lp-mk-lbl">Read</div>
                </div>
              </div>
            </div>

            <div className="lp-mockup-row">
              <span>Invoice Delivery</span>
              <span className="lp-mkbadge lp-mkbadge-gray">DONE</span>
            </div>
            <div className="lp-mockup-row">
              <span>Onboarding Series</span>
              <span className="lp-mkbadge lp-mkbadge-blue">SCHEDULED</span>
            </div>
            <div className="lp-mockup-row">
              <span>Flash Sale Alert</span>
              <span className="lp-mkbadge lp-mkbadge-gray">DRAFT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="lp-stats-bar">
        <div className="lp-stat-cell">
          <strong>0%</strong>
          <span>Markup on Meta fees</span>
        </div>
        <div className="lp-stat-cell">
          <strong>98%</strong>
          <span>Average delivery rate</span>
        </div>
        <div className="lp-stat-cell">
          <strong>5 min</strong>
          <span>To send your first campaign</span>
        </div>
        <div className="lp-stat-cell">
          <strong>1-click</strong>
          <span>CSV contact import</span>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="lp-section" id="features">
        <div className="lp-section-inner">
          <div className="lp-eyebrow">Features</div>
          <h2 className="lp-section-title">
            Everything you need to run WhatsApp campaigns
          </h2>
          <p className="lp-section-sub">
            From CSV import to per-contact document delivery — the full toolkit
            in one place.
          </p>
          <div className="lp-features-grid">
            {FEATURES.map((f) => (
              <div className="lp-feat-card" key={f.title}>
                <div className="lp-feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID "HOW IT WORKS" ── */}
      <section className="lp-section lp-section-alt" id="how">
        <div className="lp-section-inner">
          <div className="lp-eyebrow">How it works</div>
          <h2 className="lp-section-title">
            A seamless workflow from launch to analysis
          </h2>
          <p className="lp-section-sub">
            Everything is structured to get your messages sent and tracked
            within minutes.
          </p>

          <div className="lp-bento-grid">
            <div className="lp-bento-card lp-bento-large">
              <div className="lp-bento-content">
                <div className="lp-bento-num">01</div>
                <h3>Import Your Contacts</h3>
                <p>
                  Upload a CSV file containing phone numbers, names, and tags.
                  You can include custom columns like <code>document_url</code>{" "}
                  to send dynamic, personalized files to each individual
                  contact.
                </p>
              </div>
              <div className="lp-bento-visual lp-bento-csv-visual">
                <div className="lp-csv-table">
                  <div className="lp-csv-row lp-csv-head">
                    <span>name</span>
                    <span>phone</span>
                    <span>document_url</span>
                  </div>
                  <div className="lp-csv-row">
                    <span>Wale</span>
                    <span>+234 801 234 5678</span>
                    <span className="lp-csv-link">invoice_89.pdf</span>
                  </div>
                  <div className="lp-csv-row">
                    <span>Zohan</span>
                    <span>+1 415 555 2671</span>
                    <span className="lp-csv-link">invoice_90.pdf</span>
                  </div>
                  <div className="lp-csv-row">
                    <span>Bianca</span>
                    <span>+44 7700 900077</span>
                    <span className="lp-csv-link">onboard_doc.pdf</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-bento-card lp-bento-small">
              <div className="lp-bento-content">
                <div className="lp-bento-num">02</div>
                <h3>Create Template</h3>
                <p>
                  Compose messages using Meta&apos;s templates. Add dynamic
                  placeholders like <code>{`{{1}}`}</code> to pull contact
                  variables on dispatch.
                </p>
              </div>
              <div className="lp-bento-visual lp-bento-tpl-visual">
                <div className="lp-tpl-editor">
                  <div className="lp-editor-bubble">
                    Hello <span className="lp-editor-badge">{"{{1}}"}</span>,
                    your invoice is ready for download.
                  </div>
                  <div className="lp-editor-buttons">
                    <span>🔗 Download</span>
                    <span>💬 Support</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-bento-card lp-bento-small lp-bento-partnership">
              <div className="lp-bento-content">
                <div className="lp-bento-badge">
                  <Sparkles size={12} /> Meta Cloud API
                </div>
                <h3>Official Partner Integration</h3>
                <p>
                  Direct connection ensures maximum speed, high delivery rates,
                  and zero intermediate markup costs.
                </p>
              </div>
              <div className="lp-bento-visual lp-bento-meta-visual">
                <div className="lp-meta-logo-box">
                  <Icon height={40} />
                  <div className="lp-meta-line"></div>
                  <Check size={18} />
                </div>
              </div>
            </div>

            <div className="lp-bento-card lp-bento-large">
              <div className="lp-bento-content">
                <div className="lp-bento-num">03</div>
                <h3>Launch & Track Live</h3>
                <p>
                  Queue your broadcasts instantly or schedule them for later.
                  Monitor delivery stats (sent, delivered, read) updating in
                  real-time as your campaign runs.
                </p>
              </div>
              <div className="lp-bento-visual lp-bento-chart-visual">
                <div className="lp-chart-panel">
                  <div className="lp-chart-header">
                    <span>Broadcasting Campaign</span>
                    <span className="lp-chart-live-dot"></span>
                  </div>
                  <div className="lp-chart-bars">
                    <div className="lp-chart-bar-row">
                      <div className="lp-bar-label">Delivered (98%)</div>
                      <div className="lp-bar-track">
                        <div
                          className="lp-bar-fill"
                          style={{ width: "98%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="lp-chart-bar-row">
                      <div className="lp-bar-label">Read (85%)</div>
                      <div className="lp-bar-track">
                        <div
                          className="lp-bar-fill lp-bar-fill-read"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE USE CASES SHOWCASE ── */}
      <section className="lp-section" id="use-cases">
        <div className="lp-section-inner">
          <div className="lp-eyebrow">Use Cases</div>
          <h2 className="lp-section-title">
            Built for every kind of business message
          </h2>
          <p className="lp-section-sub">
            Select a use case below to see exactly how the formatted message
            appears on a user&apos;s mobile screen.
          </p>

          <div className="lp-showcase-grid">
            <div className="lp-showcase-tabs">
              {USE_CASES.map((u, idx) => (
                <button
                  className={`lp-showcase-tab-btn ${activeUseCaseIdx === idx ? "lp-active" : ""}`}
                  onClick={() => setActiveUseCaseIdx(idx)}
                  key={u.id}
                >
                  <span className="lp-showcase-tab-icon">{u.icon}</span>
                  <span className="lp-showcase-tab-label">{u.label}</span>
                </button>
              ))}
            </div>

            <div className="lp-showcase-preview">
              <div className="lp-phone-sim">
                <div className="lp-phone-header">
                  <div className="lp-phone-notch"></div>
                  <div className="lp-phone-user-info">
                    <div className="lp-phone-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/favicon.png"
                        alt=""
                        style={{ height: 20, width: "auto" }}
                      />
                    </div>
                    <div>
                      <div className="lp-phone-username">
                        Broadcast Official
                      </div>
                      <div className="lp-phone-status">Online</div>
                    </div>
                  </div>
                </div>

                <div className="lp-phone-chat-body">
                  <div className="lp-wa-bubble">
                    {activePreview.headerType === "document" && (
                      <div className="lp-wa-doc-header">
                        <div className="lp-wa-doc-icon">
                          <FileText size={20} />
                        </div>
                        <div className="lp-wa-doc-details">
                          <div className="lp-wa-doc-name">
                            {activePreview.headerName}
                          </div>
                          <div className="lp-wa-doc-size">
                            PDF · 1 page · 142 KB
                          </div>
                        </div>
                      </div>
                    )}

                    {activePreview.headerType === "image" && (
                      <div className="lp-wa-img-header">
                        <div className="lp-wa-img-placeholder">
                          <span>{activePreview.headerName}</span>
                        </div>
                      </div>
                    )}

                    <div className="lp-wa-body">
                      {activePreview.body}
                      <span className="lp-wa-timestamp">12:00 PM ✓✓</span>
                    </div>

                    {activePreview.footer && (
                      <div className="lp-wa-footer">{activePreview.footer}</div>
                    )}
                  </div>

                  {activePreview.buttons &&
                    activePreview.buttons.map((btn) => (
                      <div className="lp-wa-btn-option" key={btn}>
                        <Send size={12} /> {btn}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING & PLANS ── */}
      <section className="lp-section" id="pricing">
        <div className="lp-section-inner">
          <div className="lp-eyebrow">Pricing & Plans</div>
          <h2 className="lp-section-title">Transparent platform pricing</h2>
          <p className="lp-section-sub">
            Simple, scalable pricing designed for businesses of all sizes.
            Choose the plan that works best for you.
          </p>

          <div className="lp-pricing-callout">
            <div className="lp-pricing-callout-content">
              <div className="lp-pricing-callout-icon">
                <CheckCircle size={20} />
              </div>
              <div>
                <strong>No Auto-Debit, No Lock-In</strong>
                <p>
                  You&apos;re billed once per period — never auto-renewed
                  without your action. Renew manually anytime from Billing, and
                  pay Meta directly with zero markup either way.
                </p>
              </div>
            </div>
          </div>

          <div className="lp-pricing-grid">
            <div className="lp-pricing-card">
              <div className="lp-pricing-header">
                <h3>Monthly</h3>
              </div>
              <div className="lp-pricing-price">
                <span className="lp-pricing-amount">₦15,000</span>
                <span className="lp-pricing-period">/month</span>
              </div>
              <p className="lp-pricing-tag">Flexible baseline entry</p>
              <ul className="lp-pricing-features">
                <li>
                  <Check size={16} /> 100% Direct Pay-As-You-Go Meta API Billing
                </li>
                <li>
                  <Check size={16} /> Shared Multi-Agent Team Inbox
                </li>
                <li>
                  <Check size={16} /> Contact Directory
                </li>
                <li>
                  <Check size={16} /> Bulk Broadcast Campaign Manager
                </li>
                <li>
                  <Check size={16} /> Automated Template Approval Suite
                </li>
              </ul>
              <a
                href={`${APP_URL}/signup?plan=monthly`}
                className="lp-btn lp-btn-primary lp-btn-block"
              >
                Get Started
              </a>
            </div>

            <div className="lp-pricing-card lp-pricing-popular">
              <div className="lp-pricing-badge">Most Popular</div>
              <div className="lp-pricing-header">
                <h3>Quarterly</h3>
              </div>
              <div className="lp-pricing-price">
                <span className="lp-pricing-amount">₦38,000</span>
                <span className="lp-pricing-period">/3 months</span>
              </div>
              <p className="lp-pricing-tag">
                Quarterly Essential - Saves ₦7,000. Great for committed users.
              </p>
              <ul className="lp-pricing-features">
                <li>
                  <Check size={16} /> 100% Direct Pay-As-You-Go Meta API Billing
                </li>
                <li>
                  <Check size={16} /> Shared Multi-Agent Team Inbox
                </li>
                <li>
                  <Check size={16} /> Contact Directory
                </li>
                <li>
                  <Check size={16} /> Bulk Broadcast Campaign Manager
                </li>
                <li>
                  <Check size={16} /> Automated Template Approval Suite
                </li>
              </ul>
              <a
                href={`${APP_URL}/signup?plan=quarterly`}
                className="lp-btn lp-btn-primary lp-btn-block"
              >
                Get Started
              </a>
            </div>

            <div className="lp-pricing-card">
              <div className="lp-pricing-header">
                <h3>6 Months</h3>
              </div>
              <div className="lp-pricing-price">
                <span className="lp-pricing-amount">₦72,000</span>
                <span className="lp-pricing-period">/6 months</span>
              </div>
              <p className="lp-pricing-tag">
                Half-Yearly - Saves ₦18,000 for scaling businesses
              </p>
              <ul className="lp-pricing-features">
                <li>
                  <Check size={16} /> 100% Direct Pay-As-You-Go Meta API Billing
                </li>
                <li>
                  <Check size={16} /> Shared Multi-Agent Team Inbox
                </li>
                <li>
                  <Check size={16} /> Contact Directory
                </li>
                <li>
                  <Check size={16} /> Bulk Broadcast Campaign Manager
                </li>
                <li>
                  <Check size={16} /> Automated Template Approval Suite
                </li>
              </ul>
              <a
                href={`${APP_URL}/signup?plan=biannual`}
                className="lp-btn lp-btn-primary lp-btn-block"
              >
                Get Started
              </a>
            </div>

            <div className="lp-pricing-card">
              <div className="lp-pricing-header">
                <h3>Yearly</h3>
              </div>
              <div className="lp-pricing-price">
                <span className="lp-pricing-amount">₦135,000</span>
                <span className="lp-pricing-period">/year</span>
              </div>
              <p className="lp-pricing-tag">
                Full Year - Saves ₦45,000 for enterprise teams
              </p>
              <ul className="lp-pricing-features">
                <li>
                  <Check size={16} /> 100% Direct Pay-As-You-Go Meta API Billing
                </li>
                <li>
                  <Check size={16} /> Shared Multi-Agent Team Inbox
                </li>
                <li>
                  <Check size={16} /> Contact Directory
                </li>
                <li>
                  <Check size={16} /> Bulk Broadcast Campaign Manager
                </li>
                <li>
                  <Check size={16} /> Automated Template Approval Suite
                </li>
              </ul>
              <a
                href={`${APP_URL}/signup?plan=annual`}
                className="lp-btn lp-btn-primary lp-btn-block"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── REQUEST SETUP QUOTE ── */}
      <section className="lp-section lp-section-alt" id="setup">
        <div className="lp-section-inner">
          <div className="lp-setup-content">
            <h2>Need Technical Onboarding & Meta Verification Support?</h2>
            <p>
              Initial system configuration, Meta Business Suite alignment, and
              custom API workflows are calculated separately based on your
              infrastructure scale — this is also the path for a dedicated
              organization subdomain (e.g. yourorg.broadcast.com.ng), not
              included on self-serve plans.
            </p>
            <p className="lp-setup-note">
              Our technical team will work with you to ensure a smooth
              implementation tailored to your specific needs.
            </p>
            <button
              onClick={() => setShowSignup(true)}
              className="lp-btn lp-btn-white lp-btn-lg"
              style={{ cursor: "pointer" }}
            >
              Request a Custom Setup Quote
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-cta-banner">
        <div className="lp-section-inner">
          <h2>Start sending personalised WhatsApp messages today</h2>
          <p>
            Connect your Meta account, upload your contacts, and launch your
            first campaign in minutes.
          </p>
          <a
            href={`${APP_URL}/dashboard`}
            className="lp-btn lp-btn-white lp-btn-lg"
          >
            Open Dashboard <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* signup customer lead modal */}
      {showSignup && (
        <div
          className="modal-overlay"
          onClick={handleCloseSignup}
          style={{ zIndex: 10000 }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--modal-bg)",
              border: "1px solid var(--border)",
              maxWidth: "480px",
            }}
          >
            <div className="modal-header">
              <h2>
                {signupSuccess ? "Request Received!" : "Request a Custom Setup"}
              </h2>
              <button className="modal-close" onClick={handleCloseSignup}>
                &times;
              </button>
            </div>

            {signupSuccess ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div
                  style={{
                    color: "var(--green)",
                    fontSize: "3rem",
                    marginBottom: "16px",
                  }}
                >
                  ✓
                </div>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    marginBottom: "24px",
                  }}
                >
                  {signupMessage}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleCloseSignup}
                  style={{ margin: "0 auto" }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit}>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.88rem",
                    marginBottom: "20px",
                    lineHeight: "1.5",
                  }}
                >
                  Register below to request your custom setup, dedicated
                  subdomain, and Meta credentials onboarding — our team will
                  follow up directly.
                </p>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Wale Bianca"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="wale@company.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label>Company Name (optional)</label>
                  <input
                    type="text"
                    placeholder="My Logistics Ltd"
                    value={signupCompany}
                    onChange={(e) => setSignupCompany(e.target.value)}
                  />
                </div>

                <div className="modal-footer" style={{ marginTop: 0 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseSignup}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={signupLoading}
                  >
                    {signupLoading ? "Registering..." : "Request Custom Setup"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── FAQ ── */}
      <section className="lp-section" id="faq">
        <div className="lp-section-inner">
          <div className="lp-faq-wrap">
            <div className="lp-eyebrow">FAQ</div>
            <h2 className="lp-section-title">Common questions</h2>
            <div className="lp-faq-list">
              {FAQS.map((f) => (
                <details className="lp-faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <a href="#top" className="lp-logo">
              <Icon /> Broadcast
            </a>
            <p>
              The WhatsApp broadcasting platform built for businesses that need
              to reach their audience at scale — without the middleman markup.
            </p>
          </div>
          <div className="lp-footer-cols">
            <div className="lp-footer-col">
              <strong>Product</strong>
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="lp-footer-col">
              <strong>App</strong>
              <a href={`${APP_URL}/dashboard`}>Dashboard</a>
              <a href={`${APP_URL}/contacts`}>Contacts</a>
              <a href={`${APP_URL}/campaigns`}>Campaigns</a>
              <a href={`${APP_URL}/templates`}>Templates</a>
            </div>
            <div className="lp-footer-col">
              <strong>Legal</strong>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="lp-footer-bottom">
          © {year} Broadcast. Built on Official Meta&apos;s Cloud API. Powered
          by &nbsp;
          <a
            className="lp-csv-link"
            style={{ opacity: 0.7 }}
            href="http://rahmlad.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rahmlad Solutions
          </a>
        </div>
      </footer>
    </div>
  );
}
