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
  ArrowDown,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";

import Icon from "./Icon";
import ThemeMenu from "./ThemeMenu";
import { FAQ_GROUPS } from "../lib/faqs";
import ContactSection from "./ContactSection";
import SiteFooter from "./SiteFooter";
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

export default function LandingClient() {
  const [activeUseCaseIdx, setActiveUseCaseIdx] = useState(0);
  const activePreview = USE_CASES[activeUseCaseIdx].phonePreview;

  // Custom setup lead-capture modal state
  const [showSignup, setShowSignup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Mobile menu: Escape closes it, and it closes itself if the window grows to desktop width.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    const mq = window.matchMedia("(min-width: 961px)");
    const onWide = () => { if (mq.matches) setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => { window.removeEventListener("keydown", onKey); mq.removeEventListener("change", onWide); };
  }, [menuOpen]);
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
      <nav className="lp-nav" aria-label="Main">
        <div className="lp-nav-inner">
          <a href="#top" className="lp-logo" onClick={() => setMenuOpen(false)}>
            <Icon height={30} /> Broadcast
          </a>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <Link href="/tools">Free tools</Link>
            <a href="#contact">Contact</a>
          </div>
          <div className="lp-nav-actions">
            <a href={`${APP_URL}/login`} className="lp-nav-link-text">
              Login
            </a>
            <ThemeMenu />
            <a href={`${APP_URL}/signup`} className="lp-btn lp-btn-primary lp-nav-cta">
              Get Started <ArrowRight size={18} />
            </a>
            <button
              type="button"
              className="lp-nav-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="lp-nav-panel"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lp-nav-panel" id="lp-nav-panel">
            {[
              ["#features", "Features"],
              ["#how", "How it works"],
              ["#pricing", "Pricing"],
            ].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <Link href="/tools" onClick={() => setMenuOpen(false)}>Free tools</Link>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <a href={`${APP_URL}/login`}>Login</a>
            <a href={`${APP_URL}/signup`} className="lp-btn lp-btn-primary lp-nav-panel-cta">
              Get Started <ArrowRight size={18} />
            </a>
          </div>
        )}
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

      {/* ── SEND YOUR FIRST MESSAGE: Campaign vs Dispatch ── */}
      <section className="lp-section" id="first-send">
        <div className="lp-section-inner">
          <div className="lp-eyebrow">Send your first message</div>
          <h2 className="lp-section-title">
            Campaign or Dispatch? Pick the one that fits
          </h2>
          <p className="lp-section-sub">
            Both start with a Meta-approved template. The difference is whether
            everyone gets the same message, or their own file.
          </p>

          <div className="lp-send-grid">
            <div className="lp-send-card">
              <div className="lp-send-tag">Campaign</div>
              <h3>Same message, many people</h3>
              <p>
                Choose a template and a group of contacts. Everyone receives the
                same message, personalised with their name or details.
              </p>
              <ul>
                <li>Promotions and offers</li>
                <li>Announcements and event reminders</li>
                <li>Product launches and updates</li>
              </ul>
            </div>
            <div className="lp-send-card">
              <div className="lp-send-tag">Dispatch</div>
              <h3>Same caption, their own document</h3>
              <p>
                Upload a CSV with a file link per person. Each recipient gets
                the caption plus their own PDF or image.
              </p>
              <ul>
                <li>Invoices and receipts</li>
                <li>Account statements</li>
                <li>Certificates, results and tickets</li>
              </ul>
            </div>
          </div>

          <ol className="lp-send-steps">
            <li>
              <span>1</span>
              <div>
                <strong>Add contacts</strong>
                <p>Import a CSV or add people one by one.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Create a template</strong>
                <p>Write the message once. Meta usually approves it within minutes to a day.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Launch and watch it land</strong>
                <p>Start a Campaign or Dispatch and follow sent, delivered and read live.</p>
              </div>
            </li>
          </ol>

          <div className="lp-send-cta">
            <a href={`${APP_URL}/signup`} className="lp-btn lp-btn-primary lp-btn-lg">
              Get started <ArrowRight size={18} />
            </a>
            <Link href="/setup-guide" className="lp-send-link">
              Read the full setup guide
            </Link>
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

      {/* ── CONTACT ── */}
      <ContactSection />

      {/* ── FAQ ── */}
      <section className="lp-section" id="faq">
        <div className="lp-section-inner">
          <div className="lp-faq-wrap">
            <div className="lp-eyebrow">FAQ</div>
            <h2 className="lp-section-title">Common questions</h2>
            <nav className="lp-faq-jump" aria-label="FAQ topics">
              {FAQ_GROUPS.map((g) => (
                <a key={g.id} href={`#faq-${g.id}`}>{g.title}</a>
              ))}
            </nav>
            {FAQ_GROUPS.map((g) => (
              <div className="lp-faq-group" key={g.id} id={`faq-${g.id}`}>
                <h3 className="lp-faq-group-title">{g.title}</h3>
                <div className="lp-faq-list">
                  {g.items.map((f) => (
                    <details className="lp-faq-item" key={f.q}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                      {f.link && (
                        <p className="lp-faq-link">
                          {f.link.external ? (
                            <a href={f.link.href} target="_blank" rel="noopener noreferrer">{f.link.label} →</a>
                          ) : f.link.href.startsWith("#") ? (
                            <a href={f.link.href}>{f.link.label} →</a>
                          ) : (
                            <Link href={f.link.href}>{f.link.label} →</Link>
                          )}
                        </p>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            ))}
            <div className="lp-faq-more">
              <strong>Still have a question?</strong>
              <span>We usually reply within 1 business day.</span>
              <a href="#contact" className="lp-btn lp-btn-ghost">Contact us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter onHome />
    </div>
  );
}
