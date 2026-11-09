import { Fragment, type ReactNode } from 'react';

// KEEP IN SYNC with broadcast-app/dashboard/src/utils/whatsappFormat.tsx (the inbox uses the same rules).
// Landing variant: links render as inert spans (this is a preview, nothing should navigate).
//
// Renders WhatsApp-style message text as React elements (never raw HTML, so a hostile
// message can't inject markup):
//   *bold*  _italic_  ~strike~  `code`  ```block```  > quote  - bullet  1. numbered
// Opening markers must sit at the start of a word and closing markers right after text,
// matching WhatsApp's own rules (so "2*3*4" or snake_case_names aren't formatted).

const URL_RE = /https?:\/\/[^\s<]+/gi;
const MARK_RE = /(^|[\s([{"'])(\*|_|~)(?=\S)([\s\S]*?\S)\2(?=$|[\s.,!?;:)\]}"'])/;
const TAGS: Record<string, 'strong' | 'em' | 's'> = { '*': 'strong', _: 'em', '~': 's' };

export type OpenLink = (url: string) => void;

// "https://x.com/a)." -> link "https://x.com/a", trailing ")." stays plain text.
function splitTrailingPunctuation(raw: string): [string, string] {
    let url = raw;
    let tail = '';
    for (;;) {
        const last = url[url.length - 1];
        const unbalancedParen = last === ')' && (url.match(/\(/g) || []).length < (url.match(/\)/g) || []).length;
        if (last && (/[.,!?;:'"*_~]/.test(last) || unbalancedParen)) {
            tail = last + tail;
            url = url.slice(0, -1);
        } else break;
    }
    return [url, tail];
}

function formatMarks(text: string, key: string): ReactNode[] {
    const out: ReactNode[] = [];
    let rest = text;
    let n = 0;
    for (;;) {
        const m = MARK_RE.exec(rest);
        if (!m) { if (rest) out.push(rest); break; }
        const before = rest.slice(0, m.index) + m[1];
        if (before) out.push(before);
        const Tag = TAGS[m[2]];
        out.push(<Tag key={`${key}-m${n++}`}>{formatMarks(m[3], `${key}-m${n}`)}</Tag>);
        rest = rest.slice(m.index + m[0].length);
    }
    return out;
}

function formatLinks(text: string, key: string, onOpenLink?: OpenLink): ReactNode[] {
    const out: ReactNode[] = [];
    let last = 0;
    let n = 0;
    for (const m of text.matchAll(URL_RE)) {
        const start = m.index ?? 0;
        const [url, tail] = splitTrailingPunctuation(m[0]);
        if (start > last) out.push(...formatMarks(text.slice(last, start), `${key}-t${n}`));
        out.push(
            <span key={`${key}-l${n}`} className="wa-link" title={onOpenLink ? url : undefined} onClick={onOpenLink ? () => onOpenLink(url) : undefined}>
                {url}
            </span>,
        );
        if (tail) out.push(tail);
        last = start + m[0].length;
        n++;
    }
    if (last < text.length) out.push(...formatMarks(text.slice(last), `${key}-t${n}`));
    return out;
}

function formatInline(text: string, key: string, onOpenLink?: OpenLink): ReactNode[] {
    const out: ReactNode[] = [];
    const parts = text.split(/(`[^`\n]+`)/g);
    parts.forEach((part, i) => {
        if (/^`[^`\n]+`$/.test(part)) out.push(<code key={`${key}-c${i}`} className="wa-code">{part.slice(1, -1)}</code>);
        else if (part) out.push(...formatLinks(part, `${key}-p${i}`, onOpenLink));
    });
    return out;
}

function formatBlock(text: string, key: string, onOpenLink?: OpenLink): ReactNode[] {
    const lines = text.split('\n');
    const out: ReactNode[] = [];
    let quote: string[] = [];
    const flushQuote = (i: number) => {
        if (!quote.length) return;
        out.push(<blockquote key={`${key}-q${i}`} className="wa-quote">{formatInline(quote.join('\n'), `${key}-q${i}`, onOpenLink)}</blockquote>);
        quote = [];
    };
    lines.forEach((line, i) => {
        const q = /^>\s?(.*)$/.exec(line);
        if (q) { quote.push(q[1]); return; }
        flushQuote(i);
        const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
        const numbered = /^\s*(\d+)\.\s+(.*)$/.exec(line);
        if (bullet) out.push(<div key={`${key}-b${i}`} className="wa-li"><span aria-hidden="true">•</span><span>{formatInline(bullet[1], `${key}-b${i}`, onOpenLink)}</span></div>);
        else if (numbered) out.push(<div key={`${key}-n${i}`} className="wa-li"><span aria-hidden="true">{numbered[1]}.</span><span>{formatInline(numbered[2], `${key}-n${i}`, onOpenLink)}</span></div>);
        else {
            out.push(<Fragment key={`${key}-ln${i}`}>{formatInline(line, `${key}-ln${i}`, onOpenLink)}</Fragment>);
            if (i < lines.length - 1 && !(/^>\s?/.test(lines[i + 1]) || /^\s*([-*]|\d+\.)\s+/.test(lines[i + 1]))) out.push(<br key={`${key}-br${i}`} />);
        }
    });
    flushQuote(lines.length);
    return out;
}

export function renderWhatsAppText(text: string, onOpenLink?: OpenLink): ReactNode {
    const segments = text.split(/(```[\s\S]*?```)/g);
    return segments.map((seg, i) => {
        const block = /^```([\s\S]*?)```$/.exec(seg);
        if (block) return <pre key={i} className="wa-pre">{block[1].replace(/^\n/, '')}</pre>;
        return seg ? <Fragment key={i}>{formatBlock(seg, `s${i}`, onOpenLink)}</Fragment> : null;
    });
}

/** Plain-text version for places that can't show formatting (e.g. the chat-list preview). */
export function stripWhatsAppFormatting(text: string): string {
    let t = text.replace(/```([\s\S]*?)```/g, '$1').replace(/`([^`\n]+)`/g, '$1');
    for (let i = 0; i < 2; i++) {
        t = t.replace(new RegExp(MARK_RE.source, 'g'), (_m, pre: string, _mark: string, inner: string) => pre + inner);
    }
    return t;
}
