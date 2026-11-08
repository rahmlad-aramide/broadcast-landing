import type { Metadata } from "next";
import SetupGuideClient from "../../components/SetupGuideClient";

export const metadata: Metadata = {
  title: "WhatsApp Setup Guide",
  description:
    "Step-by-step guide to connecting your WhatsApp Business number to Broadcast: Facebook signup, website field, display name, verification and payment method.",
  alternates: { canonical: "https://broadcast.com.ng/setup-guide" },
};

export default function Page() {
  return <SetupGuideClient />;
}
