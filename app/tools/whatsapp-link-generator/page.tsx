import type { Metadata } from "next";
import LinkGeneratorClient from "../../../components/tools/LinkGeneratorClient";
import { faqJsonLd } from "../../../components/ToolFaq";
import { LINK_FAQS } from "../../../lib/toolFaqs";

export const metadata: Metadata = {
  title: "Free WhatsApp Link & QR Code Generator — wa.me Click-to-Chat",
  description:
    "Create a WhatsApp click-to-chat link (wa.me) and a downloadable QR code from any phone number format: +234, 234 or 0803. Add a pre-filled message. Free, no sign-up.",
  alternates: { canonical: "https://broadcast.com.ng/tools/whatsapp-link-generator" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(LINK_FAQS)) }} />
      <LinkGeneratorClient />
    </>
  );
}
