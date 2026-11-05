import type { Metadata } from "next";
import TermsOfServiceClient from "../../components/TermsOfServiceClient";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the Broadcast WhatsApp bulk messaging platform.",
  alternates: { canonical: "https://broadcast.com.ng/terms-of-service" },
};

export default function Page() {
  return <TermsOfServiceClient />;
}
