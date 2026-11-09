'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "./Icon";
import ThemeMenu from "./ThemeMenu";
import SiteFooter from "./SiteFooter";
import { APP_URL } from "../lib/api";

// Shared frame for the free-tools pages: same nav/footer language as the legal pages, plus a
// soft call to action, since these tools exist to bring people to Broadcast.
export default function ToolShell({ eyebrow, title, intro, crumb, benefits, children }: { eyebrow: string; title: string; intro: string; crumb?: string; benefits?: string[]; children: ReactNode }) {
  return (
    <div className="lp">
      <div className="lp-glow-container">
        <div className="lp-glow lp-glow-1"></div>
        <div className="lp-glow lp-glow-2"></div>
      </div>

      <nav className="lp-nav" aria-label="Main">
        <div className="lp-nav-inner">
          <Link href="/" className="lp-logo">
            <Icon /> Broadcast
          </Link>
          <div className="lp-nav-actions">
            <Link href="/tools" className="lp-nav-link-text">All free tools</Link>
            <a href={`${APP_URL}/login`} className="lp-nav-link-text">Login</a>
            <ThemeMenu />
            <Link href="/" className="lp-btn lp-btn-ghost">← Home</Link>
          </div>
        </div>
      </nav>

      <section className="lp-section">
        <div className="lp-section-inner">
          <nav className="tool-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span> <Link href="/tools">Free tools</Link>
            {crumb && <><span aria-hidden="true">/</span> <span aria-current="page">{crumb}</span></>}
          </nav>
          <div className="lp-eyebrow">{eyebrow}</div>
          <h1 className="lp-section-title">{title}</h1>
          <p className="lp-section-sub">{intro}</p>
          {benefits && (
            <ul className="tool-benefits">
              {benefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
          )}
          <div style={{ marginTop: 40 }}>{children}</div>

          <div className="tool-cta">
            <div>
              <strong>Sending WhatsApp messages to more than a few people?</strong>
              <span>Broadcast lets you send approved templates, invoices and documents to thousands of contacts from one dashboard.</span>
            </div>
            <a href={`${APP_URL}/signup`} className="lp-btn lp-btn-primary">Try Broadcast</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
