'use client';

import { useMemo, useState } from "react";
import Link from "next/link";

import ToolShell from "../ToolShell";
import ToolFaq from "../ToolFaq";
import { FEES_FAQS } from "../../lib/toolFaqs";
import { APP_URL } from "../../lib/api";

// Broadcast's published plans (must match the landing pricing cards and the app's billingPlans).
const PLANS = [
  { key: "monthly", label: "Monthly", total: 15000, months: 1 },
  { key: "quarterly", label: "Quarterly", total: 38000, months: 3 },
  { key: "biannual", label: "6 Months", total: 72000, months: 6 },
  { key: "annual", label: "Yearly", total: 135000, months: 12 },
] as const;

const META_RATE_CARD = "https://developers.facebook.com/docs/whatsapp/pricing";

// EXAMPLE numbers only, so the calculator isn't blank. They are NOT Meta's prices.
const EXAMPLE_RATES = { marketing: "0.05", utility: "0.02", authentication: "0.02" };

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const usd = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const naira = (n: number) => `₦${Math.round(n).toLocaleString()}`;

export default function ApiFeesClient() {
  const [counts, setCounts] = useState({ marketing: "1000", utility: "0", authentication: "0" });
  const [rates, setRates] = useState<Record<string, string>>(EXAMPLE_RATES);
  const [fx, setFx] = useState("");
  const [plan, setPlan] = useState<(typeof PLANS)[number]["key"]>("monthly");
  const [markup, setMarkup] = useState("20");

  const r = useMemo(() => {
    const meta =
      num(counts.marketing) * num(rates.marketing) +
      num(counts.utility) * num(rates.utility) +
      num(counts.authentication) * num(rates.authentication);
    const rate = num(fx);
    const p = PLANS.find((x) => x.key === plan)!;
    const subMonthly = p.total / p.months;
    const markupExtra = meta * (num(markup) / 100);
    return { meta, rate, subMonthly, planLabel: p.label, markupExtra };
  }, [counts, rates, fx, plan, markup]);

  const usingExamples = rates.marketing === EXAMPLE_RATES.marketing && rates.utility === EXAMPLE_RATES.utility && rates.authentication === EXAMPLE_RATES.authentication;

  const rows: { key: "marketing" | "utility" | "authentication"; label: string; help: string }[] = [
    { key: "marketing", label: "Marketing", help: "Promotions, offers, announcements" },
    { key: "utility", label: "Utility", help: "Order updates, invoices, reminders" },
    { key: "authentication", label: "Authentication", help: "One-time passcodes" },
  ];

  return (
    <ToolShell
      eyebrow="Free tool"
      title="WhatsApp API fees at zero markup"
      crumb="WhatsApp API fees"
      benefits={["Broadcast adds 0% to Meta's message fees.", "Estimate a month of sending.", "Nothing is stored or sent."]}
      intro="Meta charges for WhatsApp API messages. Broadcast doesn't add to that: you pay Meta directly, at Meta's rate, and pay us only a flat subscription. Use the calculator to estimate what a month of sending will cost."
    >
      <div className="fee-explainer">
        <div className="tool-card">
          <span className="tool-card-eyebrow">You pay Meta</span>
          <h3>For messages sent</h3>
          <p>Meta bills you per delivered template message, by category and by the recipient&apos;s country, to the payment method on your WhatsApp account. Replies within 24 hours of a customer&apos;s message are generally free.</p>
        </div>
        <div className="tool-card">
          <span className="tool-card-eyebrow">You pay Broadcast</span>
          <h3>A flat subscription</h3>
          <p>Paid in naira through Paystack for the dashboard, templates, campaigns, dispatches and delivery tracking. No per-message fee and <strong>no markup on Meta&apos;s charges</strong>.</p>
        </div>
      </div>

      <div className="tool-grid" style={{ marginTop: 28 }}>
        <div className="tool-panel">
          <h2 className="tool-h2">Your monthly sending</h2>
          <div className="fee-table" role="group" aria-label="Messages and rates by category">
            <div className="fee-row fee-head"><span>Category</span><span>Messages / month</span><span>Meta rate (USD each)</span></div>
            {rows.map((row) => (
              <div className="fee-row" key={row.key}>
                <span><strong>{row.label}</strong><small>{row.help}</small></span>
                <input aria-label={`${row.label} messages per month`} className="tool-input" inputMode="numeric" value={counts[row.key]} onChange={(e) => setCounts({ ...counts, [row.key]: e.target.value })} />
                <input aria-label={`${row.label} rate in USD`} className="tool-input" inputMode="decimal" value={rates[row.key]} onChange={(e) => setRates({ ...rates, [row.key]: e.target.value })} />
              </div>
            ))}
          </div>

          {usingExamples && (
            <p className="tool-warn">
              These rates are <strong>examples only, not Meta&apos;s prices</strong>. Meta&apos;s rates depend on the country and change
              on a schedule, so replace them with the current figures on{" "}
              <a href={META_RATE_CARD} target="_blank" rel="noopener noreferrer">Meta&apos;s rate card</a>.
            </p>
          )}

          <div className="fee-opts">
            <label>Exchange rate (₦ per $1, optional)
              <input className="tool-input" inputMode="decimal" placeholder="e.g. 1500" value={fx} onChange={(e) => setFx(e.target.value)} />
            </label>
            <label>Broadcast plan
              <select className="tool-input" value={plan} onChange={(e) => setPlan(e.target.value as typeof plan)}>
                {PLANS.map((p) => <option key={p.key} value={p.key}>{p.label} — {naira(p.total)}</option>)}
              </select>
            </label>
            <label>Compare with a provider that adds (%)
              <input className="tool-input" inputMode="decimal" value={markup} onChange={(e) => setMarkup(e.target.value)} />
            </label>
          </div>
        </div>

        <div className="tool-panel">
          <h2 className="tool-h2">Estimated month</h2>
          <dl className="fee-results">
            <div><dt>Meta message fees</dt><dd>{usd(r.meta)}{r.rate > 0 && <small>≈ {naira(r.meta * r.rate)}</small>}</dd></div>
            <div><dt>Broadcast markup</dt><dd>$0.00<small>0% on Meta&apos;s fees</small></dd></div>
            <div><dt>Broadcast subscription ({r.planLabel})</dt><dd>{naira(r.subMonthly)}<small>per month</small></dd></div>
            {r.rate > 0 && (
              <div className="fee-total"><dt>Estimated total</dt><dd>{naira(r.meta * r.rate + r.subMonthly)}<small>per month</small></dd></div>
            )}
          </dl>

          {num(markup) > 0 && r.meta > 0 && (
            <div className="fee-compare">
              <strong>What a {num(markup)}% markup would add</strong>
              <span>{usd(r.markupExtra)} a month · {usd(r.markupExtra * 12)} a year{r.rate > 0 && ` (≈ ${naira(r.markupExtra * 12 * r.rate)})`}</span>
              <small>On Meta fees alone, before any subscription.</small>
            </div>
          )}

          <a href={`${APP_URL}/signup`} className="lp-btn lp-btn-primary" style={{ marginTop: 18 }}>Start with Broadcast</a>
          <p className="tool-note">An estimate for planning, not a quote. Your actual Meta bill depends on delivered messages and Meta&apos;s current rates. See <Link href="/#pricing">our plans</Link>.</p>
        </div>
      </div>

      <div className="tool-guide">
        <h2>How WhatsApp API pricing works</h2>
        <ul className="tool-tips">
          <li><strong>Per message, by category.</strong> Marketing, Utility and Authentication templates each have their own rate, and the rate depends on the recipient&apos;s country.</li>
          <li><strong>Replies are generally free.</strong> When a customer messages you, you can reply freely for 24 hours.</li>
          <li><strong>Choosing the right category matters.</strong> A template with a promotion in it is Marketing, even if it looks like an update.</li>
          <li><strong>Rates change.</strong> Always check Meta&apos;s <a href={META_RATE_CARD} target="_blank" rel="noopener noreferrer">current rate card</a> for the countries you message.</li>
        </ul>
        <p className="tool-guide-lead" style={{ marginTop: 16 }}>
          Related: <Link href="/tools/whatsapp-formatter">WhatsApp message formatter</Link> · <Link href="/tools/image-compressor">WhatsApp image compressor</Link> · <Link href="/setup-guide#templates">Templates and pricing guide</Link>
        </p>
      </div>

      <ToolFaq title="WhatsApp API fee questions" items={FEES_FAQS} />
    </ToolShell>
  );
}
