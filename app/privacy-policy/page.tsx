import type { Metadata } from "next";
import PrivacyPolicyClient from "../../components/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Broadcast collects, processes, and secures personal data for its WhatsApp bulk messaging platform.",
  alternates: { canonical: "https://broadcast.com.ng/privacy-policy" },
};

export default function Page() {
  return <PrivacyPolicyClient />;
}
