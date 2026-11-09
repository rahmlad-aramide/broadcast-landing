'use client';

import Link from "next/link";
import { ArrowRight, Calculator, ClipboardCheck, ImageDown, QrCode, Type } from "lucide-react";

import type { ReactNode } from "react";
import ToolShell from "../ToolShell";
import { TOOLS } from "../../lib/toolsList";

// Icons by route; titles, blurbs and the footer list live in lib/toolsList.ts.
const ICONS: Record<string, ReactNode> = {
  "/tools/whatsapp-formatter": <Type size={22} />,
  "/tools/whatsapp-link-generator": <QrCode size={22} />,
  "/tools/whatsapp-api-fees": <Calculator size={22} />,
  "/tools/whatsapp-template-builder": <ClipboardCheck size={22} />,
  "/tools/image-compressor": <ImageDown size={22} />,
};

export default function ToolsHubClient() {
  return (
    <ToolShell
      eyebrow="Free tools"
      title="Free tools for WhatsApp messaging"
      intro="Small, practical helpers for anyone who messages customers on WhatsApp. No sign-up, nothing stored."
    >
      <div className="tool-hub">
        {TOOLS.map((t) => (
          <Link href={t.href} className="tool-hub-card" key={t.href}>
            <span className="tool-hub-icon">{ICONS[t.href]}</span>
            <strong>{t.title}</strong>
            <p>{t.blurb}</p>
            <span className="tool-hub-go">Open tool <ArrowRight size={14} /></span>
          </Link>
        ))}
      </div>
    </ToolShell>
  );
}
