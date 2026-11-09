import type { Metadata } from "next";
import ImageCompressorClient from "../../../components/tools/ImageCompressorClient";
import { faqJsonLd } from "../../../components/ToolFaq";
import { IMAGE_FAQS } from "../../../lib/toolFaqs";

export const metadata: Metadata = {
  title: "Free WhatsApp Image Compressor — Keep Photos Sharp",
  description:
    "Resize and compress images before sending on WhatsApp so they lose less quality. Runs in your browser: no upload, no sign-up. Includes a WhatsApp API (under 5 MB) preset.",
  alternates: { canonical: "https://broadcast.com.ng/tools/image-compressor" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(IMAGE_FAQS)) }} />
      <ImageCompressorClient />
    </>
  );
}
