import type { Metadata } from "next";
import ApiFeesClient from "../../../components/tools/ApiFeesClient";
import { faqJsonLd } from "../../../components/ToolFaq";
import { FEES_FAQS } from "../../../lib/toolFaqs";

export const metadata: Metadata = {
  title: "WhatsApp API Fees at Zero Markup — Free Cost Calculator",
  description:
    "See how WhatsApp Business API pricing works and estimate your monthly cost. Broadcast adds 0% to Meta's message fees; you pay Meta directly plus a flat subscription.",
  alternates: { canonical: "https://broadcast.com.ng/tools/whatsapp-api-fees" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FEES_FAQS)) }} />
      <ApiFeesClient />
    </>
  );
}
