'use client';

import Link from "next/link";
import Icon from "./Icon";
import ThemeMenu from "./ThemeMenu";

// Not new Date().getFullYear() — see the comment in LandingClient.tsx.
const YEAR = 2026;
const APP_URL = "https://app.broadcast.com.ng";

const h2 = { fontSize: "1.3rem", fontWeight: "700", color: "#fff" } as const;
const p = { fontSize: "0.95rem", lineHeight: "1.7", color: "var(--lp-muted)" } as const;
const col = { display: "flex", flexDirection: "column", gap: "12px" } as const;

export default function SetupGuideClient() {
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
          <div className="lp-eyebrow">Setup Guide</div>
          <h1 className="lp-section-title" style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
            Connect your WhatsApp number to Broadcast
          </h1>
          <p style={{ ...p, marginBottom: "40px" }}>
            Takes about 10 minutes. You sign in with Facebook, and Meta walks you through adding your business and number.
          </p>

          <div className="lp-feat-card" style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={col}>
              <h2 style={h2}>1. Before you start</h2>
              <p style={p}>
                You need a Facebook account that can manage a Meta Business portfolio, and a phone number that can receive
                an SMS or voice call for verification. If the number is currently registered on the WhatsApp or WhatsApp
                Business app, follow Meta&apos;s prompts during signup.
              </p>
            </div>

            <div style={col}>
              <h2 style={h2}>2. Create your account and subscribe</h2>
              <p style={p}>
                <a href={`${APP_URL}/signup`} className="lp-csv-link">Sign up</a>, choose a plan and pay. Then open{" "}
                <strong>Profile → WhatsApp Connection</strong> and click <strong>Connect WhatsApp via Facebook</strong>.
              </p>
            </div>

            <div style={col}>
              <h2 style={h2}>3. Business information</h2>
              <p style={p}>
                Log in to Facebook when the popup opens, then pick or create your business portfolio and enter your business
                name, country and category.
              </p>
            </div>

            <div style={col}>
              <h2 style={h2}>4. The website field: no website? No problem</h2>
              <p style={p}>
                Meta asks for a business website. If you don&apos;t have one, enter your WhatsApp link instead:{" "}
                <code>https://wa.me/&lt;your-number&gt;</code>. Use the number in international format with no &quot;+&quot;,
                spaces or dashes, for example <code>https://wa.me/2348012345678</code>. A Facebook or Instagram page link
                also works.
              </p>
              <p style={p}>
                Not sure how to build the link? Use our free{" "}
                <Link href="/tools/whatsapp-link-generator" className="lp-csv-link">WhatsApp Link &amp; QR Code Generator</Link>{" "}
                to create your website link in seconds, then paste it into Meta&apos;s website field.
              </p>
            </div>

            <div style={col}>
              <h2 style={h2}>5. Display name</h2>
              <p style={p}>
                Use your real business name. Meta reviews display names, and a rejected name blocks sending, so avoid
                generic or misleading names.
              </p>
            </div>

            <div style={col}>
              <h2 style={h2}>6. Verify your number</h2>
              <p style={p}>
                Choose SMS or voice call and enter the code Meta sends. If it&apos;s a brand-new number that isn&apos;t on
                WhatsApp yet, tick <strong>&quot;This is a new number&quot;</strong> in Broadcast before connecting.
              </p>
            </div>

            <div style={col}>
              <h2 style={h2}>7. Payment method: skip now, add before campaigns</h2>
              <p style={p}>
                Meta may ask you to add a payment method during signup. You can skip it and finish connecting. But until you
                add one, you can only reply to customers who message you first. To send campaigns, add a payment method in{" "}
                <a href="https://business.facebook.com/billing_hub/payment_methods" className="lp-csv-link" target="_blank" rel="noopener noreferrer">
                  Meta Business Settings → Billing &amp; payments
                </a>
                . Meta bills you directly for message usage. Broadcast only charges the subscription fee.
              </p>
              <p style={p}>
                If Meta Business Suite shows &quot;Missing valid payment method&quot;, this is why. Adding a payment method
                clears it.
              </p>
            </div>

            <div style={col}>
              <h2 style={h2}>8. Create a template, then start sending</h2>
              <p style={p}>
                Back in Broadcast, check that Profile shows your number as connected. Then create a message template (see below), wait
                for Meta&apos;s approval, and launch your first campaign. Note that new numbers start with a low daily
                messaging limit that Meta raises as your business is verified and your message quality stays good.
              </p>
            </div>

            <div id="templates" style={col}>
              <h2 style={h2}>Templates: why you need one, and how Meta charges</h2>
              <p style={p}>
                WhatsApp only lets a business message someone first using a <strong>Meta-approved template</strong>. So before
                you can send a campaign, create a template in Broadcast and wait for Meta to approve it. Free-form text only
                works as a reply, within 24 hours of the customer&apos;s last message.
              </p>
              <p style={p}>
                <strong>Approval time:</strong> usually minutes, but it can take up to 24 hours. If a template still shows{" "}
                <em>Pending</em> after 24 hours, open the Templates page and click <strong>Sync with Meta Cloud</strong> to pull
                its latest status.
              </p>
              <p style={p}>
                <strong>Categories:</strong> every template has a category. Meta charges per <em>delivered</em> template
                message, and the price depends on the category and the recipient&apos;s country.
              </p>
              <ul style={{ ...p, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>Marketing:</strong> promotions, offers, announcements and re-engagement. The most expensive category.</li>
                <li><strong>Utility:</strong> messages about something the customer already did, such as order updates, receipts and appointment reminders. Cheaper than marketing.</li>
                <li><strong>Authentication:</strong> one-time passcodes and verification codes. Has its own separate rate on Meta&apos;s rate card.</li>
              </ul>
              <p style={p}>
                Pick the category honestly. Meta reads your content and may recategorize a template. A &quot;utility&quot;
                message that contains a promotion, for example, becomes Marketing, which changes what you&apos;re charged.
              </p>
              <p style={p}>
                Meta bills the payment method on your WhatsApp account directly, separately from your Broadcast subscription.
                Rates differ by country and Meta updates them on a schedule, so check the current rate for your market on{" "}
                <a href="https://developers.facebook.com/docs/whatsapp/pricing" className="lp-csv-link" target="_blank" rel="noopener noreferrer">
                  Meta&apos;s pricing page
                </a>
                .
              </p>
            </div>

            <div style={col}>
              <h2 style={h2}>Troubleshooting</h2>
              <p style={p}>
                <strong>&quot;Meta lookup failed&quot; after connecting:</strong> click <strong>Reconnect WhatsApp</strong>
                {" "}and go through the Facebook flow again.
              </p>
              <p style={p}>
                <strong>Number says it isn&apos;t registered for Cloud API:</strong> use the <strong>Register now</strong>{" "}
                button on the Profile page.
              </p>
              <p style={p}>
                <strong>Still stuck?</strong> Email{" "}
                <a href="mailto:support@broadcast.com.ng" className="lp-csv-link">support@broadcast.com.ng</a>.
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
