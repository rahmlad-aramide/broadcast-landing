'use client';

import { useRef, useState, type ReactNode } from "react";
import { Bold, Braces, Check, Code, Copy, Italic, List, ListOrdered, Quote, Strikethrough, Trash2 } from "lucide-react";

import Link from "next/link";
import ToolShell from "../ToolShell";
import ToolFaq from "../ToolFaq";
import { FORMATTER_FAQS } from "../../lib/toolFaqs";
import { renderWhatsAppText } from "../../lib/whatsappFormat";

const EXAMPLES: { label: string; text: string }[] = [
  {
    label: "Promo",
    text: "*Weekend sale! 🎉*\n\nGet *20% off* everything until ~Friday~ *Sunday*.\n\n- Free delivery over ₦20,000\n- New arrivals in store\n\nShop now: https://example.com/shop",
  },
  {
    label: "Invoice reminder",
    text: "Hello *Ada*,\n\nThis is a reminder that invoice *#1042* for _₦45,000_ is due on *Friday*.\n\n> Pay by transfer to avoid late fees.\n\nThank you!",
  },
  {
    label: "Welcome",
    text: "*Welcome to Brightfield Academy* 👋\n\nHere is what happens next:\n1. Check your email for login details\n2. Complete your profile\n3. Join the parents' group\n\nReply _HELP_ anytime.",
  },
  {
    label: "Code / OTP",
    text: "Your verification code is:\n\n```482 915```\n\nIt expires in 10 minutes. Never share it.",
  },
];

type Action = { type: "wrap"; mark: string } | { type: "prefix"; kind: "quote" | "bullet" | "number" };

// Static (no closures over the textarea ref); each button just names what it does.
const TOOLS: { label: string; icon: ReactNode; hint: string; action: Action }[] = [
  { label: "Bold", icon: <Bold size={16} />, hint: "*text*", action: { type: "wrap", mark: "*" } },
  { label: "Italic", icon: <Italic size={16} />, hint: "_text_", action: { type: "wrap", mark: "_" } },
  { label: "Strikethrough", icon: <Strikethrough size={16} />, hint: "~text~", action: { type: "wrap", mark: "~" } },
  { label: "Monospace", icon: <Code size={16} />, hint: "```text```", action: { type: "wrap", mark: "```" } },
  { label: "Inline code", icon: <Braces size={16} />, hint: "`text`", action: { type: "wrap", mark: "`" } },
  { label: "Bulleted list", icon: <List size={16} />, hint: "- item", action: { type: "prefix", kind: "bullet" } },
  { label: "Numbered list", icon: <ListOrdered size={16} />, hint: "1. item", action: { type: "prefix", kind: "number" } },
  { label: "Quote", icon: <Quote size={16} />, hint: "> quote", action: { type: "prefix", kind: "quote" } },
];

const LIMIT = 4096; // WhatsApp's maximum text message length

