import type { Metadata } from "next";
import CookiePolicyClient from "../../components/CookiePolicyClient";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Which cookies Broadcast uses, why, and how to control them.",
  alternates: { canonical: "https://broadcast.com.ng/cookie-policy" },
};

export default function Page() {
  return <CookiePolicyClient />;
}
