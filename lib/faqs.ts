// Single source of truth for the landing page FAQ: rendered by LandingClient and emitted
// as FAQPage structured data from app/page.tsx. Answers are plain text (no markup) so the
// structured data matches what's on screen; an optional `link` renders after the answer.
// Keep claims in sync with the product — Meta rates are deliberately given without figures
// because they differ by country and change on a schedule.

export interface Faq {
  q: string;
  a: string;
  link?: { href: string; label: string; external?: boolean };
}

export interface FaqGroup {
  id: string;
  title: string;
  items: Faq[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "pricing",
    title: "Pricing & billing",
    items: [
      {
        q: "What's the difference between Broadcast's subscription and Meta's charges?",
        a: "There are two separate bills. Broadcast's subscription (from ₦15,000/month) pays for the platform: the dashboard, templates, campaigns, dispatches, contact management and delivery tracking. Meta charges separately for the messages you send over WhatsApp, and bills you directly using the payment method on your WhatsApp account. We never handle or mark up Meta's charges. Think of it as paying us for the tool and Meta for the postage.",
        link: { href: "#pricing", label: "See our plans" },
      },
      {
        q: "How does Meta charge for messages?",
        a: "Meta charges per delivered template message. The price depends on the template's category (Marketing, Utility or Authentication) and the recipient's country. Replying to a customer who messaged you first, within 24 hours, is generally not charged. Rates change on a schedule, so check Meta's current rate card for exact figures.",
        link: {
          href: "https://developers.facebook.com/docs/whatsapp/pricing",
          label: "Meta's WhatsApp pricing",
          external: true,
        },
      },
      {
        q: "Do I need to add a payment method on Meta before I can send campaigns?",
        a: "Yes, to send template messages to people who haven't messaged you first. Until you add one in Meta Business Settings, you can only reply to customers who contact you. Broadcast reminds you with a banner until it's done.",
        link: { href: "/setup-guide", label: "Read the setup guide" },
      },
      {
        q: "Will I be charged automatically every month?",
        a: "No. Plans are one-time payments, and we don't save your card to charge it automatically. You pay when you choose to. If you renew before your plan ends, the new period is added on top of the days you have left.",
      },
      {
        q: "What happens when my subscription ends?",
        a: "Your data stays, but sending is paused and the pages that need an active plan show \"Subscription required\". Renew from the Billing page and everything resumes. We notify you (and email your admins) a few days before your plan expires.",
      },
      {
        q: "How do I pay for Broadcast?",
        a: "Payments are processed securely by Paystack in naira, using the payment options Paystack offers you. Meta's usage charges are billed by Meta separately, to the payment method on your Meta account.",
      },
    ],
  },
  {
    id: "start",
    title: "Getting started",
    items: [
      {
        q: "Do I need a Meta Business account?",
        a: "Yes. You'll need a Meta Business Manager account with the WhatsApp Business API (Cloud API) enabled. We connect directly to Meta's official API — no third-party intermediaries, no markup fees.",
      },
      {
        q: "How long does setup take?",
        a: "Most people connect their WhatsApp number in about 2 minutes through Meta's guided sign-in. After that, the main wait is Meta approving your first message template, which usually takes anywhere from a few minutes to a day.",
      },
      {
        q: "Do you offer help with setup?",
        a: "Yes. For custom or larger setups we handle onboarding and Meta Business alignment, which is quoted separately. Request a custom setup quote or send us a message. Self-serve customers can follow the in-app checklist and our setup guide.",
        link: { href: "#contact", label: "Contact us" },
      },
      {
        q: "Can my team use the same account?",
        a: "Yes. Admins can add collaborators to the workspace. Collaborators can work with contacts, templates and campaigns, but can't manage billing.",
      },
      {
        q: "How do I import my contact list?",
        a: 'Go to the Contacts page and click "Import CSV". Your file needs at minimum a phone column with the full country code (e.g. 2348012345678). Any extra columns are saved as custom fields and available for campaign personalisation.',
      },
    ],
  },
  {
    id: "sending",
    title: "Sending messages",
    items: [
      {
        q: "Why do I need templates? Can't I just type a message?",
        a: "WhatsApp only lets a business start a conversation using a message layout that Meta has approved, called a template. Once a customer replies, you can chat freely for 24 hours. You write a template once and reuse it for any number of campaigns.",
      },
      {
        q: "What's the difference between a Campaign and a Dispatch?",
        a: "A Campaign sends the same message to many people, like a promotion or announcement. A Dispatch sends the same caption with a different file for each person, like invoices or statements.",
        link: { href: "#first-send", label: "See how to send your first message" },
      },
      {
        q: "Can each contact receive a different document?",
        a: "Yes. Use a Dispatch: add a recipient's file by picking contacts and attaching their document, or import many at once with a CSV of file links or a ZIP of files. Each recipient gets their own file with the same caption.",
      },
      {
        q: "What file types can I send?",
        a: "PDFs, DOCX files, images (JPEG / PNG / WebP), and videos — either uploaded directly to Meta's media servers during template creation, or served from a publicly accessible URL stored in a contact field.",
      },
      {
        q: "How fast are messages sent, and is there a limit?",
        a: "By default we send about 2,400 messages per hour, paced to stay within Meta's limits, and failed messages are retried automatically. Your daily cap is set by Meta based on your account's sending history (starting at 1,000/day for new accounts) and rises as your account builds a good track record.",
      },
      {
        q: "What if someone doesn't want my messages?",
        a: "Contacts can reply STOP (or a similar word) and are opted out automatically. Opted-out contacts are skipped in future campaigns. You're responsible for only messaging people who have agreed to hear from you, as Meta can restrict accounts that send unwanted messages.",
      },
    ],
  },
];

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((g) => g.items);
