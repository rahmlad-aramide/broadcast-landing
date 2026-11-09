import type { Metadata } from "next";
import WhatsAppFormatterClient from "../../../components/tools/WhatsAppFormatterClient";
import { faqJsonLd } from "../../../components/ToolFaq";
import { FORMATTER_FAQS } from "../../../lib/toolFaqs";

export const metadata: Metadata = {
  title: "Free WhatsApp Message Formatter — Bold, Italic, Lists & Preview",
  description:
    "Format WhatsApp messages with bold, italic, strikethrough, monospace, bullet lists, numbered lists and quotes. Live WhatsApp-style preview, one-click copy. Free, no sign-up.",
  alternates: { canonical: "https://broadcast.com.ng/tools/whatsapp-formatter" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FORMATTER_FAQS)) }} />
      <WhatsAppFormatterClient />
    </>
  );
}