export default function WhatsAppFormatterClient() {
  const [text, setText] = useState(EXAMPLES[0].text);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const setWithSelection = (next: string, start: number, end: number) => {
    setText(next);
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(start, end);
    });
  };

  const wrap = (mark: string) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = text.slice(s, e);
    // Pressing the same style again on an already-wrapped selection removes it.
    if (sel.length >= mark.length * 2 && sel.startsWith(mark) && sel.endsWith(mark)) {
      const inner = sel.slice(mark.length, sel.length - mark.length);
      return setWithSelection(text.slice(0, s) + inner + text.slice(e), s, s + inner.length);
    }
    setWithSelection(text.slice(0, s) + mark + sel + mark + text.slice(e), s + mark.length, e + mark.length);
  };

  // Apply a line prefix ("> ", "- ", "1. ") to every line touched by the selection.
  const prefixLines = (kind: "quote" | "bullet" | "number") => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const lineStart = text.lastIndexOf("\n", s - 1) + 1;
    const nl = text.indexOf("\n", e);
    const lineEnd = nl === -1 ? text.length : nl;
    const lines = text.slice(lineStart, lineEnd).split("\n");
    const out = lines.map((l, i) => (kind === "quote" ? `> ${l}` : kind === "bullet" ? `- ${l}` : `${i + 1}. ${l}`));
    const block = out.join("\n");
    setWithSelection(text.slice(0, lineStart) + block + text.slice(lineEnd), lineStart, lineStart + block.length);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      ref.current?.select();
    }
  };

  const apply = (a: Action) => (a.type === "wrap" ? wrap(a.mark) : prefixLines(a.kind));

  return (
    <ToolShell
      eyebrow="Free tool"
      title="Format WhatsApp messages people can skim."
      crumb="WhatsApp text formatter"
      benefits={["No sign-up.", "Your text stays in this browser.", "Uses WhatsApp formatting, not special fonts."]}
      intro="Select text, pick a style, and check the chat preview. Copy the result and paste it into WhatsApp, which reads the markers and shows the styles."
    >
      <div className="tool-grid">
        <div className="tool-panel">
          <div className="tool-examples" role="group" aria-label="Start from an example">
            <span>Start from:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex.label} type="button" onClick={() => setText(ex.text)}>{ex.label}</button>
            ))}
          </div>

          <div className="tool-toolbar" role="toolbar" aria-label="Formatting">
            {TOOLS.map((t) => (
              <button key={t.label} type="button" onClick={() => apply(t.action)} title={`${t.label}  (${t.hint})`} aria-label={t.label}>
                {t.icon}
              </button>
            ))}
          </div>

          <textarea
            ref={ref}
            className="tool-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;
              if (e.key.toLowerCase() === "b") { e.preventDefault(); wrap("*"); }
              else if (e.key.toLowerCase() === "i") { e.preventDefault(); wrap("_"); }
            }}
            placeholder="Type or paste your message here…"
            aria-label="Message text"
            rows={14}
          />

          <p className="tool-note" style={{ marginTop: 8 }}>Select text, then pick a style. Ctrl+B / Cmd+B adds bold, Ctrl+I / Cmd+I adds italic. Click a style again to remove it. To style several lines, select them all.</p>

          <div className="tool-actions">
            <span className={text.length > LIMIT ? "tool-count over" : "tool-count"}>{text.length.toLocaleString()} / {LIMIT.toLocaleString()} characters</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="lp-btn lp-btn-ghost" onClick={() => setText("")} disabled={!text}>
                <Trash2 size={15} /> Clear
              </button>
              <button type="button" className="lp-btn lp-btn-primary" onClick={copy} disabled={!text}>
                {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy formatted text</>}
              </button>
            </div>
          </div>
        </div>

        <div className="tool-panel">
          <div className="tool-preview-label">Preview</div>
          <div className="wa-phone" aria-live="polite">
            <div className="wa-phone-bar">Your customer</div>
            <div className="wa-phone-chat">
              {text.trim() ? (
                <div className="wa-bubble">
                  <div className="wa-text">{renderWhatsAppText(text)}</div>
                  <span className="wa-bubble-time">10:24</span>
                </div>
              ) : (
                <p className="wa-empty">Your message will appear here.</p>
              )}
            </div>
          </div>
          <p className="tool-note">Preview is an approximation. Fonts and colours vary by phone, but the formatting rules are WhatsApp&apos;s own.</p>
        </div>
      </div>

      <div className="tool-guide" id="cheat-sheet">
        <div className="lp-eyebrow">WhatsApp formatting cheat sheet</div>
        <h2>Type these markers in any WhatsApp message.</h2>
        <p className="tool-guide-lead">
          You don&apos;t need this page to format a message. WhatsApp reads these markers on its own. The formatter above saves
          you typing them and shows the result before you send.
        </p>
        <div className="tool-table-wrap">
          <table className="tool-table">
            <thead><tr><th>Style</th><th>Type this</th><th>Shows as</th></tr></thead>
            <tbody>
              <tr><td>Bold</td><td><code>*text*</code></td><td><strong>text</strong></td></tr>
              <tr><td>Italic</td><td><code>_text_</code></td><td><em>text</em></td></tr>
              <tr><td>Strikethrough</td><td><code>~text~</code></td><td><s>text</s></td></tr>
              <tr><td>Monospace</td><td><code>```text```</code></td><td><span className="wa-code">text</span></td></tr>
              <tr><td>Inline code</td><td><code>`text`</code></td><td><span className="wa-code">text</span></td></tr>
              <tr><td>Bulleted list</td><td><code>- text</code> or <code>* text</code><small>At the start of a line</small></td><td>• text</td></tr>
              <tr><td>Numbered list</td><td><code>1. text</code><small>At the start of a line</small></td><td>1. text</td></tr>
              <tr><td>Quote</td><td><code>&gt; text</code><small>At the start of a line</small></td><td><span className="wa-quote-demo">text</span></td></tr>
            </tbody>
          </table>
        </div>
        <ul className="tool-tips">
          <li>Put markers right next to the words, with no space inside. <code>*Friday*</code> works.</li>
          <li>Combine styles by nesting markers: <code>*_Friday_*</code> is bold and italic.</li>
          <li>Lists and quotes need a space after the marker, at the start of the line.</li>
          <li>To style several lines, select them all. The formatter adds markers to each line.</li>
        </ul>

        <div className="tool-cards">
          <div className="tool-card">
            <span className="tool-card-eyebrow">Make it easy to skim</span>
            <h3>Bold the one detail they need.</h3>
            <p>
              Most customers read a WhatsApp message on a small screen, between other tasks. Bold the date, time or amount. Use
              lists for items to bring or steps to follow. Use monospace for booking codes and reference numbers so they&apos;re
              easy to copy. If everything is bold, nothing stands out.
            </p>
          </div>
          <div className="tool-card">
            <span className="tool-card-eyebrow">Take it further</span>
            <h3>Paste formatted text where you write messages.</h3>
            <p>
              The markers are plain characters, so they travel anywhere you can paste text, including a message sent through the
              WhatsApp Business API. Planning a bulk send? Estimate what it will cost with the{" "}
              <Link href="/tools/whatsapp-api-fees">WhatsApp API fee calculator</Link>, or shrink your pictures first with the{" "}
              <Link href="/tools/image-compressor">WhatsApp image compressor</Link>. See all{" "}
              <Link href="/tools">free WhatsApp tools</Link>.
            </p>
          </div>
        </div>
      </div>

      <ToolFaq title="WhatsApp formatting questions" items={FORMATTER_FAQS} />
    </ToolShell>
  );
}
