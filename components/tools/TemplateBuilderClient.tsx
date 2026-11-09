'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, CheckCircle2, Copy, FileText, Image as ImageIcon, Info, Phone, Plus, Reply, Trash2, Video, XCircle, ExternalLink } from "lucide-react";

import ToolShell from "../ToolShell";
import ToolFaq from "../ToolFaq";
import { TEMPLATE_FAQS } from "../../lib/toolFaqs";
import { APP_URL } from "../../lib/api";
import { renderWhatsAppText } from "../../lib/whatsappFormat";
import {
  LANGUAGES, LIMITS, STARTERS, bodyVariableCount, checkDraft, emptyDraft, toTemplateJson, variablesIn,
  type ButtonType, type Draft, type DraftButton, type HeaderType, type Issue,
} from "../../lib/templateChecker";

const ISSUE_ICON = { error: <XCircle size={16} />, warning: <AlertTriangle size={16} />, tip: <Info size={16} /> };

function Counter({ value, max }: { value: number; max: number }) {
  return <small className={value > max ? "tool-count over" : "tool-count"}>{value}/{max}</small>;
}

export default function TemplateBuilderClient() {
  const [d, setD] = useState<Draft>({ ...emptyDraft(), ...STARTERS[0].draft } as Draft);
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD((x) => ({ ...x, [key]: value }));
  const issues = useMemo(() => checkDraft(d), [d]);
  const errors = issues.filter((i) => i.level === "error");
  const json = useMemo(() => JSON.stringify(toTemplateJson(d), null, 2), [d]);
  const varCount = bodyVariableCount(d.body);

  const setSample = (i: number, v: string) => {
    const s = [...d.samples];
    while (s.length < varCount) s.push("");
    s[i] = v;
    set("samples", s);
  };
  const setButton = (i: number, patch: Partial<DraftButton>) => set("buttons", d.buttons.map((b, k) => (k === i ? { ...b, ...patch } : b)));
  const addButton = (type: ButtonType) => set("buttons", [...d.buttons, { type, text: "", value: type === "URL" ? "https://" : "", example: "" }]);

  const copyJson = async () => {
    try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  };

  // Preview text: swap each {{n}} for its sample (or leave the token if there isn't one yet).
  const fill = (text: string, sample: (n: number) => string) => text.replace(/\{\{\s*(\d+)\s*\}\}/g, (m, n) => sample(Number(n)) || m);
  const previewBody = fill(d.body, (n) => d.samples[n - 1] || "");
  const previewHeader = fill(d.headerText, () => d.headerExample);

  const HeaderMedia = d.headerType === "IMAGE" ? ImageIcon : d.headerType === "VIDEO" ? Video : FileText;

  return (
    <ToolShell
      eyebrow="Free tool"
      title="WhatsApp template builder & checker"
      crumb="WhatsApp template builder"
      benefits={["Write a template step by step.", "Catch common Meta rejections before you submit.", "Nothing is stored or sent."]}
      intro="Build a WhatsApp message template, see a live preview, and get flagged on the mistakes Meta most often rejects: variables in the wrong place, missing samples, wrong category, and more. Then copy the ready-to-use JSON."
    >
      <div className="tool-examples" role="group" aria-label="Start from an example" style={{ marginBottom: 18 }}>
        <span>Start from:</span>
        {STARTERS.map((s) => (
          <button key={s.label} type="button" onClick={() => setD({ ...emptyDraft(), ...s.draft } as Draft)}>{s.label}</button>
        ))}
        <button type="button" onClick={() => setD(emptyDraft())}>Blank</button>
      </div>

      <div className="tool-grid">
        <div className="tool-panel tpl-form">
          <div className="tpl-two">
            <label>Template name
              <input className="tool-input" value={d.name} placeholder="order_update" onChange={(e) => set("name", e.target.value)} />
              <small>Lowercase letters, numbers and underscores.</small>
            </label>
            <label>Language
              <select className="tool-input" value={d.language} onChange={(e) => set("language", e.target.value)}>
                {LANGUAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          </div>

          <fieldset className="tpl-cat">
            <legend>Category</legend>
            {([["UTILITY", "Utility", "Updates a customer expects: orders, bookings, receipts."], ["MARKETING", "Marketing", "Promotions, offers, announcements."]] as const).map(([v, l, h]) => (
              <label key={v} className={d.category === v ? "active" : ""}>
                <input type="radio" name="category" checked={d.category === v} onChange={() => set("category", v)} />
                <strong>{l}</strong><span>{h}</span>
              </label>
            ))}
            <small>One-time passcode (authentication) templates use a fixed format in WhatsApp Manager and can&apos;t be freely written.</small>
          </fieldset>

          <div className="tpl-two">
            <label>Header (optional)
              <select className="tool-input" value={d.headerType} onChange={(e) => set("headerType", e.target.value as HeaderType)}>
                <option value="NONE">None</option>
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="DOCUMENT">Document</option>
                <option value="VIDEO">Video</option>
              </select>
            </label>
            {d.headerType === "TEXT" && (
              <label>Header text <Counter value={d.headerText.length} max={LIMITS.header} />
                <input className="tool-input" value={d.headerText} onChange={(e) => set("headerText", e.target.value)} placeholder="Your order has shipped" />
              </label>
            )}
          </div>
          {d.headerType === "TEXT" && variablesIn(d.headerText).length === 1 && (
            <label>Header sample for the variable
              <input className="tool-input" value={d.headerExample} onChange={(e) => set("headerExample", e.target.value)} />
            </label>
          )}

          <label>Message body <Counter value={d.body.length} max={LIMITS.body} />
            <textarea className="tool-input" rows={7} value={d.body} onChange={(e) => set("body", e.target.value)}
              placeholder="Hi {{1}}, your order {{2}} has shipped…" />
            <small>Use <code>{"{{1}}"}</code>, <code>{"{{2}}"}</code>… for details that change per person. Supports *bold*, _italic_, ~strike~.</small>
          </label>

          {varCount > 0 && (
            <div className="tpl-samples">
              <strong>Sample values</strong>
              <small>Meta requires an example for every variable. Use realistic ones.</small>
              {Array.from({ length: varCount }, (_, i) => (
                <label key={i} className="tpl-sample">
                  <span>{`{{${i + 1}}}`}</span>
                  <input className="tool-input" value={d.samples[i] || ""} onChange={(e) => setSample(i, e.target.value)} placeholder={`Example for {{${i + 1}}}`} />
                </label>
              ))}
            </div>
          )}

          <label>Footer (optional) <Counter value={d.footer.length} max={LIMITS.footer} />
            <input className="tool-input" value={d.footer} onChange={(e) => set("footer", e.target.value)} placeholder="Reply STOP to unsubscribe" />
          </label>

          <div className="tpl-buttons">
            <strong>Buttons (optional)</strong>
            {d.buttons.map((b, i) => (
              <div className="tpl-button" key={i}>
                <div className="tpl-button-head">
                  <span>{b.type === "QUICK_REPLY" ? "Quick reply" : b.type === "URL" ? "Website" : "Call"}</span>
                  <button type="button" className="lp-btn lp-btn-ghost" onClick={() => set("buttons", d.buttons.filter((_, k) => k !== i))} aria-label={`Remove button ${i + 1}`}><Trash2 size={14} /></button>
                </div>
                <input className="tool-input" value={b.text} maxLength={40} placeholder="Button text" onChange={(e) => setButton(i, { text: e.target.value })} />
                {b.type === "URL" && (
                  <>
                    <input className="tool-input" value={b.value} placeholder="https://example.com/track/{{1}}" onChange={(e) => setButton(i, { value: e.target.value })} />
                    {variablesIn(b.value).length === 1 && <input className="tool-input" value={b.example} placeholder="Example link, e.g. https://example.com/track/10452" onChange={(e) => setButton(i, { example: e.target.value })} />}
                  </>
                )}
                {b.type === "PHONE_NUMBER" && <input className="tool-input" value={b.value} placeholder="+2348031234567" onChange={(e) => setButton(i, { value: e.target.value })} />}
              </div>
            ))}
            <div className="tpl-add">
              <button type="button" className="lp-btn lp-btn-ghost" onClick={() => addButton("QUICK_REPLY")}><Plus size={14} /> Quick reply</button>
              <button type="button" className="lp-btn lp-btn-ghost" onClick={() => addButton("URL")}><Plus size={14} /> Website</button>
              <button type="button" className="lp-btn lp-btn-ghost" onClick={() => addButton("PHONE_NUMBER")}><Plus size={14} /> Call</button>
            </div>
          </div>
        </div>

        <div className="tpl-side">
          <div className="tool-panel">
            <div className="tool-preview-label">Preview</div>
            <div className="wa-phone">
              <div className="wa-phone-bar">Your business</div>
              <div className="wa-phone-chat">
                <div className="wa-bubble tpl-bubble">
                  {d.headerType === "TEXT" && d.headerText && <div className="tpl-bubble-header">{previewHeader}</div>}
                  {d.headerType !== "NONE" && d.headerType !== "TEXT" && (
                    <div className="tpl-bubble-media"><HeaderMedia size={28} /><span>{d.headerType.toLowerCase()}</span></div>
                  )}
                  <div className="wa-text">{d.body ? renderWhatsAppText(previewBody) : <span className="wa-empty">Your message appears here</span>}</div>
                  {d.footer && <div className="tpl-bubble-footer">{d.footer}</div>}
                  <span className="wa-bubble-time">10:24</span>
                </div>
                {d.buttons.filter((b) => b.text).map((b, i) => (
                  <div className="tpl-bubble-btn" key={i}>
                    {b.type === "QUICK_REPLY" ? <Reply size={14} /> : b.type === "URL" ? <ExternalLink size={14} /> : <Phone size={14} />} {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tool-panel">
            <div className="tpl-check-head">
              <h2 className="tool-h2" style={{ margin: 0 }}>Checker</h2>
              {errors.length === 0 ? <span className="tpl-pill ok"><CheckCircle2 size={14} /> Looks good</span> : <span className="tpl-pill bad">{errors.length} to fix</span>}
            </div>
            {issues.length === 0 ? (
              <p className="tool-note">No problems found. Meta&apos;s review makes the final call.</p>
            ) : (
              <ul className="tpl-issues">
                {issues.map((i: Issue, k) => (
                  <li key={k} className={`tpl-issue ${i.level}`}>{ISSUE_ICON[i.level]}<span>{i.message}</span></li>
                ))}
              </ul>
            )}
            <p className="tool-note">Based on the rules Meta most commonly rejects templates for. It&apos;s guidance, not a guarantee. Meta&apos;s rules can change.</p>
          </div>

          <div className="tool-panel">
            <h2 className="tool-h2">Template JSON</h2>
            <pre className="tpl-json">{json}</pre>
            <div className="tool-actions" style={{ marginTop: 12 }}>
              <button type="button" className="lp-btn lp-btn-primary" onClick={copyJson} disabled={errors.length > 0} title={errors.length ? "Fix the errors first" : undefined}>
                {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy JSON</>}
              </button>
              <a className="lp-btn lp-btn-ghost" href={`${APP_URL}/signup`}>Create it in Broadcast</a>
            </div>
          </div>
        </div>
      </div>

      <div className="tool-guide">
        <h2>Tips for templates that get approved</h2>
        <ul className="tool-tips">
          <li><strong>Pick the honest category.</strong> Promotional wording in a Utility template often gets it reclassified as Marketing, which costs more per message.</li>
          <li><strong>Start and end with words.</strong> Open with a greeting and close with a sentence, not a variable.</li>
          <li><strong>Give every variable context.</strong> “Your order {"{{2}}"} ships on {"{{3}}"}” beats a message that is mostly variables.</li>
          <li><strong>Use realistic samples.</strong> “Ada” and “#10452”, not “test” or “abc”.</li>
          <li><strong>Make opting out easy</strong> on marketing messages, for example “Reply STOP to unsubscribe” in the footer.</li>
          <li><strong>Avoid shortened links.</strong> Use your full website address.</li>
        </ul>
        <p className="tool-guide-lead">
          Related: <Link href="/tools/whatsapp-formatter">message formatter</Link> · <Link href="/tools/whatsapp-api-fees">API fee calculator</Link> · <Link href="/setup-guide#templates">templates and pricing guide</Link>
        </p>
      </div>

      <ToolFaq title="WhatsApp template questions" items={TEMPLATE_FAQS} />
    </ToolShell>
  );
}
