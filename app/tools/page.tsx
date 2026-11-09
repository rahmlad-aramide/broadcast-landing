import type { Metadata } from "next";
import ToolsHubClient from "../../components/tools/ToolsHubClient";

export const metadata: Metadata = {
  title: "Free WhatsApp Tools",
  description: "Free tools for WhatsApp messaging: message formatter and more. No sign-up required.",
  alternates: { canonical: "https://broadcast.com.ng/tools" },
};

export default function Page() {
  return <ToolsHubClient />;
}
