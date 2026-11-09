'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download, ImageIcon, Trash2, Upload } from "lucide-react";

import ToolShell from "../ToolShell";
import ToolFaq from "../ToolFaq";
import { IMAGE_FAQS } from "../../lib/toolFaqs";
import { ACCEPTED, PRESETS, compressImage, formatBytes, outputName, type CompressResult, type Preset } from "../../lib/imageCompress";
import { createZip } from "../../lib/zip";
import { useSharePrompt } from "./ShareModal";

const MAX_FILES = 20;
const MAX_INPUT_BYTES = 40 * 1024 * 1024;

interface Item {
  id: string;
  file: File;
  status: "working" | "done" | "error";
  error?: string;
  result?: CompressResult;
  url?: string; // object URL of the compressed blob
  previewUrl: string; // object URL of the original
}

let counter = 0;

export default function ImageCompressorClient() {
  const [presetId, setPresetId] = useState<Preset["id"]>("chat");
  const [custom, setCustom] = useState({ maxDimension: 1600, quality: 85 });
  const [items, setItems] = useState<Item[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState("");
  const { afterDownload, modal: shareModal } = useSharePrompt();
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

  const preset = PRESETS.find((p) => p.id === presetId)!;
  const settings = presetId === "custom"
    ? { maxDimension: custom.maxDimension, quality: custom.quality / 100 }
    : { maxDimension: preset.maxDimension, quality: preset.quality, maxBytes: preset.maxBytes };

  // Free object URLs when leaving the page.
  useEffect(() => () => {
    itemsRef.current.forEach((i) => { URL.revokeObjectURL(i.previewUrl); if (i.url) URL.revokeObjectURL(i.url); });
  }, []);

  const run = async (item: Item, s: typeof settings) => {
    try {
      const result = await compressImage(item.file, s);
      const url = URL.createObjectURL(result.blob);
      setItems((prev) => prev.map((i) => {
        if (i.id !== item.id) return i;
        if (i.url) URL.revokeObjectURL(i.url);
        return { ...i, status: "done", result, url, error: undefined };
      }));
    } catch (err) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: err instanceof Error ? err.message : "Could not process this image" } : i)));
    }
  };

  const addFiles = (list: FileList | File[]) => {
    setNotice("");
    const files = Array.from(list);
    const room = MAX_FILES - items.length;
    const accepted: File[] = [];
    const skipped: string[] = [];
    for (const f of files) {
      if (!ACCEPTED.includes(f.type)) skipped.push(`${f.name} (unsupported type — use JPG, PNG, WebP; HEIC isn't supported by most browsers)`);
      else if (f.size > MAX_INPUT_BYTES) skipped.push(`${f.name} (over 40 MB)`);
      else accepted.push(f);
    }
    if (accepted.length > room) skipped.push(`${accepted.length - room} file(s) over the ${MAX_FILES}-image limit`);
    if (skipped.length) setNotice(`Skipped: ${skipped.join("; ")}`);
    const next = accepted.slice(0, Math.max(0, room)).map<Item>((file) => ({
      id: `img-${++counter}`, file, status: "working", previewUrl: URL.createObjectURL(file),
    }));
    if (!next.length) return;
    setItems((prev) => [...prev, ...next]);
    next.forEach((it) => void run(it, settings));
  };

  const recompressAll = (s: typeof settings) => {
    setItems((prev) => prev.map((i) => ({ ...i, status: "working" })));
    itemsRef.current.forEach((it) => void run(it, s));
  };

  const changePreset = (id: Preset["id"]) => {
    setPresetId(id);
    const p = PRESETS.find((x) => x.id === id)!;
    const s = id === "custom" ? { maxDimension: custom.maxDimension, quality: custom.quality / 100 } : { maxDimension: p.maxDimension, quality: p.quality, maxBytes: p.maxBytes };
    if (items.length) recompressAll(s);
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const it = prev.find((i) => i.id === id);
      if (it) { URL.revokeObjectURL(it.previewUrl); if (it.url) URL.revokeObjectURL(it.url); }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((i) => { URL.revokeObjectURL(i.previewUrl); if (i.url) URL.revokeObjectURL(i.url); });
    setItems([]);
    setNotice("");
  };

  const download = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    afterDownload();
  };

  const downloadAll = async () => {
    const done = items.filter((i) => i.status === "done" && i.result);
    if (done.length === 1) return download(done[0].url!, outputName(done[0].file.name));
    const used = new Set<string>();
    const files = done.map((i) => {
      let name = outputName(i.file.name);
      for (let n = 2; used.has(name); n++) name = outputName(i.file.name).replace(/\.jpg$/, `-${n}.jpg`);
      used.add(name);
      return { name, blob: i.result!.blob };
    });
    const zip = await createZip(files);
    const url = URL.createObjectURL(zip);
    download(url, "whatsapp-images-by-broadcast.zip");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const done = items.filter((i) => i.status === "done" && i.result);
  const before = done.reduce((n, i) => n + i.file.size, 0);
  const after = done.reduce((n, i) => n + i.result!.blob.size, 0);

  return (
    <ToolShell
      eyebrow="Free tool"
      title="Compress images for WhatsApp, keep them sharp."
      crumb="WhatsApp image compressor"
      benefits={["No sign-up.", "Your images never leave your device.", "Removes photo location data."]}
      intro="WhatsApp shrinks and squeezes photos you send. Resizing and compressing them first, to about the size WhatsApp would use anyway, leaves it far less to throw away, so they usually arrive looking better. Free, and it all happens in your browser. Compress as your last step and send the file untouched."
    >
      <div className="tool-panel">
        <div className="img-presets" role="radiogroup" aria-label="Compression preset">
          {PRESETS.map((p) => (
            <label key={p.id} className={presetId === p.id ? "active" : ""}>
              <input type="radio" name="preset" checked={presetId === p.id} onChange={() => changePreset(p.id)} />
              <strong>{p.label}</strong>
              <span>{p.description}</span>
            </label>
          ))}
        </div>

        {presetId === "custom" && (
          <div className="img-custom">
            <label>Longest side: <strong>{custom.maxDimension}px</strong>
              <input type="range" min={480} max={4096} step={32} value={custom.maxDimension}
                onChange={(e) => setCustom({ ...custom, maxDimension: Number(e.target.value) })}
                onPointerUp={() => items.length && recompressAll({ maxDimension: custom.maxDimension, quality: custom.quality / 100 })}
                onKeyUp={() => items.length && recompressAll({ maxDimension: custom.maxDimension, quality: custom.quality / 100 })} />
            </label>
            <label>Quality: <strong>{custom.quality}%</strong>
              <input type="range" min={50} max={100} step={1} value={custom.quality}
                onChange={(e) => setCustom({ ...custom, quality: Number(e.target.value) })}
                onPointerUp={() => items.length && recompressAll({ maxDimension: custom.maxDimension, quality: custom.quality / 100 })}
                onKeyUp={() => items.length && recompressAll({ maxDimension: custom.maxDimension, quality: custom.quality / 100 })} />
            </label>
          </div>
        )}

        <p className="img-rule" role="note">
          <strong>Compress last. Don&apos;t edit it afterwards.</strong> Crop, adjust and add text <em>before</em> compressing, then send the
          downloaded file exactly as it is. Editing, re-saving, screenshotting or filtering it again compresses it a second time and
          undoes the benefit. <strong>Posting to WhatsApp Status?</strong> Post the compressed file straight to Status, as it is: don&apos;t open
          it in WhatsApp&apos;s own editor to crop, draw, add text or stickers, as that re-saves it and brings the quality loss back.
        </p>

        <div
          className={`img-drop${dragOver ? " over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        >
          <Upload size={28} />
          <strong>Drop images here</strong>
          <span>JPG, PNG or WebP · up to {MAX_FILES} images · 40 MB each</span>
          <button type="button" className="lp-btn lp-btn-primary" onClick={() => inputRef.current?.click()}>Choose images</button>
          <input ref={inputRef} type="file" accept={ACCEPTED.join(",")} multiple hidden onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
        </div>

        {notice && <p className="tool-warn" role="status">{notice}</p>}

        {items.length > 0 && (
          <>
            <div className="img-summary">
              <span>
                {done.length} of {items.length} ready
                {done.length > 0 && <> · {formatBytes(before)} → <strong>{formatBytes(after)}</strong> ({before > 0 ? Math.max(0, Math.round((1 - after / before) * 100)) : 0}% smaller)</>}
              </span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className="lp-btn lp-btn-ghost" onClick={clearAll}><Trash2 size={15} /> Clear all</button>
                <button type="button" className="lp-btn lp-btn-primary" onClick={downloadAll} disabled={done.length === 0}>
                  <Download size={15} /> {done.length > 1 ? "Download all (.zip)" : "Download"}
                </button>
              </div>
            </div>

            {done.length > 0 && (
              <p className="img-rule img-rule-done" role="note">
                Ready to send. Share the downloaded file as it is. Don&apos;t crop, filter or re-save it. For WhatsApp Status, post it directly with no edits. In chats, send it as a photo, or as a Document to avoid WhatsApp compressing it again.
              </p>
            )}

            <ul className="img-list">
              {items.map((it) => (
                <li key={it.id} className="img-item">
                  <div className="img-thumbs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.url || it.previewUrl} alt={`Preview of ${it.file.name}`} />
                  </div>
                  <div className="img-meta">
                    <strong title={it.file.name}>{it.file.name}</strong>
                    {it.status === "working" && <span>Compressing…</span>}
                    {it.status === "error" && <span className="img-err">{it.error}</span>}
                    {it.status === "done" && it.result && (
                      <span>
                        {it.result.originalWidth}×{it.result.originalHeight} → {it.result.width}×{it.result.height}px · {formatBytes(it.file.size)} → <strong>{formatBytes(it.result.blob.size)}</strong>
                        {it.result.blob.size >= it.file.size && <em> (already small — original may be better)</em>}
                      </span>
                    )}
                  </div>
                  <div className="img-item-actions">
                    {it.status === "done" && it.url && (
                      <button type="button" className="lp-btn lp-btn-ghost" onClick={() => download(it.url!, outputName(it.file.name))} aria-label={`Download ${it.file.name}`}><Download size={15} /></button>
                    )}
                    <button type="button" className="lp-btn lp-btn-ghost" onClick={() => remove(it.id)} aria-label={`Remove ${it.file.name}`}><Trash2 size={15} /></button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {items.length === 0 && (
          <p className="tool-note" style={{ display: "flex", gap: 8, alignItems: "center" }}><ImageIcon size={14} /> Output is a JPG. Transparent areas become white.</p>
        )}
      </div>

      <div className="tool-guide">
        <h2>How to get the best quality on WhatsApp</h2>
        <ul className="tool-tips">
          <li><strong>Compress last, then send the file untouched.</strong> Do your cropping, edits and text first. Once compressed, don&apos;t open it in an editor, add a filter, screenshot it or re-save it: each pass compresses it again.</li>
          <li><strong>For WhatsApp Status, post it directly.</strong> Make your edits first, compress last, then upload the compressed file to Status without touching it. Skip WhatsApp&apos;s own editing tools (crop, draw, text, stickers, filters): saving those changes re-encodes the picture again.</li>
          <li><strong>Compress first, then send as a photo.</strong> Use the recommended preset: the image is already near WhatsApp&apos;s own size, so it is recompressed far less.</li>
          <li><strong>Need the original untouched?</strong> Send it as a <em>Document</em>. WhatsApp doesn&apos;t recompress documents, though the picture won&apos;t show as a preview.</li>
          <li><strong>Screenshots and text-heavy images</strong> suffer most from compression. Use the &quot;Sharper&quot; preset or send as a document.</li>
          <li><strong>Avoid forwarding through other apps</strong> (social apps, messengers or photo editors) before it reaches WhatsApp. Many of them recompress too.</li>
          <li><strong>Sending through the WhatsApp API?</strong> Header images can be up to 5 MB. The API preset keeps your file under that.</li>
        </ul>
        <h3>What WhatsApp does to a photo</h3>
        <p className="tool-guide-lead">
          As generally described: it <strong>downscales</strong> the image (standard quality is roughly 1280–1600 px on the longest side;
          HD allows roughly 2048–3120 px, depending on the phone), <strong>re-encodes</strong> it as a lossy image at around 70–80%
          quality, applies <strong>4:2:0 colour subsampling</strong> (less colour detail), <strong>strips metadata</strong> such as camera
          settings and GPS, and converts colours to <strong>sRGB</strong>. Fine text, thin lines and screenshots suffer most.
        </p>
        <p className="tool-guide-lead" style={{ marginTop: 16 }}>
          Related: <Link href="/tools/whatsapp-formatter">WhatsApp message formatter</Link> · <Link href="/tools/whatsapp-api-fees">WhatsApp API fee calculator</Link> · <Link href="/tools">all free tools</Link>
        </p>
      </div>

      <ToolFaq title="WhatsApp image compression questions" items={IMAGE_FAQS} />
      {shareModal}
    </ToolShell>
  );
}
