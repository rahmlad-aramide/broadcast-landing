import type { ToolFaqItem } from "../lib/toolFaqs";

export default function ToolFaq({ items, title }: { items: ToolFaqItem[]; title: string }) {
  return (
    <div className="tool-faq">
      <h2>{title}</h2>
      <div className="lp-faq-list" style={{ marginTop: 16 }}>
        {items.map((f) => (
          <details className="lp-faq-item" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function faqJsonLd(items: ToolFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
