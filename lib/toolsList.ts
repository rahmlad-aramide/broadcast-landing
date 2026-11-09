// Single list of free tools: feeds the /tools hub cards and the site footer's "Tools" column.
// To add a tool: add it here, add its icon in components/tools/ToolsHubClient.tsx, and create
// its route under app/tools/.
export interface ToolMeta {
  href: string;
  title: string;      // hub card title
  footerLabel: string; // short label for the footer
  blurb: string;
}

export const TOOLS: ToolMeta[] = [
  {
    href: "/tools/whatsapp-formatter",
    title: "WhatsApp Message Formatter",
    footerLabel: "Message Formatter",
    blurb: "Bold, italic, strikethrough, monospace, lists and quotes, with a live WhatsApp-style preview, one-click copy and a cheat sheet.",
  },
  {
    href: "/tools/whatsapp-link-generator",
    title: "WhatsApp Link & QR Code Generator",
    footerLabel: "Link & QR Generator",
    blurb: "Turn any phone number (+234, 234 or 0803) into a wa.me click-to-chat link and a downloadable QR code.",
  },
  {
    href: "/tools/whatsapp-api-fees",
    title: "WhatsApp API Fees & Cost Calculator",
    footerLabel: "API Fees Calculator",
    blurb: "How WhatsApp API pricing works, why Broadcast adds zero markup, and a calculator to estimate your monthly cost.",
  },
  {
    href: "/tools/whatsapp-template-builder",
    title: "WhatsApp Template Builder & Checker",
    footerLabel: "Template Builder",
    blurb: "Build a message template step by step and catch the mistakes Meta most often rejects before you submit.",
  },
  {
    href: "/tools/image-compressor",
    title: "WhatsApp Image Compressor",
    footerLabel: "Image Compressor",
    blurb: "Resize and compress images before sending so WhatsApp has less to degrade. Runs in your browser, nothing uploaded.",
  },
];
