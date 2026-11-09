import type { Metadata } from "next";
import TemplateBuilderClient from "../../../components/tools/TemplateBuilderClient";
import { faqJsonLd } from "../../../components/ToolFaq";
import { TEMPLATE_FAQS } from "../../../lib/toolFaqs";

export const metadata: Metadata = {
  title: "WhatsApp Template Builder & Checker — Avoid Meta Rejections",
  description:
    "Build a WhatsApp message template with a live preview and check it against the rules Meta most often rejects: variables, samples, category, buttons. Free, no sign-up.",
  alternates: { canonical: "https://broadcast.com.ng/tools/whatsapp-template-builder" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(TEMPLATE_FAQS)) }} />
      <TemplateBuilderClient />
    </>
  );
}
