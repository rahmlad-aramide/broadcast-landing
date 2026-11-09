'use client';

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

import { APP_URL } from "../../lib/api";

const SHARE_URL = "https://broadcast.com.ng/tools?ref=share";
const SHARE_TEXT = "I just used Broadcast's free WhatsApp tools (image compressor, QR codes, template builder and more). No sign-up needed:";
const DISMISS_KEY = "broadcast.sharePromptDismissed"; // persistent: "don't show again"
const SESSION_KEY = "broadcast.sharePromptShown";     // once per visit, so batch downloads don't nag

function read(store: "local" | "session", key: string): boolean {
  try { return (store === "local" ? localStorage : sessionStorage).getItem(key) === "1"; } catch { return false; }
}
function write(store: "local" | "session", key: string) {
  try { (store === "local" ? localStorage : sessionStorage).setItem(key, "1"); } catch { /* storage blocked */ }
}

// "Tell your friends" prompt shown AFTER a download starts (it never delays or blocks it).
// Shown at most once per visit, and never again if the visitor ticks "don't show again".
export function useSharePrompt() {
  const [open, setOpen] = useState(false);

  const afterDownload = useCallback(() => {
    if (read("local", DISMISS_KEY) || read("session", SESSION_KEY)) return;
    write("session", SESSION_KEY);
    // Slight delay so the browser's own download UI appears first.
    setTimeout(() => setOpen(true), 400);
  }, []);

  const modal = open ? <ShareModal onClose={() => setOpen(false)} /> : null;
  return { afterDownload, modal };
}

function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [never, setNever] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const close = useCallback(() => {
    if (never) write("local", DISMISS_KEY);
    onClose();
  }, [never, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };
  const nativeShare = async () => {
    try { await navigator.share({ title: "Broadcast free WhatsApp tools", text: SHARE_TEXT, url: SHARE_URL }); } catch { /* cancelled */ }
  };

  return (
    <div className="lp-cookie-overlay" onClick={close}>
      <div className="lp-cookie-modal share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="share-title">Your file is downloading 🎉</h2>
        <p>
          Glad we could help. Know someone who sends WhatsApp messages or images for work? <strong>Tell them about Broadcast.</strong> These
          tools are free, and it takes a few seconds.
        </p>
        <div className="share-actions">
          <a
            className="lp-btn lp-btn-primary"
            href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Share2 size={15} /> Share on WhatsApp
          </a>
          {canNativeShare && <button type="button" className="lp-btn lp-btn-ghost" onClick={nativeShare}>More options</button>}
          <button type="button" className="lp-btn lp-btn-ghost" onClick={copy}>
            {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy link</>}
          </button>
        </div>
        <p className="share-sub">
          Sending WhatsApp messages to lots of customers? <a href={`${APP_URL}/signup`}>See what Broadcast can do</a>.
        </p>
        <label className="share-never">
          <input type="checkbox" checked={never} onChange={(e) => setNever(e.target.checked)} /> Don&apos;t show this again
        </label>
        <div className="lp-cookie-actions">
          <button type="button" className="lp-btn lp-btn-ghost" onClick={close}>Close</button>
        </div>
      </div>
    </div>
  );
}
