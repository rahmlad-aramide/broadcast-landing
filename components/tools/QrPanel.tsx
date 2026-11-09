'use client';

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import { useSharePrompt } from "./ShareModal";

type Level = "L" | "M" | "Q" | "H";

const SIZES = [
  { label: "Small (512 px)", px: 512 },
  { label: "Medium (1024 px)", px: 1024 },
  { label: "Large (2048 px)", px: 2048 },
];

// Perceived brightness, 0-255, used only to warn about inverted (light-on-dark) codes.
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
}

// QR code for the generated link. Generated in the browser by the `qrcode` library
// (loaded on demand so it doesn't weigh down the rest of the site).
export default function QrPanel({ value }: { value: string }) {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [level, setLevel] = useState<Level>("M");
  const [size, setSize] = useState(1024);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const { afterDownload, modal: shareModal } = useSharePrompt();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(value, { errorCorrectionLevel: level, margin: 2, width: 320, color: { dark: fg, light: bg } });
        if (!cancelled) { setPreview(url); setError(""); }
      } catch {
        if (!cancelled) { setPreview(""); setError("This link is too long for a QR code. Shorten the pre-filled message."); }
      }
    })();
    return () => { cancelled = true; };
  }, [value, fg, bg, level]);

  const save = (href: string, name: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    afterDownload();
  };

  const downloadPng = async () => {
    const QRCode = (await import("qrcode")).default;
    save(await QRCode.toDataURL(value, { errorCorrectionLevel: level, margin: 4, width: size, color: { dark: fg, light: bg } }), "whatsapp-qr-code-by-broadcast.png");
  };

  const downloadSvg = async () => {
    const QRCode = (await import("qrcode")).default;
    const svg = await QRCode.toString(value, { type: "svg", errorCorrectionLevel: level, margin: 4, color: { dark: fg, light: bg } });
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    save(url, "whatsapp-qr-code-by-broadcast.svg");
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const inverted = luminance(fg) > luminance(bg);
  const lowContrast = Math.abs(luminance(fg) - luminance(bg)) < 110;

  return (
    <div className="qr-panel">
      <h2 className="tool-h2">QR code</h2>
      <div className="qr-layout">
        <div className="qr-preview" aria-live="polite">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="QR code that opens your WhatsApp chat" width={200} height={200} />
          ) : (
            <p className="tool-warn" role="alert">{error || "Generating…"}</p>
          )}
        </div>
        <div className="qr-opts">
          <div className="qr-colors">
            <label>Code colour<input type="color" value={fg} onChange={(e) => setFg(e.target.value)} /></label>
            <label>Background<input type="color" value={bg} onChange={(e) => setBg(e.target.value)} /></label>
          </div>
          <label>Download size
            <select className="tool-input" value={size} onChange={(e) => setSize(Number(e.target.value))}>
              {SIZES.map((s) => <option key={s.px} value={s.px}>{s.label}</option>)}
            </select>
          </label>
          <label>Error correction
            <select className="tool-input" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
              <option value="L">Low: simplest code</option>
              <option value="M">Medium (recommended)</option>
              <option value="Q">Quartile</option>
              <option value="H">High: survives wear and damage</option>
            </select>
          </label>
          <div className="link-actions">
            <button type="button" className="lp-btn lp-btn-primary" onClick={downloadPng} disabled={!preview}><Download size={15} /> PNG</button>
            <button type="button" className="lp-btn lp-btn-ghost" onClick={downloadSvg} disabled={!preview}><Download size={15} /> SVG</button>
          </div>
        </div>
      </div>
      {(inverted || lowContrast) && (
        <p className="tool-warn" role="status">
          {inverted ? "Light-on-dark codes don't scan on every phone. " : ""}
          {lowContrast ? "Low contrast between the code and background can stop it scanning. " : ""}
          Use a dark code on a light background for best results.
        </p>
      )}
      {shareModal}
      <p className="tool-note">Test it with your phone camera before printing. Use SVG for print: it stays sharp at any size.</p>
    </div>
  );
}
