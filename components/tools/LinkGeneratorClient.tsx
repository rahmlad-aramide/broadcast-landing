'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";

import ToolShell from "../ToolShell";
import ToolFaq from "../ToolFaq";
import { LINK_FAQS } from "../../lib/toolFaqs";
import { COUNTRIES, buildWaLink, normalizePhone } from "../../lib/phone";
import QrPanel from "./QrPanel";

export default function LinkGeneratorClient() {
  const [country, setCountry] = useState("234");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = useMemo(() => (phone.trim() ? normalizePhone(phone, country) : null), [phone, country]);
  const link = parsed?.ok ? buildWaLink(parsed.digits, message) : "";
  const button = link ? `<a href="${link}" target="_blank" rel="noopener noreferrer">Chat with us on WhatsApp</a>` : "";

  const copy = async (key: string, value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(key); setTimeout(() => setCopied(null), 1600); } catch { /* clipboard blocked */ }
  };

  return (
    <ToolShell
      eyebrow="Free tool"
      title="WhatsApp link & QR code generator"
      crumb="WhatsApp link & QR code generator"
      benefits={["Type the number any way you like.", "Get a link and a scannable QR code.", "Nothing is stored or sent."]}
      intro="Turn any phone number into a click-to-chat link (https://wa.me/…) and a QR code people can scan. Type it as +234 803 123 4567, 2348031234567 or 0803 123 4567 and we'll fix the format for you."
    >
      <div className="tool-grid">
        <div className="tool-panel">
          <h2 className="tool-h2">Your number</h2>
          <div className="link-row">
            <label>Country (for numbers starting with 0)
              <select className="tool-input" value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map((c) => <option key={c.code} value={c.dial}>{c.flag} {c.name} (+{c.dial})</option>)}
              </select>
            </label>
            <label>Phone number
              <input className="tool-input" inputMode="tel" autoComplete="off" placeholder="e.g. 0803 123 4567 or +234 803 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
          </div>
          {parsed && !parsed.ok && <p className="tool-warn" role="alert">{parsed.error}</p>}
          {parsed?.ok && (
            <p className="tool-ok">
              Reads as <strong>{parsed.display}</strong>{parsed.note && <> — {parsed.note}</>}
            </p>
          )}

          <label className="link-msg">Pre-filled message (optional)
            <textarea className="tool-input" rows={4} maxLength={1000} placeholder="Hi! I'd like to know more about your services." value={message} onChange={(e) => setMessage(e.target.value)} />
            <small>When someone taps the link, this text is already typed in the chat. {message.length}/1000</small>
          </label>
        </div>

        <div className="tool-panel">
          <h2 className="tool-h2">Your link</h2>
          {link ? (
            <>
              <div className="link-output" data-testid="wa-link">{link}</div>
              <div className="link-actions">
                <button type="button" className="lp-btn lp-btn-primary" onClick={() => copy("link", link)}>
                  {copied === "link" ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy link</>}
                </button>
                <a className="lp-btn lp-btn-ghost" href={link} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Test link</a>
              </div>
              <details className="link-more">
                <summary>Website button code</summary>
                <pre>{button}</pre>
                <button type="button" className="lp-btn lp-btn-ghost" onClick={() => copy("html", button)}>
                  {copied === "html" ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy HTML</>}
                </button>
              </details>
            </>
          ) : (
            <p className="tool-note">Enter a phone number to see your link.</p>
          )}
        </div>
      </div>

      {link && (
        <div className="tool-panel" style={{ marginTop: 28 }}>
          <QrPanel value={link} />
        </div>
      )}

      <div className="tool-guide">
        <h2>Where to use a WhatsApp link</h2>
        <ul className="tool-tips">
          <li><strong>Instagram, Facebook and TikTok bios</strong> and link-in-bio pages.</li>
          <li><strong>Your website</strong> as a Chat on WhatsApp button, and in email signatures.</li>
          <li><strong>Flyers, receipts, shop windows and packaging</strong>, as a QR code customers scan with their camera.</li>
          <li><strong>Ads</strong> that open a chat instead of a form.</li>
        </ul>
        <p className="tool-guide-lead">
          Planning to message many customers who reach out? See the <Link href="/tools/whatsapp-api-fees">WhatsApp API fee calculator</Link>
          {" "}and the <Link href="/tools/whatsapp-template-builder">template builder</Link>, or <Link href="/tools">all free tools</Link>.
        </p>
      </div>

      <ToolFaq title="WhatsApp link questions" items={LINK_FAQS} />
    </ToolShell>
  );
}
